<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller; 

class TagController extends Controller
{
    

    /**
     * Display a listing of the tags.
     */
    public function index()
    {
        // Default tags if user is not authenticated or has no tags
        $defaultTags = [
            ['id' => 1, 'name' => 'JavaScript'],
            ['id' => 2, 'name' => 'PHP'],
            ['id' => 3, 'name' => 'Python'],
            ['id' => 4, 'name' => 'HTML/CSS'],
            ['id' => 5, 'name' => 'SQL'],
            ['id' => 6, 'name' => 'API'],
            ['id' => 7, 'name' => 'Utility'],
            ['id' => 8, 'name' => 'Algorithm']
        ];
        
        try {
            $user = Auth::user();
            
            if ($user) {
                // User is authenticated, try to get their tags
                $tags = Tag::whereHas('snippets', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->withCount('snippets')
                ->orderBy('name')
                ->get();
                
                // If user has no tags, use default tags
                if ($tags->isEmpty()) {
                    $tags = $defaultTags;
                }
            } else {
                // User is not authenticated, use default tags
                $tags = $defaultTags;
            }
            
            return response()->json([
                'status' => 'success',
                'tags' => $tags
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available languages from user's snippets.
     */
    public function languages()
    {
        // Default languages if user is not authenticated or has no snippets
        $defaultLanguages = ['JavaScript', 'PHP', 'Python', 'HTML', 'CSS', 'SQL', 'Java', 'Ruby', 'C#', 'Go'];
        
        try {
            $user = Auth::user();
            
            if ($user) {
                // User is authenticated, try to get their languages
                $languages = $user->snippets()
                    ->select('language')
                    ->distinct()
                    ->orderBy('language')
                    ->pluck('language')
                    ->toArray();
                    
                // If user has no snippets, use default languages
                if (empty($languages)) {
                    $languages = $defaultLanguages;
                }
            } else {
                // User is not authenticated, use default languages
                $languages = $defaultLanguages;
            }
            
            return response()->json([
                'status' => 'success',
                'languages' => $languages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve languages',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}