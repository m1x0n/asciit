<?php

namespace App\Http\Controllers\API;

use App\Services\RemoteDataGrabber\Contracts\DataGrabber;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;

class CodeSnippetController extends Controller
{
    /**
     * Returns a view for a frame with the GitHub Gist widget
     *
     * @return Response
     */
    public function getGistWidget(Request $request, DataGrabber $grabber)
    {
        $link = $request->get('link') . '.json';
        try {
            $data = $grabber->getFromJson($link);
        } catch (\RuntimeException $e) {
            return Response::json([$e->getMessage()], 400);
        }

        $prefix = env('SERVER_PREFIX', '');

        return Response::view('widgets.gist', [
            'stylesheet_link' => $data->stylesheet,
            'snippet'         => $data->div,
            'js_path' => ($prefix ? '/' : '' ) . env('JS_PATH'),
        ]);
    }
}