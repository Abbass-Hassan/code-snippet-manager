<?php

namespace App\Http\Controllers;

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller; 

class SnippetController extends Controller
{

    

    /**
 * Display a listing of the resource.
 */
public function index()
{
    $user = Auth::user();
    
    // Get both user's own snippets and public snippets
    $snippets = Snippet::with('tags', 'user:id,name,email')
        ->where(function($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('is_public', true);
        })
        ->latest()
        ->get();
    
    return response()->json([
        'status' => 'success',
        'snippets' => $snippets
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string',
            'language' => 'required|string|max:50',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $snippet = Auth::user()->snippets()->create([
            'title' => $request->title,
            'code' => $request->code,
            'language' => $request->language,
            'description' => $request->description,
            'is_public' => $request->is_public ?? false,
        ]);

        // Process tags
        if ($request->has('tags') && is_array($request->tags)) {
            $tagIds = [];
            
            foreach ($request->tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            
            $snippet->tags()->sync($tagIds);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Snippet created successfully',
            'snippet' => $snippet->load('tags')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        
        // User can view their own snippets or public snippets
        $snippet = Snippet::with('tags', 'user:id,name,email')
            ->where(function($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->orWhere('is_public', true);
            })
            ->findOrFail($id);
            
        return response()->json([
            'status' => 'success',
            'snippet' => $snippet
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string',
            'language' => 'sometimes|required|string|max:50',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $user = Auth::user();
        $snippet = $user->snippets()->findOrFail($id);
        
        $snippet->update([
            'title' => $request->title ?? $snippet->title,
            'code' => $request->code ?? $snippet->code,
            'language' => $request->language ?? $snippet->language,
            'description' => $request->description ?? $snippet->description,
            'is_public' => $request->is_public ?? $snippet->is_public,
        ]);

        // Process tags
        if ($request->has('tags') && is_array($request->tags)) {
            $tagIds = [];
            
            foreach ($request->tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            
            $snippet->tags()->sync($tagIds);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Snippet updated successfully',
            'snippet' => $snippet->fresh()->load('tags')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $snippet = $user->snippets()->findOrFail($id);
        
        $snippet->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Snippet deleted successfully'
        ]);
    }

    /**
     * Search for snippets.
     */
    public function search(Request $request)
{
    $request->validate([
        'query' => 'nullable|string',
        'language' => 'nullable|string',
        'tag' => 'nullable|string',
    ]);

    $user = Auth::user();
    $searchTerm = $request->input('query');
    $language = $request->input('language');
    $tag = $request->input('tag');

    // Start with snippets that belong to the user or are public.
    $snippetsQuery = Snippet::with('tags')
        ->where(function($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere('is_public', true);
        });

    // Apply keyword search (title, code, description)
    if ($searchTerm) {
        $snippetsQuery->where(function($q) use ($searchTerm) {
            $q->where('title', 'like', "%{$searchTerm}%")
              ->orWhere('code', 'like', "%{$searchTerm}%")
              ->orWhere('description', 'like', "%{$searchTerm}%");
        });
    }

    // Filter by language
    if ($language) {
        $snippetsQuery->where('language', $language);
    }

    // Filter by tag using a whereHas on the relationship
    if ($tag) {
        $snippetsQuery->whereHas('tags', function($q) use ($tag) {
            $q->where('name', $tag);
        });
    }

    $snippets = $snippetsQuery->latest()->get();

    return response()->json([
        'status' => 'success',
        'snippets' => $snippets
    ]);
}

}