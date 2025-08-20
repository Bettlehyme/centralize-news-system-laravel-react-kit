

import React, { useEffect, useState, useRef } from "react";
import { Head } from "@inertiajs/react"; // ✅ Inertia Head
import { ArrowDown } from "lucide-react";
import Feed from "@/component/feed";
import PulsingLogo from "@/component/pulsing-logo";
import type { NewsItem } from "@/types/types";
import Layout from "@/layout/layout";
import ScrollToTopButton from "@/component/scroll-to-up-button";

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pullDistance, setPullDistance] = useState(0);
  const limit = 20;
  const startY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch news
  const fetchNewsPage = async (page: number, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?page=${page}&limit=${limit}` // ✅ proxy through Laravel
      );
      const data: NewsItem[] = await res.json();
      setItems((prev) => (reset ? data : [...prev, ...data]));
      if (data.length < limit) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setPullDistance(0);
    }
  };

  // Initial + infinite scroll
  useEffect(() => {
    fetchNewsPage(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Pull-to-refresh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current !== null) {
        const distance = e.touches[0].clientY - startY.current;
        if (distance > 0) setPullDistance(Math.min(distance, 100));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 60) {
        setPage(1);
        setHasMore(true);
        fetchNewsPage(1, true);
      } else {
        setPullDistance(0);
      }
      startY.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance]);

  // SEO metadata
  const latest = items.length > 0 ? items[0] : null;
  const latestTitle = latest ? latest.title : "Latest News";
  const latestDesc =
    latest?.summary || "Stay updated with the latest headlines from trusted sources.";
  const latestImage = latest?.image;

  const jsonLd = latest
    ? {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: latest.title,
      datePublished: latest.pub_date,
      dateModified: latest.pub_date,
      author: { "@type": "Organization", name: latest.source || "Unknown" },
      publisher: {
        "@type": "Organization",
        name: "Centralize News",
        logo: {
          "@type": "ImageObject",
          url: "https://centralizenews.com/cns-black.png",
        },
      },
      image: latest.image ? [latest.image] : [],
      description: latest.summary || "",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": typeof window !== "undefined" ? window.location.href : "",
      },
    }
    : null;

  return (
    <>
      <Head>
        <title>{`Berita Terbaru - Centralize News`}</title>
        <meta name="description" content="Kami menyajikan berita berita terbaru dari berbagai media berita di Indonesia" />
        <link rel="canonical" href='https://centralizenews.com' />

        <meta property="og:title" content={`Berita Terbaru - Centralize News`} />
        <meta property="og:description" content="Kami menyajikan berita berita terbaru dari berbagai media berita di Indonesia" />
        <meta property="og:url" content="https://centralizenews.com" />
        <meta property="og:image" content="https://centralizenews.com/no-image.png" />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Berita Terbaru - Centralize News`} />
        <meta name="twitter:description" content="Kami menyajikan berita berita terbaru dari berbagai media berita di Indonesia" />
        <meta name="twitter:image" content="https://centralizenews.com/no-image.png" />
      </Head>


      <div
        ref={containerRef}
        className="flex flex-col items-center pt-6 pb-24 transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {pullDistance > 0 && (
          <div className="absolute top-2 text-gray-500">
            {pullDistance > 60 ? <ArrowDown /> : "Pull to refresh"}
          </div>
        )}

        <div className="w-full  mt-20">
          <div className="overflow-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {items.map((news: any) => (
                <Feed key={news.id} items={[news]} />
              ))}
            </div>
          </div>

          {loading && (
            <PulsingLogo
              src={
                document.documentElement.classList.contains("dark")
                  ? "/cns-white.png"
                  : "/cns-black.png"
              }
              size={90}
            />
          )}
          {!hasMore && <p className="text-center py-4">No more news</p>}
        </div>

      </div>
    </>
  );

}

News.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;
