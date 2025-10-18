<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $table = 'votes';

    protected $fillable = [
        'voter_fullname',
        'voter_email',
        'contestant_name',
        'contestant_id',
        'contestant_email',
        'contestant_number',
        'account_number',
        'account_name',
        'bank_name',
        'amount',
        'currency',
        'status',
        'flw_ref',
        'tx_ref',
        'payment_time',
        'votes_allocated',
        'frontend_requested'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'votes_allocated' => 'integer',
        'payment_time' => 'datetime',
    ];

    /**
     * Vote belongs to a contestant
     */
    public function contestant()
    {
        return $this->belongsTo(Contestant::class, 'contestant_number', 'contestant_number');
    }
}
