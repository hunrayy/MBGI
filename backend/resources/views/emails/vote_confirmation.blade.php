<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px;">
        <div style="background: linear-gradient(90deg, #8b7500, #b8860b); padding: 20px; text-align: center;">
            <h2 style="color: #fff;">
                {{ $type === 'contestant' ? 'New Vote Received' : 'Vote Confirmation' }}
            </h2>
        </div>
        <div style="padding: 30px; color: #333;">
            <p>Hi <strong>{{ $type === 'contestant' ? $contestantName : $voterName }}</strong>,</p>

            @if ($type === 'contestant')
                <p>{{ $voterName }} ({{ $recipientEmail }}) just cast <strong>{{ $votes }}</strong> vote(s) for you!</p>
                <p>Keep up the good work and encourage your supporters to keep voting!</p>
            @else
                <p>Thank you for participating in the voting! We're excited to let you know your vote was successfully recorded.</p>
                <div style="background: #f1f5f9; border-left: 4px solid #b8860b; padding: 15px 20px; margin: 25px 0; border-radius: 6px;">
                    <p style="margin: 0;">You just cast <strong style="color: #b8860b;">{{ $votes }}</strong> vote(s) for <strong>{{ $contestantName }}</strong>.</p>
                </div>
            @endif

            <p>Best regards,<br>The MBGI Team</p>
        </div>
    </div>
</div>
