<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Vote;



class Contestant extends Model
{
    use HasFactory;

    protected $table = 'contestants';

    protected $fillable = [
        'fullname',           // contestant name
        'contestant_number',  // unique number
        'image',              // image URL/path
    ];

    // Primary key is a UUID string
    public $incrementing = false;
    protected $keyType = 'string';

    // Auto-generate UUID for primary key
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Contestant has many votes
     */
    public function votes()
    {
        return $this->hasMany(Vote::class, 'contestant_number', 'contestant_number');
    }
}
