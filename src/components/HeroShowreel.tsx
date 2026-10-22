import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/utils";

const DESKTOP = "/videos/izzy-hero.mp4";
const COMPATIBLE = "/videos/izzy-hero-mobile.mp4";
const POSTER = "/images/facilities/outdoor-image.jpg";

export default function HeroShowreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState(() =>
    window.matchMedia("(max-width: 768px)").matches ? COMPATIBLE : DESKTOP,
  );
  const [failed, setFailed] = useState(false);
  const [still, setStill] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video || document.hidden || still) return;
    video.muted = true;
    video.playbackRate = 0.5;
    void video.play().catch(() => {
      // Autoplay may be deferred until the page is visible or receives input.
    });
  }, [still]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (still || failed) return;
    play();
    document.addEventListener("visibilitychange", play);
    window.addEventListener("focus", play);
    window.addEventListener("pointerdown", play);
    const video = videoRef.current;
    return () => {
      document.removeEventListener("visibilitychange", play);
      window.removeEventListener("focus", play);
      window.removeEventListener("pointerdown", play);
      video?.pause();
    };
  }, [source, still, failed, play]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-forest-950" aria-hidden="true">
      {failed || still ? (
        <img src={asset(POSTER)} alt="" className="h-full w-full object-cover" />
      ) : (
        <video
          key={source}
          ref={videoRef}
          src={asset(source)}
          poster={asset(POSTER)}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          onLoadedData={play}
          onCanPlay={play}
          onError={() => {
            if (source === DESKTOP) setSource(COMPATIBLE);
            else setFailed(true);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
