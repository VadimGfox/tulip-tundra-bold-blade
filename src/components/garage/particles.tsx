import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
};

function headerHeight() {
  const header = document.querySelector(".garage-header");
  if (!header) return 0;
  return Math.max(0, header.getBoundingClientRect().height);
}

function spawn(w: number, top: number, h: number): Mote {
  const span = Math.max(48, h - top);
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.12 + Math.random() * 0.42;
  return {
    x: Math.random() * w,
    y: top + Math.random() * span,
    z: 0.35 + Math.random() * 1,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed * 0.85,
    life: Math.random() * 4,
    max: 10 + Math.random() * 16,
  };
}

export function AmbientDust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let top = 0;
    let raf = 0;
    let motes: Mote[] = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      const nextTop = headerHeight();
      const rebuild = motes.length === 0 || Math.abs(nextW - w) > 48 || Math.abs(nextH - h) > 80;
      w = nextW;
      h = nextH;
      top = nextTop;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (rebuild) {
        const count = reduced ? 40 : Math.round(Math.min(220, (w * Math.max(1, h - top)) / 8500));
        motes = Array.from({ length: count }, () => spawn(w, top, h));
      }
    };

    const tick = () => {
      top = headerHeight();
      ctx.clearRect(0, 0, w, h);
      for (const mote of motes) {
        mote.x += mote.vx * mote.z;
        mote.y += mote.vy * mote.z;
        mote.life += 0.016;
        if (mote.x < -16) mote.x = w + 8;
        else if (mote.x > w + 16) mote.x = -8;
        if (mote.y < top) mote.y = h - 6;
        else if (mote.y > h + 8) mote.y = top + 4;
        if (mote.life > mote.max) Object.assign(mote, spawn(w, top, h));
        if (mote.y < top) continue;
        const fade = 0.65 + 0.35 * Math.sin((mote.life / mote.max) * Math.PI);
        const depth = 0.45 + mote.z * 0.55;
        const alpha = 0.46 * fade * depth;
        const size = 0.6 + mote.z * 0.9;
        ctx.beginPath();
        ctx.fillStyle = `rgba(226,226,234,${alpha})`;
        ctx.arc(mote.x, mote.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    tick();
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />;
}
