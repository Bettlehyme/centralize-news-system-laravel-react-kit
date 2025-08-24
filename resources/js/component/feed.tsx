'use client';

import { Newspaper, Share, Share2, SquareArrowOutUpRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { NewsItem } from "@/types/types";



interface FeedProps {
  items: NewsItem[];
}

export default function Feed({ items }: FeedProps) {
  const handleShareNews = async (title: string, url?: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };
  const handleShareFeed = async (title: string, slug: string, url?: string) => {
    let shareUrl = `/news/title/${encodeURIComponent(slug)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  function timeAgo(dateString: string | null | undefined): string {
    if (!dateString) return "";

    const now = new Date();
    const postDate = new Date(dateString);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000); // difference in seconds

    if (diff < 60) return `${diff}d lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  }


  return (
    <div className="max-w-md mx-auto">
      {items.map((post) => {
        const [openShare, setOpenShare] = useState(false);

        return (

          <motion.div
            key={post.id}
            className="bg-white mx-2 dark:bg-gray-800 rounded-xl shadow-sm mb-6 border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <article

            >
              {/* Header */}
              <header className="flex items-center">
                <div className="w-full h-full relative overflow-hidden px-4 py-3">
                  <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ width: "100%", backgroundColor: post.color || '#ECB779' }}
                    // whileInView={{ width: "100%", backgroundColor: post.color || '#ECB779' }}
                    // transition={{ duration: 2, ease: "easeInOut" }}
                  />

                  <div className="flex flex-row items-center justify-between relative z-10">
                    <Link
                      href={`/sources/${encodeURIComponent(post.source!)}`}
                      className="decoration-black text-gray-900 dark:text-gray-200"
                      preserveScroll preserveState
                    >
                      <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {post.source || "News"}
                      </p>
                    </Link>

                    <time
                      className="text-sm text-gray-900 dark:text-gray-200"
                      dateTime={post.pub_date}
                    >
                      {post.pub_date ? timeAgo(post.pub_date) : ""}
                    </time>
                  </div>
                </div>
              </header>

              {/* Image + Title Overlay */}
              <div className="relative w-full aspect-[1/1]">
                <img
                  src={post.image ? post.image : '/no-image.png'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/2 shadow-[inset_0_0_50px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                <motion.div
                  className="absolute top-0 left-0 right-0 bg-black/60 p-4 rounded-b-2xl"
                >
                  <h1 style={{ fontSize: "1.1rem", fontWeight: '600', lineHeight: '1.6rem' }} className="text-white text-xl font-semibold">{post.title}</h1>
                </motion.div>

                {/* Share Button with vertical expanding children */}
                <div className="absolute bottom-5 right-5 flex flex-col items-end space-y-2">
                  <AnimatePresence>
                    {openShare && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        // style={{color: 'black'}}
                        className="flex flex-col items-end space-y-2"
                      >
                        <motion.button
                          onClick={() => handleShareFeed(post.title, post.slug, post.link)}
                          className=" w-15 h-15 px-4 py-2 shadow "
                          whileHover={{ scale: 1.05, color: '#fff', border: 'none' }}
                          whileInView={{ scale: 1, opacity: 1, outline: 'none', borderRadius: '50%', border: 'none' }}
                        >
                          <Share width={20} />
                        </motion.button>

                        <motion.button
                          onClick={() => handleShareNews(post.title, post.link)}
                          className=" w-15 h-15  text-gray-900 dark:text-gray-100 px-4 py-2 shadow "
                          whileHover={{ scale: 1.05, color: '#fff', border: 'none' }}
                          whileInView={{ scale: 1, opacity: 1, outline: 'none', borderRadius: '50%', border: 'none' }}
                        >
                          <Newspaper width={20} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => setOpenShare(!openShare)}
                    className="rounded-full w-14 h-14 flex items-center justify-center text-gray-900 dark:text-gray-100"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1, outline: 'none', borderRadius: '30%' }}
                    whileHover={{ scale: 1.2, border: '2px solid #ECB779', color: '#ECB779', borderRadius: '50%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Footer / Caption */}
              <footer className="px-4 pb-4 mt-3">
                <p className="text-sm text-gray-900 dark:text-gray-100 truncate-text">
                  <span className="font-semibold">{post.source || "News"} </span>
                  {post.summary}
                </p>
                {post.link && (
                  <div className="w-full flex justify-between items-center mt-2">
                    <Link
                      href={`${window.location.origin}/news/title/${post.slug}`}
                      rel="noopener noreferrer"
                      style={{ color: 'oklch(62.3% 0.214 259.815)', fontWeight: '600' }}
                      className="text-sm text-blue-500 dark:text-blue-400 mt-1 inline-block"
                      preserveScroll preserveState
                    >
                      Read More
                    </Link>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'oklch(62.3% 0.214 259.815)', fontWeight: '600' }}
                      className="flex text-sm text-blue-500 dark:text-blue-400 mt-1 gap-1"
                    >
                      Full Article<SquareArrowOutUpRight size={15} />
                    </a>
                  </div>
                )}
              </footer>
            </article>

          </motion.div>

        );
      })}
    </div >
  );
}
