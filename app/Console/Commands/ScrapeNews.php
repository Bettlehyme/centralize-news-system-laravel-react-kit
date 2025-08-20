<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\News;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use willvincent\Feeds\Facades\FeedsFacade;
use Illuminate\Support\Str;

class ScrapeNews extends Command
{
    protected $signature = 'news:scrape';
    protected $description = 'Scrape RSS feeds and store latest news';

    protected $feeds = [
        ["url" => "https://news.detik.com/berita/rss", "source" => "Detik - Berita", "color" => "#F97316", "profileUrl" => "https://play-lh.googleusercontent.com/XBEsKIzEGjAPf6K6TFBNs1v3P8_TWZpX36VPde31_2XJIOT4W4aIgbGvjJPp20kK7D0=w240-h480-rw"],
        ["url" => "https://finance.detik.com/rss", "source" => "Detik - Finance", "color" => "#10B981", "profileUrl" => "https://example.com/logo-detik-finance.png"],
        ["url" => "https://rss.kompas.com/api/feed/social?apikey=bc58c81819dff4b8d5c53540a2fc7ffd83e6314a", "source" => "Kompas", "color" => "#3B82F6", "profileUrl" => "https://example.com/logo-kompas.png"],
        ["url" => "https://feed.liputan6.com/rss/news", "source" => "Liputan 6", "color" => "#8B5CF6", "profileUrl" => "https://example.com/logo-liputan6.png"],
        ["url" => "http://rss.tempo.co/nasional", "source" => "Tempo - Nasional", "color" => "#EF4444", "profileUrl" => "https://example.com/logo-tempo.png"],
        ["url" => "http://rss.tempo.co/bisnis", "source" => "Tempo - Bisnis", "color" => "#F59E0B", "profileUrl" => "https://example.com/logo-tempo-bisnis.png"],
        ["url" => "https://www.cnnindonesia.com/ekonomi/rss", "source" => "CNN Indonesia - Ekonomi", "color" => "#06B6D4", "profileUrl" => "https://example.com/logo-cnn-ekonomi.png"],
        ["url" => "https://www.cnnindonesia.com/nasional/rss", "source" => "CNN Indonesia - Nasional", "color" => "#2563EB", "profileUrl" => "https://example.com/logo-cnn-nasional.png"],
        ["url" => "https://www.cnbcindonesia.com/news/rss", "source" => "CNBC Indonesia - News", "color" => "#22C55E", "profileUrl" => "https://example.com/logo-cnbc-news.png"],
        ["url" => "https://www.cnbcindonesia.com/market/rss/", "source" => "CNBC Indonesia - Market", "color" => "#D946EF", "profileUrl" => "https://example.com/logo-cnbc-market.png"],
        ["url" => "https://www.republika.co.id/rss", "source" => "Republika Online", "color" => "#F43F5E", "profileUrl" => "https://example.com/logo-republika.png"],
        ["url" => "https://mediaindonesia.com/feed", "source" => "Media Indonesia", "color" => "#8B5CF6", "profileUrl" => "https://example.com/logo-mediaindonesia.png"],
        ["url" => "https://lapi.kumparan.com/v2.0/rss/", "source" => "Kumparan", "color" => "#FACC15", "profileUrl" => "https://example.com/logo-kumparan.png"],
    ];


    public function handle()
    {
        foreach ($this->feeds as $feed) {
            $this->info("Scraping: {$feed['source']}");

            try {
                $rss = FeedsFacade::make($feed['url']);
                foreach ($rss->get_items() as $item) {
                    $pubDate = Carbon::parse($item->get_date());

                    // Skip if already exists
                    if (News::where('link', $item->get_link())->exists()) {
                        continue;
                    }

                    News::create([
                        'title' => $item->get_title() . " – {$feed['source']}",
                        'slug' => Str::slug($item->get_title()),
                        'link' => $item->get_link(),
                        'summary' => strip_tags(html_entity_decode($item->get_description() ?? '')),
                        'pub_date' => $pubDate,
                        'source' => $feed['source'],
                        'image' => $this->extractImage($item),
                        'color' => $feed['color'],
                    ]);
                }
            } catch (\Exception $e) {
                $this->error("Error scraping {$feed['url']}: {$e->getMessage()}");
            }
        }

        $this->info("Scraping finished.");
        Http::get("https://www.google.com/ping?sitemap=" . urlencode(url('/sitemap.xml')));
    }
    private function extractImage($item)
    {
        // Try enclosure first
        if (method_exists($item, 'get_enclosure') && $enclosure = $item->get_enclosure()) {
            if (!empty($enclosure->link)) {
                return $enclosure->link;
            }
        }

        // Fallback: extract first <img> in content
        $content = $item->get_content() ?? '';
        if (preg_match('/<img.*?src="(.*?)"/', $content, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
