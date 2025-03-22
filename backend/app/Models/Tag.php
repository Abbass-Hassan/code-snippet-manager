<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * The snippets that belong to the tag.
     */
    public function snippets(): BelongsToMany
    {
        return $this->belongsToMany(Snippet::class)->withTimestamps();
    }
}