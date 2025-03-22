<?php

namespace Database\Seeders;

use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SnippetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $tags = Tag::all();
        
        // Sample snippets with predefined content
        $sampleSnippets = [
            [
                'title' => 'PHP Laravel Auth Check',
                'language' => 'php',
                'code' => "if (Auth::check()) {\n    // The user is logged in\n    \$user = Auth::user();\n    return \$user->name;\n} else {\n    // The user is not logged in\n    return redirect('login');\n}",
                'description' => 'Check if a user is authenticated in Laravel',
                'is_public' => true,
                'tags' => ['PHP', 'Laravel', 'Authentication']
            ],
            [
                'title' => 'React useState Hook',
                'language' => 'javascript',
                'code' => "import React, { useState } from 'react';\n\nfunction Counter() {\n  // Declare a new state variable with the useState hook\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}",
                'description' => 'Basic example of React useState hook',
                'is_public' => true,
                'tags' => ['JavaScript', 'React', 'Frontend', 'Component']
            ],
            [
                'title' => 'Python List Comprehension',
                'language' => 'python',
                'code' => "# Square all numbers in a list\nnumbers = [1, 2, 3, 4, 5]\nsquared = [num * num for num in numbers]\nprint(squared)  # Output: [1, 4, 9, 16, 25]\n\n# Filter even numbers\neven_numbers = [num for num in numbers if num % 2 == 0]\nprint(even_numbers)  # Output: [2, 4]",
                'description' => 'Examples of list comprehension in Python',
                'is_public' => true,
                'tags' => ['Python', 'Algorithm', 'Utility']
            ],
            [
                'title' => 'CSS Flexbox Center',
                'language' => 'css',
                'code' => ".flex-container {\n  display: flex;\n  justify-content: center; /* Horizontally center */\n  align-items: center; /* Vertically center */\n  height: 100vh; /* Full viewport height */\n}\n\n.centered-element {\n  /* Optional styling for the centered element */\n  padding: 20px;\n  background-color: #f0f0f0;\n  border-radius: 5px;\n}",
                'description' => 'Center an element using CSS Flexbox',
                'is_public' => true,
                'tags' => ['CSS', 'Frontend']
            ],
            [
                'title' => 'SQL Join Example',
                'language' => 'sql',
                'code' => "SELECT users.name, orders.order_date, orders.amount\nFROM users\nINNER JOIN orders ON users.id = orders.user_id\nWHERE orders.amount > 100\nORDER BY orders.order_date DESC;",
                'description' => 'Example of SQL JOIN to get user orders',
                'is_public' => true,
                'tags' => ['SQL', 'Database']
            ]
        ];
        
        // Create predefined snippets for each user
        foreach ($users as $user) {
            foreach ($sampleSnippets as $snippetData) {
                $snippet = $user->snippets()->create([
                    'title' => $snippetData['title'],
                    'code' => $snippetData['code'],
                    'language' => $snippetData['language'],
                    'description' => $snippetData['description'],
                    'is_public' => $snippetData['is_public'],
                ]);
                
                // Attach tags
                foreach ($snippetData['tags'] as $tagName) {
                    $tag = $tags->where('name', $tagName)->first();
                    if ($tag) {
                        $snippet->tags()->attach($tag->id);
                    }
                }
            }
            
            // Create additional random snippets
            Snippet::factory(5)
                ->for($user)
                ->create()
                ->each(function ($snippet) use ($tags) {
                    // Attach 1-3 random tags to each snippet
                    $randomTags = $tags->random(rand(1, 3));
                    $snippet->tags()->attach($randomTags->pluck('id')->toArray());
                });
        }
        
        // Create some favorite relationships
        foreach ($users as $user) {
            // Get 3 random public snippets not created by this user
            $publicSnippets = Snippet::where('user_id', '!=', $user->id)
                ->where('is_public', true)
                ->inRandomOrder()
                ->take(3)
                ->get();
                
            $user->favorites()->attach($publicSnippets->pluck('id')->toArray());
        }
    }
}