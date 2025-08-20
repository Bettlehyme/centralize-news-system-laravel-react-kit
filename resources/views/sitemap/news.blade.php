<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
@foreach($news as $item)
    <url>
        <loc>{{ url('/news/title/' . urlencode($item->slug)) }}</loc>
        <news:news>
            <news:publication>
                <news:name>Centralize News</news:name>
                <news:language>id</news:language>
            </news:publication>
            <news:publication_date>{{ $item->pub_date->toAtomString() }}</news:publication_date>
            <news:title><![CDATA[{{ $item->title }}]]></news:title>
        </news:news>
    </url>
@endforeach
</urlset>
