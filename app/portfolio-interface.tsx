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
    title: "Trust, scaled.",
    intro:
      "Currently leading Misinformation policy at TikTok. Former Facebook and Advisor to Speaker Pelosi.",
    body: [
      "",
    ],
    accent: "Meet Matt",
    background: "/reference/profile-background.png",
    asideTitle: "Live profile",
    asideBody: [
      "AI governance, elections, trust and safety",
      "Internet culture, institutions, political economy"
    ]
  },
  work: {
    key: "work",
    navLabel: "Work",
    stateLabel: "work.module",
    title: "Work",
    intro:
      "A few things I have worked on.",
    body: [
      "Wrote the first blockchain and crypto memo for Speaker Pelosi and House leadership.",
      "Worked on the front lines of Facebook content policy from the post-Trump period through the Ukraine war.",
      "At TikTok, worked on the 2024/26 U.S. election, the Canadian election, misinformation, and the launch of major global initiatives."
    ],
    accent: "Selected work",
    background: "/reference/home-background.png",
    asideTitle: "Highlighted project",
    asideBody: [
      "GovSearch is a retrieval-based AI tool for congressional legislation.",
      "BlueDot AI governance project received runner-up recognition.",
      "Sourced and presented a direct pitch to Andreessen Horowitz."
    ],
    viewportCards: [
      {
        title: "How I built this website",
        excerpt:
          "Built quickly with AI-assisted iteration, then refined by hand when layout and design choices started to drift.",
        body:
          "I built this site quickly using Codex to write and adjust the code as I went. It runs on Next.js and React for the structure, Tailwind for styling, and Framer Motion for animations. For the design, I referenced another interface-style site and used it as a guide, then worked with AI to translate that look here. I also added a small interactive entry. Instead of a normal landing page, the site starts with a turing test-like question and a few choices. It is fast and flexible to build this way, but it lacks design talent and still needs human judgment to keep things consistent and working properly.",
        label: "In-site project"
      },
      {
        title: "GovSearch",
        excerpt:
          "Awarded runner-up recognition at BlueDot AI governance project.",
        body:
          "Built and deployed a RAG system over U.S. congressional records to make legislative search usable. Worked across embeddings, retrieval, and system design. Focused on how it performed under real queries, not ideal conditions. The project sharpened how I think about model limits and how policy needs to reflect them.",
        label: "Project bubble",
        href: "https://gov-search.vercel.app/about",
        ctaLabel: "View GovSearch"
      }
    ]
  },
  writing: {
    key: "writing",
    navLabel: "Substack",
    stateLabel: "substack.feed",
    title: "Substack",
    intro:
      "Get my newsletter delivered to your inbox.",
    body: [],
    accent: "Newsletter module",
    background: "/reference/profile-background.png",
    asideTitle: "",
    asideBody: [],
    viewportCards: [
      {
        title: "Substack",
        excerpt:
          "A newsletter tile inside the interface. Weird, plainspoken, and sent straight to your inbox.",
        body:
          "Substack module for notes, signals, and whatever survives contact with the feed.",
        label: "Publication"
      }
    ]
  },
  contact: {
    key: "contact",
    navLabel: "Contact",
    stateLabel: "contact.link",
    title: "Feel free to connect.",
    intro: "",
    body: [],
    accent: "Contact",
    background: "/reference/contact-background.png",
    asideTitle: "Links",
    asideBody: ["matt.m.ram@gmail.com", "linkedin.com/in/mattramirez"],
    actions: [
      { label: "Email", href: "mailto:matt.m.ram@gmail.com" },
      { label: "LinkedIn", href: "https://linkedin.com/in/mattramirez" }
    ]
  }
};

const footerLinks = [
  { label: "Email", href: "mailto:matt.m.ram@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mattramirez" }
];

