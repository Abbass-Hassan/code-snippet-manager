<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the tags.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all tags associated with user's snippets
        $tags = Tag::whereHas('snippets', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->withCount('snippets')
            ->orderBy('name')
            ->get();
        
        return response()->json([
            'status' => 'success',
            'tags' => $tags
        ]);
    }

    /**
     * Get all available languages from user's snippets.
     */
    public function languages()
    {
        $user = Auth::user();
        
        $languages = $user->snippets()
            ->select('language')
            ->distinct()
            ->orderBy('language')
            ->pluck('language');
        
        return response()->json([
            'status' => 'success',
            'languages' => $languages
        ]);
    }
}