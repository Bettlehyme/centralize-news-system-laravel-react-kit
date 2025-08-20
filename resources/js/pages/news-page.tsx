import React, { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import PulsingLogo from "@/component/pulsing-logo";
import { NewsItem } from "@/types/types";
import FeedSingle from "@/component/feed-single";
import Layout from "@/layout/layout";

interface Props {
  slug: string;
  canonicalUrl: string;
}

export default function NewsPage({ slug, canonicalUrl }: Props) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch single news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news/title/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      const data: NewsItem = await res.json();
      setNewsItem(data);
    } catch (err) {
      console.error(err);
      setNewsItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PulsingLogo src="/cns-black.png" size={90} />

      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PulsingLogo src="/cns-black.png" size={90} />
        <p>News not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-6 pb-24">
      <Head>
        <title>{newsItem?.title ? `${newsItem.title} - Centralize News` : "Centralize News"}</title>
        <meta name="description" content={newsItem?.summary || ""} />
        <link rel="canonical" href={canonicalUrl ||'https://centralizenews.com'} />

        <meta property="og:title" content={newsItem?.title ? `${newsItem.title} - Centralize News` : "Centralize News"} />
        <meta property="og:description" content="Stay updated with the latest tech news, product releases, and reviews." />
        <meta property="og:url" content={newsItem?.title ? `https://centralizenews.com/news/title/${newsItem.slug}`: 'https://centralizenews.com' } />
        <meta property="og:image" content={newsItem?.image ? `${newsItem.image}` : "https://centralizenews.com/no-image.png"} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={newsItem?.title ? `${newsItem.title} - Centralize News` : "Centralize News"} />
        <meta name="twitter:description" content={newsItem?.summary || ""}/>
        <meta name="twitter:image" content={newsItem?.image ? `${newsItem.image}` : "https://centralizenews.com/no-image.png"} />
      </Head>

      <div className="w-full max-w-md  lg:max-w-[60vw] mt-20">
        <FeedSingle key={newsItem.id} items={[newsItem]} />
      </div>
    </div>
  );
};

NewsPage.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;