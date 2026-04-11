"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ModuleKey = "profile" | "work" | "writing" | "contact";

type ModuleConfig = {
  key: ModuleKey;
  navLabel: string;
  stateLabel: string;
  title: string;
  intro: string;
  body: string[];
  accent: string;
  background: string;
  asideTitle: string;
  asideBody: string[];
  viewportCards?: {
    title: string;
    excerpt: string;
    body?: string;
    label?: string;
    href?: string;
    ctaLabel?: string;
  }[];
  actions?: { label: string; href?: string; action?: ModuleKey }[];
};

const modules: Record<ModuleKey, ModuleConfig> = {
  profile: {
    key: "profile",
    navLabel: "Profile",
    stateLabel: "profile.active",
    title: "Washington literacy for the internet. Internet literacy for power.",
    intro:
      "Matt Ramirez works where platforms, institutions, and public consequence start pressing on each other.",
    body: [
      "His background spans congressional leadership, front-line platform policy, elections, misinformation, and AI systems.",
      "The through line is power, timing, and how technical systems shape governance in practice."
    ],
    accent: "Policy systems",
    background: "/reference/profile-background.png",
    asideTitle: "Live profile",
    asideBody: [
      "AI governance, elections, trust and safety",
      "Washington fluency with product instincts",
      "Internet culture, institutions, political economy"
    ],
    actions: [
      { label: "Open work", action: "work" },
      { label: "Open writing", action: "writing" }
    ]
  },
  work: {
    key: "work",
    navLabel: "Work",
    stateLabel: "work.module",
    title: "Work with real political and product consequences.",
    intro:
      "This module holds the short list that best explains the shape of the work.",
    body: [
      "Wrote the first blockchain and crypto memo for Speaker Pelosi and congressional leadership.",
      "Worked on the front lines of Facebook content policy from the post-Trump period through the Ukraine war.",
      "At TikTok, worked on the 2024 U.S. election, the Canadian election, misinformation, and the launch of AIGC tools globally."
    ],
    accent: "Selected work",
    background: "/reference/home-background.png",
    asideTitle: "Highlighted project",
    asideBody: [
      "GovSearch is a retrieval-based AI tool for congressional legislation.",
      "BlueDot AI governance project received runner-up recognition.",
      "GovGPT secured a direct Andreessen Horowitz pitch."
    ],
    viewportCards: [
      {
        title: "How I built this website",
        excerpt:
          "AI-assisted frontend work moved quickly and produced a working modular interface system.",
        body:
          "This site was built through a fast, iterative vibecoding process using AI-assisted development. The goal was to recreate a modular, interactive interface inspired by early web design systems, but applied to policy work and institutional analysis. The system itself worked well: module-based navigation, staged transitions, and a persistent interface layer that frames all content. Where it broke down was in layout constraints. Overuse of viewport-based sizing and rigid containers caused the design to compress in production environments. The visual language also drifted at times as the model introduced its own framing concepts. The result reflects both the speed and the limits of AI-assisted frontend development.",
        label: "In-site project"
      },
      {
        title: "GovSearch",
        excerpt:
          "Use this card for your GovSearch write-up, including what the tool does, why you built it, and what made it notable.",
        body:
          "Placeholder copy: GovSearch is a retrieval-based AI tool for congressional legislation. Add your own framing here about the problem, the interface, the technical approach, the BlueDot runner-up recognition, and what the project revealed about the limits of AI systems in practice.",
        label: "Project bubble",
        href: "https://gov-search.vercel.app/about",
        ctaLabel: "View GovSearch"
      },
      {
        title: "Future work 02",
        excerpt:
          "Placeholder for a second native project bubble that can hold writing, research, or a selected build.",
        body:
          "This is meant to be easy to edit later without redesigning the layout.",
        label: "Placeholder"
      },
      {
        title: "Future work 03",
        excerpt:
          "Placeholder for another project bubble you can turn into a live case study or note.",
        body:
          "Replace this text directly in the content array when you are ready.",
        label: "Placeholder"
      }
    ]
  },
  writing: {
    key: "writing",
    navLabel: "Writing",
    stateLabel: "writing.archive",
    title: "A dedicated writing channel, not a buried section.",
    intro:
      "This viewport is reserved for metaverse writing, essays, notes, and any public-facing work that should be surfaced with context.",
    body: [
      "Use this module for Facebook-era metaverse writing, platform policy essays, and shorter notes.",
      "The architecture is ready for titles, publication dates, excerpts, and outbound links without turning the page into a scroll dump."
    ],
    accent: "Writing archive",
    background: "/reference/profile-background.png",
    asideTitle: "Archive notes",
    asideBody: [
      "Built to hold featured essays and shorter signals.",
      "Designed to stay inside the interface rather than break out into a generic blog layout."
    ],
    viewportCards: [
      {
        title: "Metaverse writing",
        excerpt:
          "Reserved for Facebook-era writing on the metaverse, governance, and how virtual systems became public policy objects.",
        body:
          "Use this slot for longer writing with publication details, date, and a short framing note."
      },
      {
        title: "Policy essay",
        excerpt:
          "Reserved for a sharper essay on institutions, platforms, and the edge where product choices turn political.",
        body:
          "This can hold a summary, opening excerpt, or a placeholder paragraph until the final text is ready."
      },
      {
        title: "Project note",
        excerpt:
          "Reserved for shorter notes tied to specific projects, launches, or research threads.",
        body:
          "Good place for small observations, build notes, or analysis that should not disappear into a long archive."
      },
      {
        title: "Writing 04",
        excerpt:
          "Reserved for future essays, commentary, or public notes that belong in the interface as first-class content.",
        body:
          "Easy to replace later by pasting in a new title, excerpt, and body text here."
      }
    ]
  },
  contact: {
    key: "contact",
    navLabel: "Contact",
    stateLabel: "contact.link",
    title: "Direct lines only.",
    intro:
      "The contact module stays minimal on purpose. Email and LinkedIn are the two cleanest ways in.",
    body: [
      "For writing, research, platform policy, or collaboration, send a note directly.",
      "This site is meant to be selective, so the contact layer is selective too."
    ],
    accent: "Contact channel",
    background: "/reference/contact-background.png",
    asideTitle: "Links",
    asideBody: ["matt.m.ram@gmail.com", "linkedin.com/in/mattramirez"],
    actions: [
      { label: "Email Matt", href: "mailto:matt.m.ram@gmail.com" },
      { label: "LinkedIn", href: "https://linkedin.com/in/mattramirez" }
    ]
  }
};

