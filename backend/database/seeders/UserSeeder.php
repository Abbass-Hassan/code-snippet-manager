<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user with known credentials
        User::create([
            'name' => 'Abbas Hassan',
            'email' => 'abbas.hassan@gmail.com',
            'password' => Hash::make('password123'),
        ]);
        
        // Create additional users
        User::factory(3)->create();
    }
}