function ExternalOrInternalAction({
  item,
  onAction
}: {
  item: { label: string; href?: string; action?: ModuleKey };
  onAction: (module: ModuleKey) => void;
}) {
  const className =
    "inline-flex border-2 border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--panel-deep)]";

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
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: "url('/reference/background.gif')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(73,46,22,0.06),transparent_18%,rgba(73,46,22,0.05)_100%)]" />

      <div className="relative flex w-full flex-col gap-3">
        <div className="glass-panel panel-edge overflow-hidden">
          <div
            className="relative border-b-2 border-[var(--line)] px-5 py-4 sm:px-7"
            style={{ backgroundColor: "rgba(226, 208, 171, 0.88)" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  Matt Ramirez / Interface
                </p>
                <p className="mt-2 text-xl tracking-[-0.04em] text-[var(--ink)] sm:text-2xl">
                  Policy, platforms, AI governance.
                </p>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                module engaged
              </div>
            </div>
          </div>

          <div
            className="relative flex flex-wrap items-center gap-2 border-b-2 border-[var(--line)] px-4 py-3 sm:px-6"
            style={{ backgroundColor: "rgba(212, 191, 150, 0.94)" }}
          >
            {(["profile", "work", "writing", "contact"] as ModuleKey[]).map((key) => {
              const item = modules[key];
              const selected = activeModule === key;

              return (
                <button
                  key={key}
                  onClick={() => activateModule(key)}
                  className={`border-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    selected
                      ? "border-[var(--line)] bg-[var(--accent)] text-[#f1dfbf]"
                      : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--panel-deep)]"
                  }`}
                >
                  {item.navLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel panel-edge relative flex min-h-[560px] flex-col lg:min-h-[640px]">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply"
            style={{ backgroundImage: `url('${currentModule.background}')` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(235,223,194,0.42),rgba(196,171,124,0.2))]" />

          <AnimatePresence>
            {isEngaging ? (
              <motion.div
                key={`engaging-${activeModule}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "linear" }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(215,195,154,0.92)]"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-2.5 w-2.5 bg-[var(--accent-deep)]" />
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]">
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
                transition={{ duration: 0.12, ease: "linear" }}
                className="min-w-0"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {currentModule.accent}
                </p>
                <h1 className={`mt-4 font-medium tracking-[-0.04em] text-[var(--ink)] sm:text-5xl ${
                  currentModule.key === "writing"
                    ? "text-4xl lg:text-[3.7rem] xl:text-[4.2rem]"
                    : "text-4xl lg:max-w-[16ch] lg:text-[4.35rem] xl:text-[4.9rem]"
                }`}>
                  {currentModule.title}
                </h1>
                {currentModule.intro ? (
                  <p className={`mt-5 text-base leading-7 text-[var(--ink-soft)] sm:text-lg xl:text-[1.15rem] ${
                    currentModule.key === "writing" ? "max-w-[38ch]" : "max-w-[70ch]"
                  }`}>
                    {currentModule.intro}
                  </p>
                ) : null}
                {currentModule.key === "writing" ? (
                  <div className="mt-8 max-w-[620px]">
                    <article className="glass-panel border-2 border-[var(--line)] bg-[rgba(225,205,168,0.96)] px-6 py-7 sm:px-8">
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <svg
                            viewBox="0 0 120 140"
                            aria-hidden="true"
                            className="h-20 w-20 text-[var(--ink)]"
                          >
                            <g
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M60 10 C31 10 18 34 18 61 C18 81 24 98 33 112 C37 118 43 123 48 125 C53 127 56 132 58 137 C59 139 61 139 62 137 C64 132 67 127 72 125 C77 123 83 118 87 112 C96 98 102 81 102 61 C102 34 89 10 60 10 Z" />
                              <path d="M60 10 L60 137" />
                              <path d="M48 11 C44 26 42 44 42 61 C42 92 49 117 60 137" />
                              <path d="M72 11 C76 26 78 44 78 61 C78 92 71 117 60 137" />
                              <path d="M35 18 C28 31 24 45 24 61 C24 81 29 98 36 111" />
                              <path d="M85 18 C92 31 96 45 96 61 C96 81 91 98 84 111" />
                              <path d="M27 28 C36 22 47 19 60 19 C73 19 84 22 93 28" />
                              <path d="M20 41 C31 33 45 29 60 29 C75 29 89 33 100 41" />
                              <path d="M18 54 C30 46 44 42 60 42 C76 42 90 46 102 54" />
                              <path d="M18 67 C30 61 44 58 60 58 C76 58 90 61 102 67" />
                              <path d="M21 79 C31 75 44 73 60 73 C76 73 89 75 99 79" />
                              <path d="M25 90 C34 88 46 87 60 87 C74 87 86 88 95 90" />
                              <path d="M29 100 C38 99 48 99 60 99 C72 99 82 99 91 100" />
                              <path d="M31 108 C39 108 49 109 60 109 C71 109 81 108 89 108" />
                              <path d="M18 61 C20 66 22 75 24 84 C25 89 27 92 30 90 C33 88 35 89 36 94 C38 101 42 103 47 99 C51 96 55 96 57 104 C58 111 60 121 60 137" />
                              <path d="M102 61 C100 66 98 75 96 84 C95 89 93 92 90 90 C87 88 85 89 84 94 C82 101 78 103 73 99 C69 96 65 96 63 104 C62 111 60 121 60 137" />
                              <path d="M33 112 C37 111 41 110 46 111 C50 112 54 117 57 125" />
                              <path d="M87 112 C83 111 79 110 74 111 C70 112 66 117 63 125" />
                              <path d="M42 61 C46 60 50 59 60 59 C70 59 74 60 78 61" />
                              <path d="M41 74 C46 72 51 71 60 71 C69 71 74 72 79 74" />
                              <path d="M42 87 C47 85 52 84 60 84 C68 84 73 85 78 87" />
                            </g>
                          </svg>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                              Publication
                            </p>
                            <h2 className="mt-2 text-2xl tracking-[-0.04em] text-[var(--ink)]">
                              Substack
                            </h2>
                          </div>
                        </div>
                        <a
                          className="inline-flex border-2 border-[var(--line)] bg-[var(--accent)] px-5 py-3 text-sm text-[#f1dfbf] transition-colors hover:bg-[var(--accent-deep)]"
                          href="https://slopworld1.substack.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Subscribe free
                        </a>
                      </div>
                    </article>
                  </div>
                ) : (
                  <>
                    <div className="mt-6 grid gap-4">
                      {currentModule.body.map((paragraph) => (
                        <p key={paragraph} className="max-w-[76ch] text-base leading-7 text-[var(--ink-soft)] xl:text-[1.05rem]">
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
                  </>
                )}
                {currentModule.viewportCards?.length && currentModule.key !== "writing" ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {currentModule.viewportCards.map((card) => (
                      <article
                        key={card.title}
                        className="glass-panel border-2 border-[var(--line)] bg-[rgba(225,205,168,0.94)] p-5"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                          {card.label ?? "Native project"}
                        </p>
                        <h3 className="mt-3 text-xl tracking-[-0.04em] text-[var(--ink)]">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                          {card.excerpt}
                        </p>
                        {card.body ? (
                          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">{card.body}</p>
                        ) : null}
                        {card.href ? (
                          <div className="mt-5">
                            <a
                              className="inline-flex border-2 border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--panel-deep)]"
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
                  transition={{ duration: 0.12, ease: "linear", delay: 0.03 }}
                  className="glass-panel p-4 lg:min-h-[360px]"
                >
                  <div>
                    <div className="overflow-hidden border-2 border-[var(--line)]">
                      <Image
                        src="/matt-ramirez-headshot.jpg"
                        alt="Matt Ramirez"
                        width={760}
                        height={760}
                        priority
                        className="h-full max-h-[420px] w-full object-cover lg:max-h-[380px]"
                      />
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 border-2 border-[var(--line)] bg-[var(--panel)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink)]">
                      <span className="h-2.5 w-2.5 bg-[var(--accent-deep)]" />
                      online now!
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                      {currentModule.asideTitle}
                    </p>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--ink-soft)]">
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
          className="glass-panel panel-edge flex flex-col gap-3 overflow-hidden px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ backgroundColor: "rgba(212, 191, 150, 0.94)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            Matt Ramirez / framed portfolio system
          </p>
          <div className="flex flex-wrap gap-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink)]"
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
