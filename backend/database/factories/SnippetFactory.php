<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Snippet>
 */
class SnippetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $languages = ['php', 'javascript', 'python', 'html', 'css', 'sql', 'bash', 'java'];
        
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'code' => $this->faker->text(500),
            'language' => $this->faker->randomElement($languages),
            'description' => $this->faker->paragraph(),
            'is_public' => $this->faker->boolean(70), // 70% chance of being public
        ];
    }
}