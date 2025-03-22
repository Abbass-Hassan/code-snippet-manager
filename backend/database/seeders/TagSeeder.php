<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create predefined tags for common programming topics and languages
        $tags = [
            // Languages
            'JavaScript', 'PHP', 'Python', 'HTML', 'CSS', 'SQL', 'Java', 'C#',
            // Frameworks
            'Laravel', 'React', 'Vue', 'Angular', 'Express', 'Django', 'Flask',
            // Concepts
            'Algorithm', 'Utility', 'Authentication', 'Database', 'Frontend', 'Backend',
            // Other
            'Snippet', 'Function', 'Class', 'Component', 'API'
        ];
        
        foreach ($tags as $tagName) {
            Tag::create(['name' => $tagName]);
        }
    }
}