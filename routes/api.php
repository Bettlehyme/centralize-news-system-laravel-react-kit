<?php

use App\Http\Controllers\Api\NewsController;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/news', function (Request $request) {
    $page = (int) $request->query('page', 1);
    $limit = (int) $request->query('limit', 20);
    $category = $request->query('category'); // e.g. "muslim", "sports", etc.

    $query = News::orderBy('pub_date', 'desc');

    if (!empty($category)) {
        // keyword map
       $categories = [
    'muslim' => [
        "islam", "muslim", "muslimah", "shalat", "salat", "puasa", "ramadan", 
        "haji", "umrah", "zakat", "sedekah", "infak", "hadith", "al-qur’an", 
        "tafsir", "sunnah", "kajian", "tausiyah", "pesantren", "kyai", 
        "ustaz", "ustazah", "masjid", "halal", "fatwa", "dakwah", "maulid", 
        "isra mi’raj", "idul fitri", "idul adha"
    ],

    'politics' => [
        "politik", "pemilu", "partai", "parlemen", "presiden", "gubernur", 
        "legislatif", "kabinet", "kebijakan", "undang-undang", "DPR", "MPR", 
        "menteri", "pilkada", "kampanye", "legislasi", "radikalisasi", 
        "oposisi", "pemerintah", "demokrasi"
    ],

    'sports' => [
        "sepak bola", "bola", "liga", "pertandingan", "atlet", "olahraga", 
        "juara", "turnamen", "piala", "basket", "voli", "bulu tangkis", 
        "futsal", "renang", "marathon", "timnas", "skor", "stadion", 
        "kompetisi", "olimpiade"
    ],

    'entertainment' => [
        "film", "musik", "artis", "selebriti", "hiburan", "tv", "sinetron", 
        "konser", "lagu", "album", "aktor", "aktris", "reality show", 
        "influencer", "youtube", "tiktok", "bioskop", "teater", "drama", 
        "award", "fashion"
    ],

    'economy' => [
        "ekonomi", "bisnis", "bank", "uang", "investasi", "perusahaan", 
        "startup", "saham", "bursa", "perdagangan", "fintech", "industri", 
        "e-commerce", "pajak", "pasar", "perbankan", "asuransi", "ekspor", 
        "impor", "UMKM", "kredit", "syariah", "halal"
    ],

    'technology' => [
        "teknologi", "internet", "gadget", "smartphone", "aplikasi", 
        "startup", "AI", "robot", "inovasi", "software", "hardware", "IT", 
        "digital", "media sosial", "platform", "komputer", "cybersecurity", 
        "blockchain", "crypto", "VR", "data"
    ],

    'health' => [
        "kesehatan", "dokter", "rumah sakit", "obat", "penyakit", "vaksin", 
        "pandemi", "covid", "tips kesehatan", "nutrisi", "gaya hidup", 
        "olahraga", "mental", "psikologi", "medis", "laboratorium", 
        "imunisasi", "diet", "rawat inap", "klinik", "herbal"
    ],

    'social' => [
        "masyarakat", "komunitas", "bencana", "banjir", "gempa", "bantuan", 
        "donor", "sosial", "pendidikan", "sekolah", "kampus", "acara", 
        "festival", "kampanye sosial", "charity", "kerja sama", "relawan", 
        "keluarga", "budaya", "tradisi"
    ],
];


        if (isset($categories[$category])) {
            $keywords = $categories[$category];

            $query->where(function ($q) use ($keywords) {
                foreach ($keywords as $word) {
                    $q->orWhere('summary', 'like', "%{$word}%");
                }
            });
        }
    }

    return $query
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
