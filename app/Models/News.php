<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'link',
        'summary',
        'pub_date',
        'source',
        'image',
        'color',
    ];

    protected $casts = [
        'pub_date' => 'datetime',
    ];
}
