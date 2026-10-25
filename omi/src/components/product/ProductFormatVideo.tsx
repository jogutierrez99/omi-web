"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProductFormatVideoProps = {
  id: string;
  videoSrc: string;
  fallbackSrc: string;
  alt: string;
};

export function ProductFormatVideo({ id, videoSrc, fallbackSrc, alt }: ProductFormatVideoProps) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const playback = useRef({ visible: false, nearby: false, reduced: true, manual: false, paused: false, blocked: false });
  const videoId = `product-video-${id}`;

  useEffect(() => {
    const element = video.current;
    const wrapper = container.current;
    if (!element || !wrapper) return;

    const state = playback.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;

    const shouldPlay = () =>
      !disposed &&
      state.visible &&
      !document.hidden &&
      !state.paused &&
      !state.blocked &&
      (!state.reduced || state.manual);

    const sync = () => {
      if (state.nearby && !element.getAttribute("src")) {
        element.src = videoSrc;
        element.load();
      }

      if (!element.getAttribute("src")) {
        element.pause();
        return;
      }

      if (shouldPlay()) {
        element.play().then(() => {
          if (!shouldPlay()) element.pause();
        }).catch(() => {
          if (!disposed && shouldPlay()) {
            state.blocked = true;
            element.pause();
          }
        });
      } else {
        element.pause();
      }
    };

    const updateMotionPreference = () => {
      state.reduced = motion.matches;
      state.manual = false;
      sync();
    };

    updateMotionPreference();

    const nearbyObserver = new IntersectionObserver(([entry]) => {
      state.nearby = entry.isIntersecting;
      sync();
    }, { rootMargin: "300px" });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      sync();
    }, { threshold: [0, 0.25] });

    nearbyObserver.observe(wrapper);
    visibilityObserver.observe(wrapper);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", updateMotionPreference);
    element.addEventListener("product-playback", sync);

    return () => {
      disposed = true;
      nearbyObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", updateMotionPreference);
      element.removeEventListener("product-playback", sync);
      element.pause();
    };
  }, [videoSrc]);

  return (
    <div ref={container} className="relative mt-4 h-72 overflow-hidden rounded-xl bg-[#061643]">
      <Image
        src={fallbackSrc}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width:640px) 90vw,(max-width:1024px) 45vw,22vw"
        className={`object-contain object-bottom transition-opacity duration-300 ${ready && !error ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={video}
        id={videoId}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onCanPlay={() => {
          setReady(true);
          video.current?.dispatchEvent(new Event("product-playback"));
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${ready && !error ? "opacity-100" : "opacity-0"}`}
      >
        Tu navegador no admite la reproducción de vídeo.
      </video>
      {!error && (
        <button
          type="button"
          aria-controls={videoId}
          aria-label={`${playing ? "Pausar" : "Reproducir"} animación de ${alt}`}
          onClick={() => {
            const state = playback.current;
            state.paused = playing;
            state.manual = !playing;
            state.blocked = false;
            state.nearby = true;
            video.current?.dispatchEvent(new Event("product-playback"));
          }}
          className="absolute bottom-3 right-3 rounded-full border border-white/60 bg-[#061643]/85 px-3 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-[#0873ce] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {playing ? "Pausar" : "Reproducir"}
        </button>
      )}
      {error && <p role="status" className="sr-only">No se ha podido cargar la animación. Se muestra la imagen estática.</p>}
    </div>
  );
}
