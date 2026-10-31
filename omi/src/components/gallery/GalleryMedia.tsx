"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/src/data/gallery";

const actionClass = "rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-[#061643] hover:bg-blue-50 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#58aceb] disabled:opacity-50";

export function GalleryMedia({ item }: { item: GalleryItem }) {
  const hasOriginalAudio = item.id === "origen-botella";
  const card = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const expandedVideo = useRef<HTMLVideoElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const playback = useRef({ visible: false, nearby: false, reduced: true, manual: false, paused: false, blocked: false, expanded: false });

  useEffect(() => {
    const element = video.current;
    const container = card.current;
    if (!element || !container || item.type !== "video") return;
    const state = playback.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    const shouldPlay = () => !disposed && state.visible && !document.hidden && !state.expanded && !state.paused && !state.blocked && (!state.reduced || state.manual);
    const sync = () => {
      if (hasOriginalAudio && (!state.visible || document.hidden)) {
        element.muted = true;
        setSoundEnabled(false);
      }
      if (state.nearby && !element.getAttribute("src")) {
        element.src = item.src;
        element.load();
      }
      if (shouldPlay()) {
        element.play().then(() => { if (!shouldPlay()) element.pause(); }).catch(() => {
          if (!disposed && shouldPlay()) { state.blocked = true; element.pause(); }
        });
      } else element.pause();
    };
    const preference = () => { state.reduced = motion.matches; state.manual = false; sync(); };
    preference();
    const nearby = new IntersectionObserver(([entry]) => {
      state.nearby = entry.isIntersecting;
      sync();
    }, { rootMargin: "300px" });
    const visible = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      sync();
    }, { threshold: [0, 0.2] });
    nearby.observe(container);
    visible.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", preference);
    // Manual actions use the same visibility and preference policy as autoplay.
    element.addEventListener("gallery-playback", sync);
    return () => {
      disposed = true;
      nearby.disconnect(); visible.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", preference);
      element.removeEventListener("gallery-playback", sync);
      element.pause();
    };
  }, [hasOriginalAudio, item]);

  useEffect(() => {
    if (!expanded) return;
    const modal = dialog.current;
    if (!modal) return;
    const trigger = expandButton.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    const pauseWhenHidden = () => { if (document.hidden) expandedVideo.current?.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      modal.close();
      trigger?.focus();
    };
  }, [expanded]);

  function close() {
    expandedVideo.current?.pause();
    playback.current.expanded = false;
    setExpanded(false);
    video.current?.dispatchEvent(new Event("gallery-playback"));
  }

  function toggleSound() {
    const element = video.current;
    if (!element) return;
    const enable = element.muted;
    element.muted = !enable;
    setSoundEnabled(enable);
    if (enable && element.paused) {
      const state = playback.current;
      state.paused = false;
      state.manual = true;
      state.blocked = false;
      state.nearby = true;
      element.dispatchEvent(new Event("gallery-playback"));
    }
  }

  return (
    <article ref={card} className="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white">
      <div className="relative overflow-hidden bg-[#061643]" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
        {item.type === "video" ? (
          <video ref={video} poster={item.poster} muted={!soundEnabled} loop playsInline preload="none"
            aria-label={item.description} aria-describedby={`gallery-description-${item.id}`}
            onPlay={() => setPlaying(true)} onPause={() => { setPlaying(false); if (hasOriginalAudio) { if (video.current) video.current.muted = true; setSoundEnabled(false); } }} onError={() => { setError(true); setPlaying(false); }}
            className="h-full w-full object-contain" />
        ) : (
          <Image src={item.src} alt={item.description} width={item.width} height={item.height}
            sizes={item.featured ? "(max-width: 1200px) 95vw, 1200px" : "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"}
            className="h-full w-full object-contain" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-semibold text-[#061643]">{item.title}</h3>
        <p id={`gallery-description-${item.id}`} className="sr-only">{item.description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {item.type === "video" && <button type="button" className={actionClass} disabled={error}
            aria-label={`${playing ? "Pausar" : "Reproducir"} ${item.title}`}
            onClick={() => {
              const state = playback.current;
              state.paused = playing; state.manual = !playing; state.blocked = false; state.nearby = true;
              video.current?.dispatchEvent(new Event("gallery-playback"));
            }}>{playing ? "Pausar" : "Reproducir"}</button>}
          {hasOriginalAudio && item.type === "video" && <button type="button" className={actionClass} disabled={error}
            aria-label={`${soundEnabled ? "Silenciar" : "Activar sonido de"} ${item.title}`}
            aria-pressed={soundEnabled} onClick={toggleSound}>{soundEnabled ? "Silenciar" : "Activar sonido"}</button>}
          <button ref={expandButton} type="button" className={actionClass} aria-haspopup="dialog"
            aria-label={`Ampliar ${item.title}`} onClick={() => {
              playback.current.expanded = true;
              video.current?.pause();
              setExpanded(true);
            }}>Ampliar</button>
        </div>
        {error && <p role="status" className="w-full text-sm text-slate-600">No se ha podido cargar el vídeo. Puedes ver su imagen estática.</p>}
      </div>
      {expanded && <dialog ref={dialog} aria-labelledby={`gallery-modal-${item.id}`}
        onCancel={event => { event.preventDefault(); close(); }} onClose={close}
        className="gallery-dialog fixed inset-0 m-auto max-h-[94dvh] w-[min(96vw,1100px)] overflow-y-auto rounded-2xl bg-[#061643] p-4 text-white backdrop:bg-[#020a20]/85">
        {/* Focus guards keep native video controls free to handle their own Tab sequence. */}
        <span tabIndex={0} className="sr-only" onFocus={event => {
          const modal = event.currentTarget.parentElement;
          (modal?.querySelector<HTMLVideoElement>("video") ?? modal?.querySelector<HTMLButtonElement>("button"))?.focus();
        }} />
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 id={`gallery-modal-${item.id}`} className="font-semibold">{item.title}</h3>
          <button type="button" autoFocus onClick={close} className="rounded-full border border-white/50 px-4 py-2 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white">Cerrar</button>
        </div>
        {item.type === "video" ? <video ref={expandedVideo} src={item.src} poster={item.poster} muted={!hasOriginalAudio} loop playsInline controls preload="metadata" aria-label={item.description} className="mx-auto max-h-[75dvh] w-full object-contain" />
          : <Image src={item.src} alt={item.description} width={item.width} height={item.height} sizes="95vw" className="mx-auto max-h-[75dvh] w-auto max-w-full object-contain" />}
        <span tabIndex={0} className="sr-only" onFocus={event => event.currentTarget.parentElement?.querySelector<HTMLButtonElement>("button")?.focus()} />
      </dialog>}
    </article>
  );
}
