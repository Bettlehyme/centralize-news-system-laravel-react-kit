<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Default / SEO Meta -->
    <title>{{ $page['props']['seo']['title'] ?? config('app.name', 'Laravel') }}</title>
    <meta name="description"
        content="{{ $page['props']['seo']['description'] ?? 'Latest curated news from trusted sources.' }}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ $page['props']['seo']['title'] ?? config('app.name', 'Laravel') }}">
    <meta property="og:description"
        content="{{ $page['props']['seo']['description'] ?? 'Stay updated with curated news.' }}">
    <meta property="og:image" content="{{ $page['props']['seo']['image'] ?? asset('no-image.png') }}">
    <meta property="og:url" content="{{ $page['props']['seo']['url'] ?? config('app.url') }}">
    <meta property="og:type" content="article">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $page['props']['seo']['title'] ?? '' }}">
    <meta name="twitter:description" content="{{ $page['props']['seo']['description'] ?? '' }}">
    <meta name="twitter:image" content="{{ $page['props']['seo']['image'] ?? asset('no-image.png') }}">

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.png">

    {{-- <meta name="google-adsense-account" content="ca-pub-2628453361143420"> --}}

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<script>
    (function(s) {
        s.dataset.zone = '10078083', s.src = 'https://groleegni.net/vignette.min.js'
    })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
</script>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
