import React from "react";
import { ArrowLeft } from "lucide-react";
import { usePage, router } from "@inertiajs/react";

const BackButton: React.FC = () => {
  const { url } = usePage(); // Inertia gives current URL (e.g. "/news/title/...")

  // Don't show on homepage "/"
  if (url === "/") return null;

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          router.visit("/"); // fallback to home
        }
      }}
      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md p-2 transition"
    >
      <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-white" />
    </button>
  );
};

export default BackButton;
