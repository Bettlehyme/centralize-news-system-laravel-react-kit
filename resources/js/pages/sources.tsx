'use client';

import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import PulsingLogo from "@/component/pulsing-logo";
import Layout from "@/layout/layout";

type Source = {
  source: string;
  color: string;
  profile_pic: string;
  count: number;
};

export default function Sources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news/sources/today");
        if (!res.ok) throw new Error("Failed to fetch sources");
        const data: Source[] = await res.json();
        setSources(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sources");
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center">
        <PulsingLogo
          src={
            document.documentElement.classList.contains("dark")
              ? "/cns-white.png"
              : "/cns-black.png"
          }
          size={90}
        />
      </div>
    );

  if (error)
    return <p className="text-center mt-6 text-red-500">Error: {error}</p>;

  return (
    <>
      <Head>
        <title>{`Sumber Berita - Centralize News`}</title>
        <meta name="description" content="Kami menyajikan berita berita terbaru dari berbagai media berita di Indonesia" />
        <link rel="canonical" href='https://centralizenews.com' />

        <meta property="og:title" content={`Berita Terbaru - Centralize News`} />
        <meta property="og:description" content="Kami menyajikan berita berita terbaru dari berbagai media berita di Indonesia" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://centralizenews.com/no-image.png" />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Berita Terbaru - Centralize News`} />
        <meta name="twitter:description" content="Kami menyajikan berita berita terbaru dari berbagai media berita di Indonesia" />
        <meta name="twitter:image" content="https://centralizenews.com/no-image.png" />
      </Head>

      <div className="max-w-5xl mx-auto mt-12 px-4 py-12">
        <h2 className="text-2xl text-center mb-8">News Sources</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {sources.map((src) => (
            <Link
              key={src.source}
              href={`/sources/${encodeURIComponent(src.source)}`}
              className="relative w-full rounded-2xl shadow-md overflow-hidden aspect-square group"
              style={{
                backgroundImage: `url(${src.profile_pic || "/no-image.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient Overlay */}
              <motion.div
                className="absolute inset-0 z-0 group-hover:opacity-90"
                style={{
                  background: `linear-gradient(to top, ${src.color || '#333'} 0%, rgba(0, 0, 0, 0) 100%)`,
                }}
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-4">
                <motion.h2
                  className="font-semibold text-lg text-white"
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {src.source}
                </motion.h2>
                <motion.p
                  className="text-sm text-white/80"
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {src.count} news today
                </motion.p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

Sources.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;
