<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VoteConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $voterName;
    public $votes;
    public $contestantName;
    public $type;          // 'voter' or 'contestant'
    public $recipientEmail; // optional, used for contestant subject

    public function __construct($voterName, $votes, $contestantName, $type = 'voter', $recipientEmail = null)
    {
        $this->voterName = $voterName;
        $this->votes = $votes;
        $this->contestantName = $contestantName;
        $this->type = $type;
        $this->recipientEmail = $recipientEmail;
    }

    
    
    
    
    public function build()
    {
        // Dynamic subject
        $subject = $this->type === 'contestant' && $this->recipientEmail
            ? "New vote from {$this->recipientEmail}"
            : "Vote Successful – Thank You for Your Support!";
    
        // Dynamic greeting and message
        if ($this->type === 'contestant') {
            $greeting = $this->contestantName; // greet contestant
            $message = "<p style='font-size: 15px; line-height: 1.6;'>{$this->voterName} ({$this->recipientEmail}) just cast <strong>{$this->votes}</strong> vote(s) for you!</p>
                        <p style='font-size: 15px;'>Keep up the good work and encourage your supporters to keep voting!</p>";
        } else {
            $greeting = $this->voterName; // greet voter
            $message = "<p style='font-size: 15px; line-height: 1.6;'>Thank you for participating in the voting! We're excited to let you know your vote was successfully recorded.</p>
                        <div style='background: #f1f5f9; border-left: 4px solid #b8860b; padding: 15px 20px; margin: 25px 0; border-radius: 6px;'>
                            <p style='margin: 0; font-size: 15px;'>You just cast <strong style='color: #b8860b;'>{$this->votes}</strong> vote(s) for <strong>{$this->contestantName}</strong>.</p>
                        </div>";
        }
    
        return $this->subject($subject)->html("
            <div style='font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;'>
                <div style='max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;'> 
                    <div style='background: linear-gradient(90deg, #8b7500, #b8860b); padding: 20px; text-align: center;'> 
                        <h2 style='color: #ffffff; margin: 0; font-size: 22px;'>" . ($this->type === 'contestant' ? 'New Vote Received' : 'Vote Confirmation') . "</h2> 
                    </div> 
                    <div style='padding: 30px; color: #333333;'> 
                        <p style='font-size: 16px;'>Hi <strong>{$greeting}</strong>,</p>
                        $message
                        <p style='font-size: 15px; margin-top: 30px;'>Best regards,</p> 
                        <p style='font-weight: bold; font-size: 15px;'>The MBGI Team</p>
                    </div> 
                    <div style='background: #f8fafc; padding: 15px; text-align: center; font-size: 13px; color: #94a3b8;'> 
                        <p style='margin: 0;'>This is an automated message, please do not reply.</p> 
                        <p style='margin: 0;'>© " . date('Y') . " MBGI. All rights reserved.</p> 
                    </div> 
                </div> 
            </div>
        ");
    }
}



// public function build()
// {
//     $subject = $this->type === 'contestant' && $this->recipientEmail
//         ? "New vote from {$this->recipientEmail}"
//         : "Vote Successful – Thank You for Your Support!";

//     return $this->subject($subject)
//                 ->view('emails.vote_confirmation')
//                 ->with([
//                     'voterName' => $this->voterName,
//                     'votes' => $this->votes,
//                     'contestantName' => $this->contestantName,
//                     'type' => $this->type,
//                     'recipientEmail' => $this->recipientEmail,
//                 ]);
// }






