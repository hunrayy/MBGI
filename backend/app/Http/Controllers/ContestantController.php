<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Models\Contestant;
use Exception;

class ContestantController extends Controller
{
    public function createContestant(Request $request)
    {
        // Step 1: Validate input (including unique contestantNumber)
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
            'fullname' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:contestants,email',
            'contestantNumber' => 'required|integer|min:1|unique:contestants,contestant_number',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'message' => 'All Field Required',
                'code' => 'error',
                'errors' => $validator->errors()
            ]);
        }

        DB::beginTransaction(); // Start DB transaction

        try {
            // Step 2: Upload image to Cloudinary
            $uploadedImage = $this->uploadToCloudinary($request->file('image'));
            if (!$uploadedImage) {
                throw new Exception('Failed to upload contestant image.');
            }

            // Step 3: Double-check contestantNumber (in case of race conditions)
            if (!empty($request->input('contestantNumber'))) {
                $exists = Contestant::where('contestant_number', $request->input('contestantNumber'))->exists();
                if ($exists) {
                    throw new Exception('Contestant number already exists.');
                    return response()->json([
                        'message' => 'Contestant Number' . $request->input('contestantNumber') . 'Exists Already',
                        'code' => 'error',
                        'reason' => $e->getMessage(),
                    ]);
                }
            }

            // Step 4: Create contestant
            $contestant = Contestant::create([
                'fullname' => $request->input('fullname'),
                'image' => $uploadedImage,
                'email' => $request->input('email'),
                'contestant_number' => $request->input('contestantNumber'),
            ]);

            // Step 5: Update cache
 $cachedContestants = Cache::get('allContestants');

if ($cachedContestants) {
    // Convert collection to array if necessary
    if ($cachedContestants instanceof \Illuminate\Support\Collection) {
        $cachedContestants = $cachedContestants->toArray();
    }

    array_unshift($cachedContestants, $contestant->toArray());
    Cache::put('allContestants', $cachedContestants, now()->addWeek(1));
} else {
    $allContestants = Contestant::orderBy('created_at', 'desc')->get()->toArray();
    Cache::put('allContestants', $allContestants, now()->addWeek(1));
}


            DB::commit(); // Everything succeeded

            return response()->json([
                'message' => 'Contestant added successfully.',
                'code' => 'success',
            ]);
        } catch (Exception $e) {
            DB::rollBack(); // Undo any DB changes

            return response()->json([
                'message' => 'Error adding contestant.',
                'code' => 'error',
                'reason' => $e->getMessage(),
            ]);
        }
    }


//     public function getAllContestants()
// {
//     try {
//         $cacheKey = 'allContestants';

//         $contestants = Cache::get($cacheKey);

//         if (!$contestants) {
//             $contestants = Contestant::withSum('votes as total_votes', 'votes_allocated')
//                 ->orderBy('created_at', 'desc')
//                 ->get()
//                 ->toArray();

//             Cache::put($cacheKey, $contestants, now()->addWeek(1));
//         }

//         return response()->json([
//             'status' => 'success',
//             'message' => 'Contestants fetched successfully.',
//             'data' => $contestants
//         ]);

//     } catch (Exception $e) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Failed to fetch contestants.',
//             'reason' => $e->getMessage(),
//         ]);
//     }
// }







    // public function getAllContestants()
    // {
    //     try {
    //         // Check if contestants are already cached
    //         $contestants = Cache::get('allContestants');
    //         return $contestants;

    //         // If not cached, fetch from DB and cache for 1 week
    //         // if (!$contestants) {
    //         //     $contestants = Contestant::orderBy('created_at', 'desc')->get();
    //         //     Cache::put('allContestants', $contestants, now()->addWeek(1));
                
    //         // }

    //         if (!$contestants) {
    //             // Fetch all contestants with total votes
    //             $contestants = Contestant::withSum('votes', 'votes_allocated')
    //                 ->orderBy('created_at', 'desc')
    //                 ->get();

    //             Cache::put('allContestants', $contestants, now()->addWeek(1));
    //         }

    //         return response()->json([
    //             'message' => 'All contestants fetched successfully.',
    //             'code' => 'success',
    //             'data' => $contestants
    //         ]);

    //     } catch (Exception $e) {
    //         return response()->json([
    //             'message' => 'Error fetching contestants.',
    //             'code' => 'error',
    //             'reason' => $e->getMessage(),
    //         ]);
    //     }
    // }

public function getAllContestants()
{
    try {
        $cacheKey = 'allContestants';
        $contestants = Cache::get($cacheKey);

        if (!$contestants) {
            $contestants = Contestant::withSum('votes as total_votes', 'votes_allocated')
                ->orderBy('created_at', 'desc')
                ->get();
            Cache::put($cacheKey, $contestants->toArray(), now()->addWeek(1));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Contestants fetched successfully.',
            'data' => $contestants
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to fetch contestants.',
            'reason' => $e->getMessage(),
        ]);
    }
}




    public static function uploadToCloudinary($file)
    {
        if (!$file) {
            \Log::error('uploadToCloudinary received null file');
            return false;
        }

        try {
            $folderName = env('FOLDER_FOR_IMAGES_IN_CLOUDINARY');
            $hash = md5_file($file->getRealPath());
            $publicId = $folderName . '/' . $hash;

            $uploadResult = Cloudinary::upload($file->getRealPath(), [
                'folder' => $folderName,
                'public_id' => $hash,
                'overwrite' => false,
            ]);

            return $uploadResult->getSecurePath();
        } catch (Exception $e) {
            \Log::error('Cloudinary upload error: ' . $e->getMessage());
            return false;
        }
    }
}
