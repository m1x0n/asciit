<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('base');
});

Route::group(['prefix' => 'api/v1'], function() {
    Route::resource('/questions', 'API\QuestionController');
    Route::resource('/questions/{id}/answers', 'API\Question\AnswerController');
    Route::resource('/user', 'API\UserController');
});
