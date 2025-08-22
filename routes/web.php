<?php

use App\Models\News;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Spatie\Sitemap\SitemapGenerator;

Route::get('/', function () {
    return Inertia::render(
        'news',
        ['canonicalUrl' => url()->current(),]
    );
})->name('news');

Route::get('/sources', function () {
    return Inertia::render(
        'sources',
        ['canonicalUrl' => url()->current(),]
    );
})->name('sources');

Route::get('/sources/{source}', function ($source, Request $request) {
    return Inertia::render('source', [
        'source' => $source,
        'seo' => [
            'title' => "Berita {$source} Terbaru - Centralize News",
            'description' => "Berita terbaru dari {$source}",
            'url' => url()->current(),
            'image' => public_path('no-image.png'),
        ]
    ]);
})->name('source');

Route::get('/news/title/{slug}', function ($slug, Request $request) {
    $article = News::where('slug', $slug)->firstOrFail();

    return Inertia::render('news-page', [
        'slug' => $slug,
        'canonicalUrl' => url()->current(),
        'seo' => [
            'title' => $article->title,
            'description' => Str::limit(strip_tags($article->summary), 150),
            'image' => $article->image ?? public_path('no-image.png'),
            'url' => url()->current(),
        ],
        'article' => $article,
    ]);
})->name('newsPage');

Route::get('/sitemap.xml', function () {
    $urls = [
        url('/sitemap-news.xml'),
        url('/sitemap-archive.xml'),
        url('/sitemap-pages.xml'),
    ];

    return Response::make(view('sitemap.index', compact('urls')), 200, [
        'Content-Type' => 'application/xml'
    ]);
});

Route::get('/sitemap-news.xml', function () {
    $news = \App\Models\News::orderBy('pub_date', 'desc')
        ->take(500) // only latest 500
        ->get();

    return Response::make(view('sitemap.news', compact('news')), 200, [
        'Content-Type' => 'application/xml'
    ]);
});


Route::get('/sitemap-archive.xml', function () {
    $news = \App\Models\News::orderBy('pub_date', 'desc')
        ->skip(500) // skip latest 500
        ->take(5000)
        ->get();

    return Response::make(view('sitemap.archive', compact('news')), 200, [
        'Content-Type' => 'application/xml'
    ]);
});

Route::get('/sitemap-pages.xml', function () {
    $pages = [
        url('/'),
        url('/sources'),
    ];

    return Response::make(view('sitemap.pages', compact('pages')), 200, [
        'Content-Type' => 'application/xml'
    ]);
});


Route::get('/robots.txt', function () {
    return response("User-agent: *\nDisallow:\n\nSitemap: https://centralizenews.com/sitemap.xml")
        ->header('Content-Type', 'text/plain');
});
