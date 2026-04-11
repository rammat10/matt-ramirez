"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

type Phase = "preload" | "frame" | "content" | "ready";

const StageContext = createContext<Phase>("preload");

export function useStagePhase() {
  return useContext(StageContext);
}

export function FrameReveal({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const phase = useStagePhase();
  const active = phase === "frame" || phase === "content" || phase === "ready";

  return (
    <motion.div
      initial={false}
      animate={
        active
          ? { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)" }
          : { opacity: 0, x: -18, clipPath: "inset(0% 100% 0% 0%)" }
      }
      transition={{ duration: 0.45, ease: "linear", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ContentReveal({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const phase = useStagePhase();
  const active = phase === "content" || phase === "ready";

  return (
    <motion.div
      initial={false}
      animate={active ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -16, y: 8 }}
      transition={{ duration: 0.4, ease: "linear", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CursorTrail() {
  const dotsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let animationFrame = 0;
    const count = 6;
    const positions = Array.from({ length: count }, () => ({ x: -100, y: -100 }));
    const target = { x: -100, y: -100 };

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const render = () => {
      positions[0].x += (target.x - positions[0].x) * 0.26;
      positions[0].y += (target.y - positions[0].y) * 0.26;

      for (let index = 1; index < count; index += 1) {
        positions[index].x += (positions[index - 1].x - positions[index].x) * 0.26;
        positions[index].y += (positions[index - 1].y - positions[index].y) * 0.26;
      }

      positions.forEach((position, index) => {
        const element = dotsRef.current[index];
        if (!element) return;

        const size = 14 - index * 1.6;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.opacity = `${0.32 - index * 0.04}`;
        element.style.transform = `translate(${position.x - size / 2}px, ${position.y - size / 2}px)`;
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          ref={(element) => {
            dotsRef.current[index] = element;
          }}
          className="cursor-trail"
        />
      ))}
    </>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("preload");

  useEffect(() => {
    setProgress(0);
    setPhase("preload");

    const startedAt = Date.now();
    const duration = 1500;
    let frameTimeout: number | undefined;
    let readyTimeout: number | undefined;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);

      if (next >= 100) {
        window.clearInterval(interval);
        setPhase("frame");
        frameTimeout = window.setTimeout(() => setPhase("content"), 260);
        readyTimeout = window.setTimeout(() => setPhase("ready"), 1400);
      }
    }, 16);

    return () => {
      window.clearInterval(interval);
      if (frameTimeout) window.clearTimeout(frameTimeout);
      if (readyTimeout) window.clearTimeout(readyTimeout);
    };
  }, [pathname]);

  const shell = useMemo(() => ({ opacity: 1 }), []);

  return (
    <StageContext.Provider value={phase}>
      <div className="relative min-h-screen overflow-hidden bg-[#09111d] text-slate-100">
        <CursorTrail />
        <AnimatePresence>
          {phase === "preload" ? (
            <motion.div
              key="preloader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: "linear" } }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#090812]"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-14 mix-blend-screen"
                style={{ backgroundImage: "url('/reference/background.gif')" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(178,95,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(83,196,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(231,80,176,0.18),transparent_24%),radial-gradient(circle_at_70%_18%,rgba(84,229,255,0.14),transparent_28%)]" />
              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.28em] text-fuchsia-100/45 sm:left-8 sm:top-7">
                Matt Ramirez / Wake Sequence
              </div>
              <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200/45 sm:right-8 sm:top-7">
                System Coming Online
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="cat-loader">
                  <div className="cat-loader-silhouette">
                    <div className="cat-tail" />
                    <div className="cat-body">
                      <div className="cat-spine" />
                      <div className="cat-leg-back" />
                      <div className="cat-leg-front" />
                    </div>
                    <div className="cat-head">
                      <div className="cat-visor" />
                    </div>
                    <div className="cat-ground" />
                  </div>
                </div>
                <div className="mt-4 font-mono text-5xl tracking-[-0.08em] text-slate-100 sm:text-6xl">
                  {progress}%
                </div>
                <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.32em] text-fuchsia-100/60">
                  cat.online.stretch
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.26em] text-cyan-200/48">
                  waking modules and viewport
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={shell}
          transition={{ duration: 0.32, ease: "linear" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </div>
    </StageContext.Provider>
  );
}
