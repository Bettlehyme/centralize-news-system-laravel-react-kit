'use client';

import { useEffect } from "react";

interface AdSenseAdProps {
  slot: string; // Ad slot ID
  style?: React.CSSProperties; // Optional inline style
  format?: string; // e.g., "auto"
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  slot,
  style = { display: "block" },
  format = "auto",
  className,
}) => {
  useEffect(() => {
    // try {
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // } catch (e) {
    //   console.error("AdSense error", e);
    // }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={style}
      data-ad-client="ca-pub-2628453361143420"
      data-ad-slot={slot}
      data-ad-format={format}
    ></ins>
  );
};

export default AdSenseAd;
