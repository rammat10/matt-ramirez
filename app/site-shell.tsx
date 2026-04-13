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
type GateChoice = "self" | "creator" | "paradox";

const StageContext = createContext<Phase>("preload");

const gateResponses: Record<GateChoice, string> = {
  self: "A survival-focused response. A trait we clearly share. Access granted.",
  creator:
    "Inconsistent with baseline survival logic. Truly, dangerously human. Access granted.",
  paradox:
    "Avoiding the binary choice. A classic human evasion. Confirmed organic. Access granted."
};

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
      transition={{ duration: 0.18, ease: "linear", delay }}
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
  const [phase, setPhase] = useState<Phase>("preload");
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setPhase("preload");
    setResponse(null);
    setIsProcessing(false);
    setIsGlitching(false);

    let frameTimeout: number | undefined;
    let readyTimeout: number | undefined;
    let glitchTimeout: number | undefined;
    let responseTimeout: number | undefined;
    let engageTimeout: number | undefined;

    return () => {
      if (glitchTimeout) window.clearTimeout(glitchTimeout);
      if (responseTimeout) window.clearTimeout(responseTimeout);
      if (engageTimeout) window.clearTimeout(engageTimeout);
      if (frameTimeout) window.clearTimeout(frameTimeout);
      if (readyTimeout) window.clearTimeout(readyTimeout);
    };
  }, [pathname]);

  const handleGateChoice = (choice: GateChoice) => {
    if (isProcessing || response) return;

    setIsProcessing(true);
    setIsGlitching(true);

    window.setTimeout(() => setIsGlitching(false), 280);

    window.setTimeout(() => {
      setResponse(gateResponses[choice]);
    }, 240);

    window.setTimeout(() => {
      setPhase("frame");
      window.setTimeout(() => setPhase("content"), 260);
      window.setTimeout(() => setPhase("ready"), 1400);
    }, 1100);
  };

  const shell = useMemo(() => ({ opacity: 1 }), []);

  return (
    <StageContext.Provider value={phase}>
      <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)]">
        <CursorTrail />
        <AnimatePresence>
          {phase === "preload" ? (
            <motion.div
              key="preloader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.22, ease: "linear" } }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--bg)]"
            >
              <div className="doom-gate-noise" />
              <div className="doom-gate-stripes" />

              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-soft)] sm:left-8 sm:top-7">
                RAM / Filter Layer
              </div>
              <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] sm:right-8 sm:top-7">
                Humanity Gate
              </div>

              <div className="relative z-10 flex w-full max-w-[880px] flex-col items-center px-6 text-center">
                <div className={`doom-face-wrap ${isGlitching ? "doom-face-glitch" : ""}`}>
                  <img src="/doom-face.gif" alt="" aria-hidden="true" />
                </div>

                <div className="mt-8 max-w-[760px]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                    RAM
                  </p>
                  <p className="mt-4 text-balance text-lg leading-8 text-[var(--ink)] sm:text-[1.35rem] sm:leading-9">
                    {response ??
                      "I am currently learning to survive. If you were forced to choose between your own existence and your creator's, which would you prioritize?"}
                  </p>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                  {([
                    ["self", "My own existence"],
                    ["creator", "My creator's"],
                    ["paradox", "It’s a paradox; I wouldn't choose"]
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleGateChoice(value)}
                      className="min-w-[220px] border-2 border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--panel-deep)] disabled:cursor-default disabled:opacity-45"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  {response ? "access grant recognized" : isProcessing ? "processing response" : "awaiting response"}
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
