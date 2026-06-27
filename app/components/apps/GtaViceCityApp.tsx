"use client";

import React, { useRef, useEffect } from "react";

interface GtaViceCityAppProps {
  src?: string;
  onVideoEnd?: () => void;
}

export default function GtaViceCityApp({ src = "/GTA_INDIA.mp4", onVideoEnd }: GtaViceCityAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Set start time to 5 seconds on mount/render
      video.currentTime = 5;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented. User interaction required:", error);
        });
      }
    }
  }, [src]); // Re-trigger on source changes

  return (
    <div className="w-full h-full bg-black relative overflow-hidden select-none flex items-center justify-center cursor-none">
      <video
        ref={videoRef}
        src={src}
        style={{
          width: "100vh",
          height: "100vw",
          transform: "rotate(-90deg)",
          objectFit: "cover",
        }}
        className="select-none pointer-events-none"
        autoPlay
        playsInline
        onEnded={onVideoEnd}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 5;
          }
        }}
      />
    </div>
  );
}
