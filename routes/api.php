<?php

use App\Http\Controllers\Api\NewsController;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/news', function (Request $request) {
    $page = (int) $request->query('page', 1);
    $limit = (int) $request->query('limit', 20);

    return News::orderBy('pub_date', 'desc')
        ->skip(($page - 1) * $limit)
        ->take($limit)
        ->get();
});

Route::get('/news/latest', function () {
    return News::orderBy('pub_date', 'desc')->take(20)->get();
});

Route::get('/news/title/{slug}', function ($slug) {
    return News::where('slug', urldecode($slug))->firstOrFail();
});

Route::get('/news/source/{source}', function (Request $request, $source) {
    $page = (int) $request->query('page', 1);
    $limit = (int) $request->query('limit', 20);

    return News::where('source', urldecode($source))
        ->orderBy('pub_date', 'desc')
        ->skip(($page - 1) * $limit)
        ->take($limit)
        ->get();
});

Route::get('/news/sources/today', function () {
    $today = now()->startOfDay();

    // Get all distinct sources from the News table
    $allSources = News::select('source', 'color')->distinct()->get();

    // Get counts and max image for today
    $todayCounts = News::where('pub_date', '>=', $today)
        ->selectRaw('source, MAX(image) as profile_pic, COUNT(*) as count')
        ->groupBy('source')
        ->get()
        ->keyBy('source');

    // Merge all sources with today's data, defaulting to 0/count = null if no articles today
    $result = $allSources->map(function ($source) use ($todayCounts) {
        $data = $todayCounts->get($source->source);
        return [
            'source'      => $source->source,
            'color'       => $source->color,
            'profile_pic' => $data->profile_pic ?? null,
            'count'       => $data->count ?? 0,
        ];
    });

    return $result;
});
