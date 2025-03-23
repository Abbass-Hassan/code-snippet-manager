<?php

namespace App\Http\Controllers;

use App\Models\Snippet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller; 

class FavoriteController extends Controller
{
    

    /**
     * Display a listing of the user's favorites.
     */
    public function index()
    {
        $favorites = Auth::user()->favorites()->with('tags')->latest()->get();
        
        return response()->json([
            'status' => 'success',
            'favorites' => $favorites
        ]);
    }

    /**
     * Add a snippet to user's favorites.
     */
    public function store(string $id)
    {
        $user = Auth::user();
        
        // Find the snippet (own or public)
        $snippet = Snippet::where(function($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->orWhere('is_public', true);
            })
            ->findOrFail($id);
        
        // Check if already favorited
        if ($user->favorites()->where('snippet_id', $id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Snippet is already in favorites'
            ], 409);
        }
        
        // Add to favorites
        $user->favorites()->attach($id);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Snippet added to favorites'
        ], 201);
    }

    /**
     * Remove a snippet from user's favorites.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        
        // Remove from favorites
        $user->favorites()->detach($id);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Snippet removed from favorites'
        ]);
    }
}