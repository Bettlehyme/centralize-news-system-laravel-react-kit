<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach($news as $item)
    <url>
        <loc>{{ url('/news/title/' . urlencode($item->slug)) }}</loc>
        <lastmod>{{ $item->pub_date->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
@endforeach
</urlset>
