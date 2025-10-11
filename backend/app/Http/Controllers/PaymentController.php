<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CurrencyController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Models\User;
use App\Models\Transaction;
use App\Models\UnprocessedPayments;
use App\Models\FailedTransactions;
use App\Models\Vote;
use Illuminate\Support\Facades\Cache;


class PaymentController extends Controller
{
    //


public function generateAccountNumber(Request $request)
{
    // 1️⃣ Validate input
    $validated = $request->validate([
        'fullName' => 'required|string',
        'email' => 'required|email',
        'numberOfVotes' => 'required|integer|min:1',
        'contestantName' => 'required|string',
        'contestantNumber' => 'required|string',
    ]);

    $voterFullname = $validated['fullName'];
    $voterEmail = $validated['email'];
    $numberOfVotes = $validated['numberOfVotes'];
    $contestantName = $validated['contestantName'];
    $contestantNumber = $validated['contestantNumber'];

    $amountInNaira = $numberOfVotes * 100;
    $amountInKobo = intval($amountInNaira * 100);

    // 2️⃣ Metadata for tracking
    $meta = [
        'voterFullname' => $voterFullname,
        'voterEmail' => $voterEmail,
        'contestantName' => $contestantName,
        'contestantNumber' => $contestantNumber,
    ];

    try {
        $reference = 'VOTE-' . Str::upper(Str::random(10));
        $paystackSecret = env('PAYSTACK_SECRET_KEY');

        // 3️⃣ Initialize transaction for BANK TRANSFER
        $response = Http::withToken($paystackSecret)
            ->post('https://api.paystack.co/transaction/initialize', [
                'amount' => $amountInKobo,
                'email' => $voterEmail,
                'reference' => $reference,
                'channels' => ['bank_transfer'], // 👈 This makes Paystack return a temp bank account
                'metadata' => $meta,
                // ❌ No 'amount' key since user decides how much to pay
            ]);
        $resData = $response->json();

        // 4️⃣ Handle API errors
        if (!$response->successful() || !$resData['status']) {
        return $resData;
            Log::error('Paystack Error', ['response' => $resData]);
            return response()->json([
                'code' => 'error',
                'message' => $resData['message'] ?? 'Failed to initialize transfer',
            ]);
        }

        $data = $resData['data'];

        // 5️⃣ Return bank transfer info to frontend
        return response()->json([
            'code' => 'success',
            'message' => 'Transfer account generated successfully',
            'data' => [
                'reference' => $reference,
                'amount' => $amountInKobo,
                'authorization_url' => $data['authorization_url'], // not needed, but available
                'bank' => $data['bank'] ?? null,
                'accountName' => $data['bank']['account_name'] ?? 'Paystack Temporary Account',
                'accountNumber' => $data['bank']['account_number'] ?? null,
                'bankName' => $data['bank']['bank_name'] ?? null,
                'expiresAt' => $data['bank']['expiry_date'] ?? null,
            ],
        ]);

    } catch (\Exception $e) {
        Log::error('generateAccountNumber Error', ['error' => $e->getMessage()]);
        return response()->json([
            'code' => 'error',
            'message' => 'Server error generating bank transfer account',
        ], 500);
    }
}



public function paystackPaymentWebhook(Request $request)
{
    // 1️⃣ Verify that the request is from Paystack
    $signature = $request->header('x-paystack-signature');
    $secret = env('PAYSTACK_SECRET_KEY'); // set this in .env

    $computedSignature = hash_hmac('sha512', $request->getContent(), $secret);

    if ($signature !== $computedSignature) {
        Log::warning('Paystack webhook verification failed.', ['request' => $request->all()]);
        return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 401);
    }

    // 2️⃣ Get the webhook payload
    $payload = $request->all();
    Log::info('Paystack webhook received:', $payload);

    $event = $payload['event'] ?? null;
    $data = $payload['data'] ?? [];

