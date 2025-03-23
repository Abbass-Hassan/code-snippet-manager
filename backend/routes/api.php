<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\TagController;

/**
 * Authentication Routes
 */
Route::prefix('auth')->group(function () {
    // Public authentication routes
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    // Protected authentication routes
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('user', [AuthController::class, 'me']);
    });
});

/**
 * Protected Resource Routes
 */
Route::middleware('auth:api')->group(function () {
    /**
     * Tag & Language Routes
     */
    Route::prefix('tags')->group(function () {
        Route::get('/', [TagController::class, 'index']);
    });
    Route::get('languages', [TagController::class, 'languages']);
    
    /**
     * Snippet Routes
     */
    Route::prefix('snippets')->group(function () {
        Route::get('/', [SnippetController::class, 'index']);
        Route::post('/', [SnippetController::class, 'store']);
        Route::get('search', [SnippetController::class, 'search']);
        Route::get('{id}', [SnippetController::class, 'show']);
        Route::put('{id}', [SnippetController::class, 'update']);
        Route::delete('{id}', [SnippetController::class, 'destroy']);
    });
    
    /**
     * Favorite Routes
     */
    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('{id}', [FavoriteController::class, 'store']);
        Route::delete('{id}', [FavoriteController::class, 'destroy']);
    });
});