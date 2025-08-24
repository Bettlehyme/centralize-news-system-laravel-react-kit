import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Home, Folder, MessagesSquare, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ScrollToTopButton from './scroll-to-up-button';

export default function Dock() {
  const { url } = usePage();
  const [isDark, setIsDark] = useState(false);
  const dockItems = [
    { icon: <Home size={18} />, path: '/', label: 'Home' },
    { icon: <Folder size={18} />, path: '/sources', label: 'Sources' },
    // { icon: <Mail size={18} />, path: '/comments', label: 'Comments' },

  ];

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  return (
    <div>
      <nav
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex bg-white dark:bg-gray-900 shadow-lg rounded-full px-2 py-2 gap-7 z-50"
        aria-label="Main navigation"
      >
        {dockItems.map((item, index) => {
          const isActive = url === item.path;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, 
                borderRadius:'80%'
              }}
              animate={{
                scale: isActive ? 1.4 : 1,
                backgroundColor: isActive
                  ? "#ECB779"
                  : isDark
                    ? "var(--color-bg)"
                    : "var(--color-bg)",
                color: isActive
                  ? "#fff"
                  : isDark
                    ? "var(--color-text)"
                    : "var(--color-text)",
                borderRadius: isActive ? '50%' : '30%'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center  justify-center w-12 h-12 cursor-pointer"
            >
              <Link
                href={item.path}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="flex items-center  justify-center w-full h-full no-underline"
                preserveScroll preserveState
              >
                {item.icon}
              </Link>
            </motion.div>
          );
        })}

      </nav>

      <ScrollToTopButton />

    </div>
  );
}