    // 3️⃣ Check the event type
    if ($event === 'charge.success') {
        $status = $data['status'] ?? null;

        if ($status === 'success' || $status === 'successful') {
            // Convert paid_at to MySQL datetime
            $paymentTime = isset($data['paid_at']) ? Carbon::parse($data['paid_at'])->format('Y-m-d H:i:s') : now();

            // Customer info
            $customer = $data['customer'] ?? [];
            $voterFullname = trim(
                (($customer['first_name'] ?? '') . ' ' . ($customer['last_name'] ?? ''))
            ) ?: 'Unknown Voter';
            $voterEmail = $customer['email'] ?? 'unknown@example.com';

            // Authorization info
            $accountNumber = $data['authorization']['account_number'] ?? null;
            $accountName   = $data['authorization']['account_name'] ?? null;
            $bankName      = $data['authorization']['bank'] ?? null;

            $amount    = $data['amount'] ?? 0; // in Kobo
            $currency  = $data['currency'] ?? null;
            $reference = $data['reference'] ?? null;
            $channel   = $data['channel'] ?? null;

            // Extract contestant info from metadata.referrer
            $referrer = $data['metadata']['referrer'] ?? '';
            preg_match('/contestant-number\/(\d+)/', $referrer, $matches);
            $contestantNumber = $matches[1] ?? 0;

            preg_match('/vote-for\/([^\/]+)\//', $referrer, $nameMatch);
            $contestantName = $nameMatch[1] ?? 'Unknown';

            // Call processVote
            return $this->processVote(
                $accountNumber,
                $bankName,
                $accountName,
                $amount,
                $currency,
                $status,
                $reference, // flw_ref
                $reference, // tx_ref
                $paymentTime,
                $voterFullname,
                $voterEmail,
                $contestantName,
                $contestantNumber
            );
        }
    }

    return response()->json(['status' => 'ignored', 'message' => 'Event ignored']);
}

public function processVote(
    $accountNumber,
    $bankName,
    $accountName,
    $amount,
    $currency,
    $status,
    $flwRef,
    $txRef,
    $paymentTime,
    $voterFullname,
    $voterEmail,
    $contestantName,
    $contestantNumber
)
{
    // 1️⃣ Convert Kobo → Naira
    $amountInNaira = (int)$amount / 100;

    // 2️⃣ Define voting price per vote in Naira
    $votePrice = 100;

    // 3️⃣ Calculate number of votes
    $votes = intdiv((int)$amountInNaira, $votePrice);

    // 4️⃣ Insert transaction into DB
    $transaction = Vote::create([
        'account_number'    => $accountNumber,
        'bank_name'         => $bankName,
        'account_name'      => $accountName,
        'amount'            => $amount, // store original Kobo amount
        'currency'          => $currency,
        'status'            => $status,
        'flw_ref'           => $flwRef,
        'tx_ref'            => $txRef,
        'payment_time'      => $paymentTime,
        'voter_fullname'    => $voterFullname,
        'voter_email'       => $voterEmail,
        'contestant_name'   => $contestantName,
        'contestant_number' => $contestantNumber,
        'votes_allocated'   => $votes,
        'created_at'        => now(),
        'updated_at'        => now(),
    ]);

    Cache::forget('allContestants');


    return response()->json([
        'status' => 'success',
        'message' => 'Transaction processed successfully.',
        'votes_awarded' => $votes,
    ]);
}





//     public function generateAccountNumber(Request $request)
// {
//     // Validate input
//     $validated = $request->validate([
//         'fullName' => 'required|string',
//         'email' => 'required|email',
//         'contestantName' => 'required|string',
//         'contestantNumber' => 'required|string',
//     ]);

//     $voterFullname = $validated['fullName'];
//     $voterEmail = $validated['email'];
//     $contestantName = $validated['contestantName'];
//     $contestantNumber = $validated['contestantNumber'];

//     $meta = [
//         'voterFullname' => $voterFullname,
//         'voterEmail' => $voterEmail,
//         'contestantName' => $contestantName,
//         'contestantNumber' => $contestantNumber,
//     ];

//     $isProduction = app()->environment('production');

//     $banks = $isProduction
//         ? ["044", "035", "101", "232"] // live banks
//         : ["999991"]; // sandbox/test bank

//     $url = "https://api.flutterwave.com/v3/virtual-account-numbers";
//     $uniqueRef = "vote_" . uniqid();

//     foreach ($banks as $bankCode) {
//         try {
//             $expiry = now()->addHours(1)->format('Y-m-d H:i:s'); // expires in 1 hour

//             // 1️⃣ Generate Virtual Account
//             $response = Http::withToken(env('FLUTTERWAVE_SECRET_KEY'))->post($url, [
//                 "email" => $voterEmail,
//                 "is_permanent" => false,
//                 "tx_ref" => $uniqueRef,
//                 "account_bank" => $bankCode,
//                 "firstname" => "MBGI",
//                 "lastname" => "",
//                 "amount" => 1, // minimal amount for VA creation
//                 "narration" => "Vote for $contestantName contestant number $contestantNumber",
//                 "expiry_date" => $expiry,
//                 "meta" => $meta,
//                 "callback_url" => "https://jedidiah-subbranchial-lowlily.ngrok-free.dev/api/flutterwave/new-payment-webhook"
//             ]);

