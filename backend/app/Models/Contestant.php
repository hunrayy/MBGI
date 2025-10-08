<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Contestant extends Model
{
    use HasFactory;
    protected $table = 'contestants'; // This ensures the model uses the 'contestants' table

    protected $fillable = [
        'fullname',
        'contestant_number',
        'bio',
        'image',
    ];

    

    //override the getIncrementing method
    public $incrementing = false;

    //set the key type to string
    protected $keyType = 'string';
    
    // Automatically create a UUID when inserting
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
}
