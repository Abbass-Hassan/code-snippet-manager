<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\TagController;



// Authentication routes
Route::controller(AuthController::class)->group(function () {
    Route::post('auth/register', 'register');
    Route::post('auth/login', 'login');
    
    // Protected auth routes
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout', 'logout');
        Route::post('auth/refresh', 'refresh');
        Route::get('auth/user', 'me');
    });
});

// Protected routes for authenticated users
Route::middleware('auth:api')->group(function () {
    // Snippet routes
    Route::get('snippets', [SnippetController::class, 'index']);
    Route::post('snippets', [SnippetController::class, 'store']);
    Route::get('snippets/search', [SnippetController::class, 'search']);
    Route::get('snippets/{id}', [SnippetController::class, 'show']);
    Route::put('snippets/{id}', [SnippetController::class, 'update']);
    Route::delete('snippets/{id}', [SnippetController::class, 'destroy']);
    
    // Favorite routes
    Route::get('favorites', [FavoriteController::class, 'index']);
    Route::post('favorites/{id}', [FavoriteController::class, 'store']);
    Route::delete('favorites/{id}', [FavoriteController::class, 'destroy']);
    
    // Tag routes
    Route::get('tags', [TagController::class, 'index']);
    Route::get('languages', [TagController::class, 'languages']);
});