//             $data = $response->json('data');

//             if (!$response->successful() || empty($data['account_number'])) {
//                 continue;
//             }

//             // 2️⃣ Simulate Payment (triggers webhook)
//             $simulateResponse = Http::withToken(env('FLUTTERWAVE_SECRET_KEY'))->post(
//                 "https://api.flutterwave.com/v3/virtual-account-simulate-payment",
//                 [
//                     "account_number" => $data['account_number'],
//                     "amount" => 3000, // voting amount
//                     "tx_ref" => "vote_sim_" . uniqid(),
//                     "narration" => "Vote for $contestantName contestant number $contestantNumber"
//                 ]
//             );

//             return response()->json([
//                 'code' => 'success',
//                 'message' => "Virtual account created and payment simulated successfully for bank code $bankCode",
//                 'data' => [
//                     'bank' => $data['bank_name'] ?? ($isProduction ? null : 'Test Bank'),
//                     'accountNumber' => $data['account_number'],
//                     'accountName' => $data['account_name'] ?? ($isProduction ? null : 'MBGI'),
//                     'simulateResponse' => $simulateResponse->json(),
//                 ],
//             ]);

//         } catch (\Exception $e) {
//             \Log::error("Bank code $bankCode failed: " . $e->getMessage());
//             continue;
//         }
//     }

//     return response()->json([
//         'code' => 'error',
//         'message' => "Unable to retrieve account number at this time. Please try again later."
//     ]);
// }
















//     public function generateAccountNumber(Request $request)
//     {

// // $response = Http::withToken(env('FLUTTERWAVE_SECRET_KEY'))->post('https://api.flutterwave.com/v3/virtual-account-simulate-payment', [
// //     "account_number" => "0067100155", // sandbox VA number
// //     "amount" => 1000,
// //     "tx_ref" => "test_sim_" . uniqid(),
// //     "narration" => "Vote for contestant #1"
// // ]);

// // return $response;
//         // Validate input
//         $validated = $request->validate([
//             'fullName' => 'required|string',
//             'email' => 'required|email',
//             'contestantName' => 'required|string',
//             'contestantNumber' => 'required|string',
//         ]);

//         $voterFullname = $validated['fullName'];
//         $voterEmail = $validated['email'];
//         $contestantName = $validated['contestantName'];
//         $contestantNumber = $validated['contestantNumber'];
//         $meta = [
//             'voterFullname' => $voterFullname,
//             'voterEmail' => $voterEmail,
//             'contestantName' => $contestantName,
//             'contestantNumber' => $contestantNumber,
//         ];

//         // Determine environment
//         $isProduction = app()->environment('production');

//         // Banks array
//         $banks = $isProduction
//         ? [
//             "044", // Access Bank
//             "035", // Wema Bank
//             "101", // Providus Bank
//             "232", // Sterling Bank
//         ] // live banks
//         : ["999991"]; // sandbox/test bank

//         $url = "https://api.flutterwave.com/v3/virtual-account-numbers";
//         $uniqueRef = "vote_" . uniqid();

//         foreach ($banks as $bankCode) {
//             try {
//                 $expiry = now()->addHours(1)->format('Y-m-d H:i:s'); // expires in 1 hour
//                 $response = Http::withToken(env('FLUTTERWAVE_SECRET_KEY'))->post($url, [
//                     "email" => $voterEmail,
//                     "is_permanent" => false,
//                     "tx_ref" => $uniqueRef,
//                     "account_bank" => $bankCode,
//                     // "firstname" => explode(' ', $voterFullname)[0],
//                     // "lastname" => explode(' ', $voterFullname)[1] ?? '',
//                     "firstname" => "MBGI",
//                     "lastname" => "",
//                     "amount" => 1, // minimal Naira
//                     "narration" => "Vote for $contestantName contestant number $contestantNumber",
//                     "expiry_date" => $expiry,
//                     "meta" => $meta,
//                     "callback_url" => "https://jedidiah-subbranchial-lowlily.ngrok-free.dev/api/flutterwave/new-payment-webhook"
//                 ]);

//                 $data = $response->json('data');

