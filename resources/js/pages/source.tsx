'use client';

import React, { useEffect, useState, useRef } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowDown } from "lucide-react";
import Feed from "@/component/feed";
import PulsingLogo from "@/component/pulsing-logo";
import type { NewsItem } from "@/types/types";
import Layout from "@/layout/layout";

const limit = 10;

type Props = {
    source: string;
};

export default function Source({ source }: Props) {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pullDistance, setPullDistance] = useState(0);
    const startY = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchNewsPage = async (page: number, reset = false) => {
        if (!source) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/news/source/${encodeURIComponent(source)}?page=${page}&limit=${limit}`);
            if (!res.ok) throw new Error("Failed to fetch news");
            const data: NewsItem[] = await res.json();
            setItems(prev => reset ? data : [...prev, ...data]);
            if (data.length < limit) setHasMore(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setPullDistance(0);
        }
    };

    // Initial load and page change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchNewsPage(1, true);
    }, [source]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
                !loading &&
                hasMore
            ) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page === 1) return;
        fetchNewsPage(page);
    }, [page]);

    // Pull-to-refresh
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) startY.current = e.touches[0].clientY;
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
    }, [pullDistance, source]);

    const latestTitle = items.length > 0 ? items[0].title : `${source} - Latest News`;
    const latestDesc = items.length > 0 ? items[0].summary || `Latest news from ${source}` : `Latest news from ${source}`;
    const latestImage = items.length > 0 ? items[0].image : undefined;

    return (
        <>
            {/* <Head>
                   <title>{`Berita ${source} Terbaru - Centralize News`}</title>
                   <meta name="description" content={`Berita terbaru dari ${source}`} />
                   <link rel="canonical" href={`https://centralizenews.com/sources/${source}`} />
           
                   <meta property="og:title" content={`Berita ${source} Terbaru - Centralize News`} />
                   <meta property="og:description" content={`Berita terbaru dari ${source}`} />
                   <meta property="og:url" content={`https://centralizenews.com/sources/${source}`} />
                   <meta property="og:image" content="https://centralizenews.com/no-image.png" />
                   <meta property="og:type" content="article" />
           
                   <meta name="twitter:card" content="summary_large_image" />
                   <meta name="twitter:title" content={`Berita ${source} Terbaru - Centralize News`} />
                   <meta name="twitter:description" content={`Berita terbaru dari ${source}`}/>
                   <meta name="twitter:image" content="https://centralizenews.com/no-image.png" />
                 </Head> */}

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

                {!loading &&
                    <div className="mt-20">
                        <h2 className="text-2xl text-center mb-8">{source}</h2>
                    </div>
                }


                <div className="w-full max-w-md mt-1">
                    {items.map((news, idx) => (
                        <Feed key={idx} items={[news]} />
                    ))}

                    {loading && (
                        <PulsingLogo
                            src={document.documentElement.classList.contains("dark") ? "/cns-white.png" : "/cns-black.png"}
                            size={90}
                        />
                    )}
                    {!hasMore && <p className="text-center py-4">No more news</p>}
                </div>
            </div>
        </>
    );
}

Source.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;