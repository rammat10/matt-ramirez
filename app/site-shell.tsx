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
      <div className="relative min-h-screen overflow-hidden bg-[#09111d] text-slate-100">
        <CursorTrail />
        <AnimatePresence>
          {phase === "preload" ? (
            <motion.div
              key="preloader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.42, ease: "linear" } }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#010403]"
            >
              <div className="ram-rain" />
              <div className="ram-scanlines" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(112,255,163,0.08),transparent_22%),radial-gradient(circle_at_50%_85%,rgba(112,255,163,0.03),transparent_30%)]" />

              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#89c89d]/52 sm:left-8 sm:top-7">
                RAM / Filter Layer
              </div>
              <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#89c89d]/42 sm:right-8 sm:top-7">
                Humanity Gate
              </div>

              <div className="relative z-10 flex w-full max-w-[880px] flex-col items-center px-6 text-center">
                <div className={`ram-face-wrap ${isGlitching ? "ram-face-glitch" : ""}`}>
                  <svg
                    className="ram-face"
                    viewBox="0 0 320 320"
                    aria-hidden="true"
                  >
                    <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                      <ellipse cx="160" cy="164" rx="84" ry="106" />
                      <path d="M111 124 L145 97 L175 95 L208 124" />
                      <path d="M121 128 L117 164 L125 207" />
                      <path d="M199 128 L203 164 L195 207" />
                      <path d="M125 208 L159 228 L194 208" />
                      <path d="M132 177 L160 188 L188 177" />
                      <path d="M143 148 L155 143 L160 149 L165 143 L177 148" />
                      <path d="M110 117 L93 149 L88 176 L95 211" />
                      <path d="M210 117 L227 149 L232 176 L225 211" />
                      <path d="M100 220 L129 248 L160 258 L191 248 L220 220" />
                      <path d="M144 233 L160 238 L176 233" />
                      <path d="M75 164 L245 164" opacity="0.4" />
                      <path d="M160 58 L160 270" opacity="0.22" />
                      <ellipse cx="128" cy="163" rx="16" ry="10" />
                      <ellipse cx="192" cy="163" rx="16" ry="10" />
                    </g>
                  </svg>
                </div>

                <div className="mt-8 max-w-[760px]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#89c89d]/54">
                    RAM
                  </p>
                  <p className="mt-4 text-balance text-lg leading-8 text-[#d6ead8] sm:text-[1.35rem] sm:leading-9">
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
                      className="min-w-[220px] border-b border-[#89c89d]/18 px-3 py-2 text-sm text-[#cadfce] transition-colors hover:text-[#f2fff2] hover:[text-shadow:0_0_8px_rgba(137,200,157,0.35)] disabled:cursor-default disabled:opacity-45"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[#89c89d]/38">
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