const footerLinks = [
  { label: "Email", href: "mailto:matt.m.ram@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mattramirez" },
  { label: "GovSearch", href: "https://gov-search.vercel.app/about" }
];

function ExternalOrInternalAction({
  item,
  onAction
}: {
  item: { label: string; href?: string; action?: ModuleKey };
  onAction: (module: ModuleKey) => void;
}) {
  const className =
    "inline-flex rounded-full border border-fuchsia-300/16 bg-white/[0.06] px-4 py-2.5 text-sm text-slate-100 transition-colors hover:border-cyan-300/24 hover:bg-white/10";

  if (item.action) {
    return (
      <button className={className} onClick={() => onAction(item.action!)}>
        {item.label}
      </button>
    );
  }

  if (item.href?.startsWith("/")) {
    return (
      <Link className={className} href={item.href}>
        {item.label}
      </Link>
    );
  }

  return (
    <a className={className} href={item.href} target="_blank" rel="noreferrer">
      {item.label}
    </a>
  );
}

export default function PortfolioInterface({
  initialModule = "profile"
}: {
  initialModule?: ModuleKey;
}) {
  const [activeModule, setActiveModule] = useState<ModuleKey>(initialModule);
  const [displayModule, setDisplayModule] = useState<ModuleKey>(initialModule);
  const [isEngaging, setIsEngaging] = useState(false);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    setActiveModule(initialModule);
    setDisplayModule(initialModule);
    setIsEngaging(false);
  }, [initialModule]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  const activateModule = (module: ModuleKey) => {
    if (module === activeModule) return;

    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    timeouts.current = [];

    setIsEngaging(true);
    setActiveModule(module);

    timeouts.current.push(
      window.setTimeout(() => setDisplayModule(module), 140),
      window.setTimeout(() => setIsEngaging(false), 380)
    );
  };

  const currentModule = useMemo(() => modules[displayModule], [displayModule]);
  const showAside = currentModule.key === "profile";

  return (
    <main className="interface-grid relative min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.1] mix-blend-screen"
        style={{ backgroundImage: "url('/reference/background.gif')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,73,172,0.2),transparent_24%),radial-gradient(circle_at_80%_16%,rgba(82,212,255,0.14),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(108,74,255,0.12),transparent_24%)]" />

      <div className="relative flex w-full flex-col gap-3">
        <div className="glass-panel panel-edge rounded-[28px] overflow-hidden">
          <div
            className="relative border-b border-slate-300/10 px-5 py-4 sm:px-7"
            style={{ backgroundImage: "url('/reference/ui-top-header.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-300/58">
                  Matt Ramirez / Interface
                </p>
                <p className="mt-2 text-xl tracking-[-0.05em] text-slate-50 sm:text-2xl">
                  Policy systems, platforms, elections, AI governance.
                </p>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-fuchsia-200/60">
                module engaged
              </div>
            </div>
          </div>

          <div
            className="relative flex flex-wrap items-center gap-2 border-b border-slate-300/10 px-4 py-3 sm:px-6"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(10,17,28,0.82), rgba(10,17,28,0.72)), url('/reference/ui-navbar-background.png')",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center"
            }}
          >
            {(["profile", "work", "writing", "contact"] as ModuleKey[]).map((key) => {
              const item = modules[key];
              const selected = activeModule === key;

              return (
                <button
                  key={key}
                  onClick={() => activateModule(key)}
                  className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors ${
                    selected
                      ? "border-fuchsia-300/30 bg-fuchsia-400/12 text-slate-50 shadow-[0_0_20px_rgba(232,73,172,0.12)]"
                      : "border-slate-200/10 bg-white/[0.03] text-slate-300/75 hover:border-cyan-300/20 hover:bg-white/[0.08]"
                  }`}
                >
                  {item.navLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel panel-edge relative flex min-h-[560px] flex-col rounded-[32px] lg:min-h-[640px]">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.22] mix-blend-screen"
            style={{ backgroundImage: `url('${currentModule.background}')` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,28,0.68),rgba(7,10,25,0.92))]" />

          <AnimatePresence>
            {isEngaging ? (
              <motion.div
                key={`engaging-${activeModule}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "linear" }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-[#090812]/88"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(94,220,255,0.45)]" />
                  <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-fuchsia-100/70">
                    engaging.{activeModule}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div
            className={`relative z-10 grid gap-6 px-5 py-5 sm:px-7 sm:py-7 ${
              showAside
                ? "lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,0.85fr)] xl:grid-cols-[minmax(0,2.35fr)_minmax(300px,0.8fr)]"
                : ""
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentModule.key}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.24, ease: "linear" }}
                className="min-w-0"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
                  {currentModule.accent}
                </p>
                <h1 className="mt-4 text-4xl font-medium tracking-[-0.08em] text-slate-50 sm:text-5xl lg:max-w-[16ch] lg:text-[4.35rem] xl:text-[4.9rem]">
                  {currentModule.title}
                </h1>
                <p className="mt-5 max-w-[70ch] text-base leading-7 text-slate-300/82 sm:text-lg xl:text-[1.15rem]">
                  {currentModule.intro}
                </p>
                <div className="mt-6 grid gap-4">
                  {currentModule.body.map((paragraph) => (
                    <p key={paragraph} className="max-w-[76ch] text-base leading-7 text-slate-300/78 xl:text-[1.05rem]">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {currentModule.actions?.length ? (
                  <div className="mt-7 flex flex-wrap gap-3">
                    {currentModule.actions.map((item) => (
                      <ExternalOrInternalAction
                        key={item.label}
                        item={item}
                        onAction={activateModule}
                      />
                    ))}
                  </div>
                ) : null}

                {currentModule.viewportCards?.length ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {currentModule.viewportCards.map((card) => (
                      <article
                        key={card.title}
                        className="glass-panel rounded-[28px] border border-fuchsia-300/14 bg-[linear-gradient(180deg,rgba(31,16,56,0.5),rgba(11,15,33,0.72))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_30px_rgba(149,76,255,0.06)]"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-fuchsia-200/68">
                          {card.label ?? "Native project"}
                        </p>
                        <h3 className="mt-3 text-xl tracking-[-0.05em] text-slate-50">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300/80">
                          {card.excerpt}
                        </p>
                        {card.body ? (
                          <p className="mt-4 text-sm leading-6 text-slate-300/68">{card.body}</p>
                        ) : null}
                        {card.href ? (
                          <div className="mt-5">
                            <a
                              className="inline-flex rounded-full border border-fuchsia-300/16 bg-white/[0.06] px-4 py-2.5 text-sm text-slate-100 transition-colors hover:border-cyan-300/24 hover:bg-white/10"
                              href={card.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {card.ctaLabel ?? "Open link"}
                            </a>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {showAside ? (
              <AnimatePresence mode="wait">
                <motion.aside
                  key={`${currentModule.key}-aside`}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.24, ease: "linear", delay: 0.05 }}
                  className="glass-panel rounded-[28px] p-4 lg:min-h-[360px]"
                >
                  <div>
                    <div className="overflow-hidden rounded-[22px] border border-slate-200/10">
                      <Image
                        src="/matt-ramirez-headshot.jpg"
                        alt="Matt Ramirez"
                        width={760}
                        height={760}
                        priority
                        className="h-full max-h-[420px] w-full object-cover lg:max-h-[380px]"
                      />
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/18 bg-fuchsia-400/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-fuchsia-100/82 shadow-[0_0_20px_rgba(232,73,172,0.1)]">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(94,220,255,0.55)]" />
                      online now!
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-fuchsia-200/68">
                      {currentModule.asideTitle}
                    </p>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300/80">
                      {currentModule.asideBody.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              </AnimatePresence>
            ) : null}
          </div>
        </div>

        <div
          className="glass-panel panel-edge flex flex-col gap-3 overflow-hidden rounded-[18px] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(10,17,28,0.86), rgba(10,17,28,0.76)), url('/reference/ui-navbar-background.png')",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center"
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-300/56">
            Matt Ramirez / framed portfolio system
          </p>
          <div className="flex flex-wrap gap-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-200/74"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