//                 // In production, ensure all fields exist
//                 if ($response->successful() && (
//                     $isProduction 
//                         ? (!empty($data['account_number']) && !empty($data['account_name']) && !empty($data['bank_name']))
//                         : !empty($data['account_number']) // relaxed for sandbox
//                 )) {
//                     return response()->json([
//                         'code' => 'success',
//                         'message' => "Dynamic account number generated successfully using bank code $bankCode",
//                         'data' => [
//                             'bank' => $data['bank_name'] ?? ($isProduction ? null : 'Test Bank'),
//                             'accountNumber' => $data['account_number'],
//                             'accountName' => $data['account_name'] ?? ($isProduction ? null : 'MBGI'),
//                         ],
//                     ]);
//                 }

//             } catch (\Exception $e) {
//                 // Log and try next bank
//                 \Log::error("Bank code $bankCode failed: " . $e->getMessage());
//                 continue;
//             }
//         }

//         // If all banks fail
//         return response()->json([
//             'code' => 'error',
//             'message' => "Unable to retrieve account number at this time. Please try again later."
//         ]);
//     }


    // public function flutterwavePaymentWebhook(Request $request)
    // {
    //     // Verify that the request is from Flutterwave
    //     $signature = $request->header('verif-hash');
    //     $secret = env('FLUTTERWAVE_SECRET_HASH'); // set this in .env

    //     if ($signature !== $secret) {
    //         Log::warning('Flutterwave webhook verification failed.');
    //         return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 401);
    //     }

    //     $payload = $request->all();
    //     Log::info('Flutterwave webhook received:', $payload);

    //     // Check the event type
    //     if ($payload['event'] === 'VA_PAYMENTS') {
    //         $data = $payload['data'];

    //         // Payment details
    //         $accountNumber = $data['account_number'] ?? null;
    //         $accountName   = $data['account_name'] ?? null; // MBGI
    //         $amount        = $data['amount'] ?? null;
    //         $currency      = $data['currency'] ?? null;
    //         $status        = $data['status'] ?? null;
    //         $meta          = $data['meta'] ?? [];
    //         $narration     = $data['narration'] ?? null;
    //         $txRef         = $data['tx_ref'] ?? null;
    //         $flwRef        = $data['flw_ref'] ?? null;
    //         $bankName      = $data['bank_name'] ?? null;
    //         $paymentTime = $data['created_at'] ?? null; // e.g., "2025-10-09 20:44:08"


    //         // Only process successful payments
    //         if ($status === 'successful') {
    //             // Example: you can now record the vote in your DB
    //             $voterFullname = $meta['voterFullname'] ?? null;
    //             $voterEmail = $meta['voterEmail'] ?? null;
    //             $contestantName = $meta['contestantName'] ?? null;
    //             $contestantNumber = $meta['contestantNumber'] ?? null;

    //                 return $this->processVote(
    //                     $accountNumber,
    //                     $bankName,
    //                     $accountName,
    //                     $amount,
    //                     $currency,
    //                     $status,
    //                     $flwRef,
    //                     $txRef,
    //                     $paymentTime,
    //                     $voterFullname,
    //                     $voterEmail,
    //                     $contestantName,
    //                     $contestantNumber,
                       
    //                 );

    //             // Record the vote or do any business logic
    //             Log::info("Vote received: Voter {$voterFullname} voted for {$contestantName} (Contestant #{$contestantNumber})");

    //             // Optionally, store in DB
    //             // Vote::create([...]);

    //             // return response()->json(['status' => 'success', 'message' => 'Vote recorded']);
    //         }
    //     }

    //     return response()->json(['status' => 'ignored', 'message' => 'Event ignored']);
    // }










    public function generateTokenForPayment(Request $request){
        DB::beginTransaction();
        try{
            $validator = Validator::make($request->all(), [
                'firstname' => 'required|string',
                'lastname' => 'required|string',
                'email' => 'required|email',
                'address' => 'required|string',
                'city' => 'required|string',
                'postalCode' => 'nullable|string|max:10', // optional but validated if present
                'phoneNumber' => 'phone',
                'country' => 'required|string',
                'state' => 'required|string',
                'checkoutTotal' => 'required|numeric',
                'currency' => 'required|string|size:3',
                'expectedDateOfDelivery' => 'required|string',
                'cartProducts' => 'required|array|min:1',
            ],
            ['phoneNumber.phone' => 'The :attribute must be a valid phone number, preceeded by the country code.']);

            if ($validator->fails()) {
                return response()->json([
                    'code' => 'error',
                    'message' => $validator->errors()->first(),
                ]);
            }


            // run a function to convert the price of each cart item to the desired currency passed
            $currencyClass = new CurrencyController();
            $cartProducts = $request->cartProducts; // Get the products from the request
        
            // Loop through each product and update the price
            foreach ($cartProducts as $index => $product) {
                // Convert the currency
                $convertedCurrency = $currencyClass->convertCurrency($product['productPrice'], $request->currency);
                
                // Add the new price directly to each product
                $cartProducts[$index]['updatedPrice'] = number_format($convertedCurrency, 2, '.', ',');
            }
        
            // Now cartProducts contains each product with its new price added
            $updatedRequestData = array_merge($request->all(), ['cartProducts' => $cartProducts]);



            $email = $updatedRequestData['email'];
            $firstname = $updatedRequestData['firstname'];
            $lastname = $updatedRequestData['lastname'];
            $address = $updatedRequestData['address'];
            $city = $updatedRequestData['city'];
            $postalCode = $updatedRequestData['postalCode'];
            $phoneNumber = $updatedRequestData['phoneNumber'];
            $country = $updatedRequestData['country'];
            $state = $updatedRequestData['state'];
            $subtotal = $updatedRequestData['totalPrice'];
            $shippingFee = $updatedRequestData['checkoutTotal'] - $updatedRequestData['totalPrice'];
            $totalPrice = $updatedRequestData['checkoutTotal'];
            $currency = $updatedRequestData['currency'];
            $expectedDateOfDelivery = $updatedRequestData['expectedDateOfDelivery'];
            $cartProducts = $updatedRequestData['cartProducts'];

            // Check in the database for uniqueness
            do {
                $uniqueId = random_int(1000000000, 9999999999);
            } while (Transaction::where('tx_ref', "ref_$uniqueId")->exists());

           
            $tokenPayload = [
                'email' => $email,
                'firstname' => $firstname,
                'lastname' => $lastname,
                'address' => $address,
                'city' => $city,
                'postalCode' => $postalCode,
                'phoneNumber' => $phoneNumber,
                'country' => $country,
                'state' => $request->state,
                'totalPrice' => $totalPrice,
                'shippingFee' => $shippingFee,
                'subtotal' => $subtotal,
                'cartProducts' => json_encode($cartProducts),
                'currency' => $currency,
                'expectedDateOfDelivery' => $expectedDateOfDelivery,
                'transactionId' => $uniqueId
                
            ];
            
            $payment = UnprocessedPayments::create($tokenPayload);
            $createTokenWithDetails = $payment->id;
            
            DB::commit();

            return response()->json([
                'message' => 'Token successfully generated',
                'code' => 'success',
                'data' => $createTokenWithDetails
            ]);
        }catch(\Throwable $e){
            DB::rollBack();
            return response()->json([
                'message' => 'An error occurred while initiating payment',
                'code' => 'error',
                'reason' => $e->getMessage()
            ]);
        }
    }
    // public function flutterwavePaymentWebhook(Request $request)
    // {
    //     // Validate Flutterwave Signature
    //     $signature = $request->header('verif-hash');
    //     if (!$signature || $signature !== env('FLW_SECRET_HASH')) {
    //         Log::warning('Invalid webhook signature');
    //         return response()->json(['message' => 'Invalid signature'], 403);
    //     }

    //     $payload = $request->all();
    //     Log::info('Flutterwave Webhook received', $payload);

    //     if ($payload['event'] === 'charge.completed') {
    //         $data = $payload['data'];

    //         // Optional: Confirm it's actually a successful payment
    //         if ($data['status'] === 'successful' && $data['currency'] === 'NGN') {
    //             $tx_ref = $data['tx_ref'];
    //             $detailsToken = $data['meta']['detailsToken'] ?? null;

    //             // Optional: Confirm with Flutterwave again for double security
    //             $response = Http::timeout(10)->retry(3, 100)->withHeaders([
    //                 'Authorization' => 'Bearer ' . env('FLUTTERWAVE_SECRET_KEY'),
    //             ])->get("https://api.flutterwave.com/v3/transactions/{$data['id']}/verify");

    //             if ($response->json('status') === 'success') {
    //                 $verified = $response->json('data');

    //                 return $this->processPayment(
    //                     $verified['flw_ref'],
    //                     $verified['tx_ref'],
    //                     $verified['amount'],
    //                     'successful',
    //                     $verified['created_at'],
    //                     $verified['payment_type'],
    //                     $detailsToken
    //                 );
    //             }
    //         }
    //     }

    //     return response()->json(['message' => 'Webhook received'], 200);
    // }


    
    public function validatePayment(Request $request){
        // Extract the 'tx_ref' from the request
        $tx_ref = $request->query('tx_ref');
        // $detailsToken = $request->query('detailsToken');
        // \Log::info("from tx_ref", ['tx_ref' => $tx_ref]);

        // Check if 'tx_ref' is missing
        if (!$tx_ref) {
            return response()->json([
                'code' => 'error',
                'reason' => 'Transaction reference is required.'
            ]);
        }

        try {
            // Make a GET request to Flutterwave's API to verify the transaction
            $response = Http::timeout(10)->retry(3, 100)->withHeaders([
                'Authorization' => 'Bearer ' . env('FLUTTERWAVE_SECRET_KEY'),
            ])->get('https://api.flutterwave.com/v3/transactions/verify_by_reference', [
                'tx_ref' => $tx_ref
            ]);

            \Log::info("from flutterwave", ['response' => $response->json()]);
            error_log(print_r($response->json(), true));

            
            // Check if the response indicates success
            if ($response->json('status') === 'success') {
                $data = $response->json('data');
                $detailsToken = $data['meta']['detailsToken'];
                
                // Process payment (You can implement the processPayment logic)
                return $this->processPayment(
                    $data['flw_ref'],
                    $data['tx_ref'],
                    $data['amount'],
                    'successful',
                    $data['created_at'],
                    $data['payment_type'],
                    $detailsToken
                    
                );
            } else {
                return response()->json([
                    'code' => 'error',
                    'message' => $response->json('message')
                ]);
            }

        } catch (\Throwable $error) {
            // Handle any errors from the request
            return response()->json([
                'code' => 'error',
                'message' =>  'Error validating payment',
                'reason' => $error->getMessage()
            ]);
        }
    }

    public function processPayment($flw_ref, $tx_ref, $amount, $status, $created_at, $payment_type, $detailsToken)
    {
        $attempt = 0;
        $maxRetries = 3;
        $lastErrorMessage = 'Unknown error';
        $responseData = null;
        $response = null;

        DB::beginTransaction();

        try {
            // Check if this transaction already exists
            $existingTransaction = Transaction::where('flw_ref', $flw_ref)
                ->orWhere('tx_ref', $tx_ref)
                ->first();

            if ($existingTransaction) {
                DB::rollBack();
                return response()->json([
                    'code' => 'already-made',
                    'message' => 'Transaction already processed'
                ]);
            }

            // Log new transaction
            Transaction::create([
                'flw_ref' => $flw_ref,
                'tx_ref' => $tx_ref,
                'amount' => $amount,
                'status' => $status,
                'payment_type' => $payment_type
            ]);

            // Try to save product to DB
            do {
                $attempt++;

                try {
                    $response = app(OrderController::class)->saveProductToDbAfterPayment($detailsToken);

                    $responseData = method_exists($response, 'getContent')
                        ? json_decode($response->getContent(), true)
                        : ['code' => 'error', 'message' => 'Invalid response object'];

                    if ($responseData['code'] === 'success') {
                        DB::commit(); // Commit here only if it succeeded
                        return $response;
                    } else {
                        $lastErrorMessage = $responseData['message'] ?? 'Order controller returned failure.';
                        $lastErrorReason = $responseData['reason'] ?? 'No reason found for this error';
                    }
                } catch (\Throwable $retryError) {
                    $lastErrorMessage = $retryError->getMessage();
                    \Log::warning("Retry attempt #$attempt failed: $lastErrorMessage");
                }

                sleep(1); // optional backoff
            } while ($attempt < $maxRetries);

            DB::rollBack(); // failed after retries — rollback the transaction

        } catch (\Throwable $e) {
            DB::rollBack(); // catch unexpected top-level errors
            $lastErrorMessage = $e->getMessage();
        }

        // Final fallback — ensure failure gets logged
        try {
            FailedTransactions::create([
                'flw_ref' => $flw_ref,
                'tx_ref' => $tx_ref,
                'amount' => $amount,
                'payment_type' => $payment_type,
                'detailsToken' => $detailsToken,
                'attempts' => $attempt,
                'failed_at' => now(),
                // 'reason' => $lastErrorMessage
            ]);
            \Log::critical("last error reason: " . $lastErrorReason);
        } catch (\Throwable $loggingError) {
            \Log::critical("Failed to log failed transaction: " . $loggingError->getMessage());
        }


        // Return response to frontend
        return response()->json([
            'code' => 'error',
            'message' => 'An error occurred while processing the transaction',
            'error message' => $lastErrorMessage,
            'error reason' => $lastErrorReason
        ]);
    }


    // public function processPayment($flw_ref, $tx_ref, $amount, $status, $created_at, $payment_type, $detailsToken){
    //     DB::beginTransaction();
    //     try {
    //         // Check if a transaction with the same flw_ref or tx_ref already exists
    //         $existingTransaction = Transaction::where('flw_ref', $flw_ref)
    //             ->orWhere('tx_ref', $tx_ref)
    //             ->first();

    //         if ($existingTransaction) {
    //             DB::rollBack();
    //             return response()->json([
    //                 'code' => 'already-made',
    //                 'message' => 'Transaction already processed'
    //             ]);
    //         }

    //         // Insert the transaction
    //         Transaction::create([
    //             // 'id' => (string) Str::uuid(),
    //             'flw_ref' => $flw_ref,
    //             'tx_ref' => $tx_ref,
    //             'amount' => $amount,
    //             'status' => $status,
    //             'payment_type' => $payment_type
    //         ]);
            
    //         // Retry logic
    //         $maxRetries = 3;
    //         $attempt = 0;
    //         $response = null;
            
    //         do {
    //             $attempt++;
    //             try {
    //                 $response = app(OrderController::class)->saveProductToDbAfterPayment($detailsToken);
        
    //                 $responseData = json_decode($response->getContent(), true);
    //                 // If successful (assuming response is a Laravel Response object)
    //                 if (isset($responseData['code']) && $responseData['code'] === 'success') {
    //                     break; // exit the loop
    //                 }else {
    //                     $lastErrorMessage = $responseData['message'] ?? 'Unknown failure from order controller.';
    //                 }

    //             } catch (\Throwable $retryError) {
    //                 $lastErrorMessage = $retryError->getMessage(); // <- store last error reason
    //                 \Log::warning("Retry attempt #$attempt failed in processPayment: " . $lastErrorMessage);
    //             }

    //             sleep(1); // short delay before retrying (optional)
                
    //         } while ($attempt < $maxRetries);
            
    //         if (!$response || !isset($responseData['code']) || $responseData['code'] !== 'success') {
    //             \Log::error("Order processing failed after $attempt attempts. Reason: $lastErrorMessage");

    //             FailedTransactions::create([
    //                 'flw_ref' => $flw_ref,
    //                 'tx_ref' => $tx_ref,
    //                 'amount' => $amount,
    //                 'payment_type' => $payment_type,
    //                 'detailsToken' => $detailsToken, // store the details for retry
    //                 'attempts' => $attempt,
    //                 'failed_at' => now(),
    //             ]);
    //             throw new \Exception('Failed to process order after payment after multiple attempts.');
    //         }
            
    //         DB::commit();
    //         return $response;
            
    //     } catch (\Throwable $error) {
    //         DB::rollBack();
    //         return response()->json([
    //             'code' => 'error',
    //             'message' => 'An error occurred while processing the transaction',
    //             'reason' => $error->getMessage()
    //         ]);
    //     }
    // }

    

}


    // public function makePayment(Request $request){

       
    //     try {   
    //         $request->validate([
    //             'firstname' => 'required|string',
    //             'lastname' => 'required|string',
    //             'email' => 'required|email',
    //             'address' => 'required|string',
    //             'city' => 'required|string',
    //             'phoneNumber' => 'phone',
    //             'country' => 'required|string',
    //             'state' => 'required|string',
    //             'checkoutTotal' => 'required|numeric',
    //             'currency' => 'required|string',
    //             'expectedDateOfDelivery' => 'required|string',
    //             'cartProducts' => 'required'
    //         ],
    //         ['phoneNumber.phone' => 'The :attribute must be a valid phone number, preceeded by the country code.']);

    //         // run a function to convert the price of each cart item to the desired currency passed
    //         $currencyClass = new CurrencyController();
    //         $cartProducts = $request->cartProducts; // Get the products from the request
        
    //         // Loop through each product and update the price
    //         foreach ($cartProducts as $index => $product) {
    //             // Convert the currency
    //             $convertedCurrency = $currencyClass->convertCurrency($product['productPrice'], $request->currency);
                
    //             // Add the new price directly to each product
    //             $cartProducts[$index]['updatedPrice'] = number_format($convertedCurrency, 2, '.', ',');
    //         }
        
    //         // Now cartProducts contains each product with its new price added
    //         $updatedRequestData = array_merge($request->all(), ['cartProducts' => $cartProducts]);



    //         $email = $updatedRequestData['email'];
    //         $firstname = $updatedRequestData['firstname'];
    //         $lastname = $updatedRequestData['lastname'];
    //         $address = $updatedRequestData['address'];
    //         $city = $updatedRequestData['city'];
    //         $postalCode = $updatedRequestData['postalCode'];
    //         $phoneNumber = $updatedRequestData['phoneNumber'];
    //         $country = $updatedRequestData['country'];
    //         $state = $updatedRequestData['state'];
    //         $subtotal = $updatedRequestData['totalPrice'];
    //         $shippingFee = $updatedRequestData['checkoutTotal'] - $updatedRequestData['totalPrice'];
    //         $totalPrice = $updatedRequestData['checkoutTotal'];
    //         $currency = $updatedRequestData['currency'];
    //         $expectedDateOfDelivery = $updatedRequestData['expectedDateOfDelivery'];
    //         $cartProducts = $updatedRequestData['cartProducts'];
    //         // $uniqueId = (int) substr(microtime(true) * random_int(10000, 99999), 0, 15);
    //         $uniqueId = random_int(1000000000, 9999999999);

    //         // Check in the database for uniqueness
    //         if (Transaction::where('tx_ref', "ref_$uniqueId")->exists()) {
    //             // Regenerate if duplicate
    //             // $uniqueId = (int) substr(microtime(true) * random_int(10000, 99999), 0, 15);
    //             $uniqueId = random_int(1000000000, 9999999999);
    //         }

    //         // Call createToken method from AuthController
    //         $authController = new AuthController(); // Create an instance of AuthController

    //         $tokenPayload = [
    //             'email' => $email,
    //             'firstname' => $firstname,
    //             'lastname' => $lastname,
    //             'address' => $address,
    //             'city' => $city,
    //             'postalCode' => $postalCode,
    //             'phoneNumber' => $phoneNumber,
    //             'country' => $country,
    //             'state' => $request->state,
    //             'totalPrice' => $totalPrice,
    //             'shippingFee' => $shippingFee,
    //             'subtotal' => $subtotal,
    //             'cartProducts' => json_encode($cartProducts),
    //             'currency' => $currency,
    //             'expectedDateOfDelivery' => $expectedDateOfDelivery,
    //             'transactionId' => $uniqueId
    //         ];

    //         // Generate token with a 5-minute expiration
    //         $createTokenWithDetails = $authController->createToken($tokenPayload, 5 * 60);

    //         $payload = [
    //             'tx_ref' => 'ref_' . $uniqueId, // Unique transaction reference
    //             'email' => $email,
    //             'amount' => (int)$totalPrice,
    //             'currency' => $currency,  // Ensure this currency is supported by Flutterwave
    //             'customer' => [
    //                 'email' => $email,
    //                 'phone_number' => $phoneNumber,
    //                 'name' => $firstname . ' ' . $lastname,
    //             ],
    //             'redirect_url' => env('FRONTEND_URL') . '/payment-status',
    //             'meta' => [
    //                 'detailsToken' => $createTokenWithDetails
    //             ]

    //         ];
    //         // Make POST request to Flutterwave API
            
    //         $response = Http::withHeaders([
    //             'Authorization' => 'Bearer ' . env('FLUTTERWAVE_SECRET_KEY'),
    //             'Content-Type' => 'application/json'
    //         ])->post('https://api.flutterwave.com/v3/payments', $payload);

            
    //         // Check if the request was successful
    //         if ($response->successful()) {
    //             return $response->json(); // Return the response data from Flutterwave
    //         } else {
    //             return response()->json([
    //                 'message' => 'Error creating payment',
    //                 'code' => 'error',
    //                 'reason' => $response->json()['message']
    //             ]);
    //         }

    //     } catch (\Throwable $error) {
    //         return response()->json([
    //             'message' => 'Error creating payment',
    //             'code' => 'error',
    //             'reason' => $error->getMessage()
    //         ]);
    //     }
    // }