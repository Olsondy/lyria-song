"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  LogOut,
  Moon,
  Music2,
  Sparkles,
  User,
  Users,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/client";

const PHRASES = [
  "A soulful ballad about a rainy night in Tokyo...",
  "High-energy rock anthem about reaching for the stars...",
  "Lo-fi beats for a nostalgic Sunday morning...",
  "Cyberpunk synthwave for a futuristic city chase...",
  "Upbeat indie pop for a summer road trip...",
  "A melancholic piano piece for a lost love...",
  "Heavy metal track about ancient mythology...",
];

type SparkleConfig = {
  id: string;
  size: number;
  delay: number;
  dur: number;
  color: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

// Precomputed h1 letter animation data (avoids noArrayIndexKey)
const H1_LYRIA_CHARS = Array.from("Lyria fidelity").map((char, i) => ({
  char,
  id: `lyria-char-${i}`,
  delay: 0.5 + i * 0.07,
}));

const MODEL_CONFIGS = [
  {
    id: "v3.0",
    description: "Advanced high-fidelity structure engine placeholder",
  },
  {
    id: "v2.0",
    description: "Standard balanced performance engine placeholder",
  },
  { id: "v1.0", description: "Legacy basic generation engine placeholder" },
];

const SUGGESTIONS = [
  "Cyberpunk",
  "Jazz Night",
  "Deep House",
  "Orchestral",
  "80s Pop",
  "Chill Hop",
];

const pillars = [
  {
    title: "AI Creation Lab",
    detail:
      "High-fidelity song generation with Lyria 3 engine. Multi-track export and prompt refinement.",
    href: "/create",
    icon: Sparkles,
  },
  {
    title: "Resources & Guides",
    detail:
      "Master the art of AI prompting. Explore our knowledge base and technical benchmarks.",
    href: "/resources",
    icon: Music2,
  },
  {
    title: "Pro Subscription",
    detail:
      "Unlock commercial rights, faster generation, and advanced fidelity modes for your workspace.",
    href: "/pricing",
    icon: Users,
  },
];

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [modelVersion, setModelVersion] = useState("v3.0");
  const [isFidelityMode, setIsFidelityMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isSuggestionPaused, setIsSuggestionPaused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Force scroll to top on refresh
    window.scrollTo({ top: 0, behavior: "instant" });

    // Disable intro after a short delay
    const timer = setTimeout(() => setIsIntroVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isSuggestionPaused) return;

    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSuggestionPaused]);

  useEffect(() => {
    if (isFocused || inputValue) return;

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isFocused, inputValue]);

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * PHRASES.length);
    setInputValue(PHRASES[randomIndex]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      <AnimatePresence>
        {isIntroVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
              transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
            }}
            className="fixed inset-0 z-[9999] bg-white/20 backdrop-blur-3xl flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <Image
                src="/lyria-logo.svg"
                alt="Lyria Logo"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 animate-pulse"
                unoptimized
              />
              <span className="text-2xl font-black text-google-dark tracking-tighter">
                Lyria Song
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="bg-wave-container opacity-50">
        <div className="wave-line" style={{ marginLeft: "-10%" }} />
        <div className="wave-line" style={{ marginLeft: "5%" }} />
        <div className="wave-line" style={{ marginLeft: "-5%" }} />
        <div className="wave-line" style={{ marginLeft: "10%" }} />
      </div>

      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/70 backdrop-blur-md z-50 border-b border-gray-100/50 flex justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between px-6 md:px-12 h-full">
          <div className="flex items-center gap-10 md:gap-14">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/lyria-logo.svg"
                alt="Lyria Logo"
                width={40}
                height={40}
                className="w-9 h-9 md:w-10 md:h-10"
                unoptimized
              />
              <span className="text-lg md:text-xl font-bold text-google-dark tracking-tight whitespace-nowrap">
                LyriaSong
              </span>
            </div>

            {/* Center: Nav */}
            <nav className="hidden lg:flex items-center gap-10 text-[14px] font-medium text-google-gray/80">
              <Link
                href="/"
                className="hover:text-indigo-600 transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/pricing"
                className="hover:text-indigo-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className="hover:text-indigo-600 transition-colors"
              >
                Resources
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 md:gap-6">
            <button
              type="button"
              className="p-2 text-google-gray hover:text-indigo-600 transition-colors hidden sm:block"
            >
              <Moon size={19} />
            </button>
            <button
              type="button"
              className="px-2 py-1 text-[11px] font-black text-google-gray hover:text-indigo-600 transition-colors hidden sm:block tracking-widest uppercase"
            >
              EN
            </button>

            <div className="h-4 w-px bg-gray-200 hidden sm:block mx-1" />

            {isPending ? (
              <div className="w-20 h-8 md:w-24 md:h-9 bg-gray-100 animate-pulse rounded-full" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/user/my-songs"
                  className="hidden xl:block text-sm font-medium text-google-gray hover:text-indigo-600 transition-colors"
                >
                  My Songs
                </Link>
                <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-gray-200">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 overflow-hidden">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? "User"}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 text-google-gray hover:text-red-500 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-1.5 md:px-7 md:py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 overflow-hidden">
        {/* Full Viewport Center Section (Hero + Input) */}
        <section className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          {/* Hero Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-center max-w-4xl mb-12 flex flex-col items-center"
          >
            {/* Brand Name with Sparkle Effect */}
            <div className="relative inline-flex items-center mb-8 px-6 py-2">
              {/* Sparkle Stars - truly around all sides */}
              {(
                [
                  {
                    id: "star-1",
                    top: "-18px",
                    left: "15%",
                    size: 16,
                    delay: 0,
                    dur: 1.8,
                    color: "#6366f1",
                  },
                  {
                    id: "star-2",
                    top: "-12px",
                    left: "60%",
                    size: 8,
                    delay: 0.7,
                    dur: 2.1,
                    color: "#e879f9",
                  },
                  {
                    id: "star-3",
                    top: "50%",
                    left: "-18px",
                    size: 7,
                    delay: 1.2,
                    dur: 1.6,
                    color: "#f472b6",
                  },
                  {
                    id: "star-4",
                    top: "10%",
                    left: "-10px",
                    size: 11,
                    delay: 0.4,
                    dur: 2.0,
                    color: "#818cf8",
                  },
                  {
                    id: "star-5",
                    top: "20%",
                    right: "-20px",
                    size: 18,
                    delay: 0.2,
                    dur: 2.3,
                    color: "#a78bfa",
                  },
                  {
                    id: "star-6",
                    top: "65%",
                    right: "-12px",
                    size: 7,
                    delay: 0.9,
                    dur: 1.7,
                    color: "#f472b6",
                  },
                  {
                    id: "star-7",
                    bottom: "-16px",
                    left: "35%",
                    size: 12,
                    delay: 0.5,
                    dur: 2.0,
                    color: "#e879f9",
                  },
                  {
                    id: "star-8",
                    bottom: "-10px",
                    left: "5%",
                    size: 6,
                    delay: 1.3,
                    dur: 1.9,
                    color: "#6366f1",
                  },
                ] as SparkleConfig[]
              ).map((s) => (
                <motion.div
                  key={s.id}
                  style={{
                    position: "absolute",
                    top: s.top,
                    bottom: s.bottom,
                    left: s.left,
                    right: s.right,
                  }}
                  animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: s.dur,
                    delay: s.delay,
                    repeat: Infinity,
                    ease: "easeOut",
                    repeatDelay: 0.3,
                  }}
                >
                  <svg
                    width={s.size}
                    height={s.size}
                    viewBox="0 0 24 24"
                    fill={s.color}
                  >
                    {/* Concave 4-pointed star like Morisot */}
                    <path d="M12 0C12 0 12.8 9.2 24 12C24 12 14.8 14.8 12 24C12 24 11.2 14.8 0 12C0 12 9.2 11.2 12 0Z" />
                  </svg>
                </motion.div>
              ))}
              {/* Logo + Text */}
              <Image
                src="/lyria-logo.svg"
                alt="Lyria Logo"
                width={60}
                height={60}
                className="w-10 h-10 md:w-15 md:h-15 mr-1"
                unoptimized
              />
              <span className="text-4xl font-black text-neutral-800 md:text-5xl tracking-tight">
                Lyria Song
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl lg:text-7xl font-black leading-[1.15] text-google-dark mb-6 tracking-tight max-w-[20ch] md:max-w-none px-4">
              Generate 3-Minute Songs <br className="hidden md:block" />
              with{" "}
              <span className="relative inline-flex items-center py-2 px-1">
                {/* Sonic Reverb Text */}
                <span className="relative z-10 flex items-center">
                  {H1_LYRIA_CHARS.map(({ char, id, delay }) => (
                    <div
                      key={id}
                      className="relative inline-flex items-center justify-center"
                    >
                      <motion.span
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                          filter: "blur(4px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.4,
                          delay,
                          ease: [0.215, 0.61, 0.355, 1],
                        }}
                        className="relative z-10 inline-block text-indigo-600"
                        style={{ minWidth: char === " " ? "0.25em" : "auto" }}
                      >
                        {char}
                      </motion.span>

                      {/* Sonic Ripple / Reverb Effect */}
                      {char !== " " && (
                        <motion.span
                          initial={{ opacity: 0, scale: 1 }}
                          animate={{ opacity: [0, 0.5, 0], scale: [1, 2.5] }}
                          transition={{
                            duration: 0.8,
                            delay,
                            ease: "easeOut",
                          }}
                          className="absolute inset-0 z-0 text-indigo-400/30 select-none pointer-events-none"
                        >
                          {char}
                        </motion.span>
                      )}
                    </div>
                  ))}
                </span>

                {/* Trailing Equalizer */}
                <span className="inline-flex items-end gap-[1.5px] ml-4 h-[20px] md:h-[28px] mb-1 relative z-10">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        height: ["20%", "70%", "40%", "90%", "30%", "60%"],
                      }}
                      transition={{
                        opacity: { delay: 1.8 },
                        height: {
                          duration: 0.8 + i * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="w-[3px] md:w-[4px] bg-indigo-500/60 rounded-full origin-bottom"
                    />
                  ))}
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-2xl font-normal text-google-gray max-w-2xl mx-auto leading-relaxed">
              Professional verse-chorus structures. Studio-grade 48kHz output.
              All from a simple prompt.
            </p>
          </motion.div>

          {/* Ultra Minimalist Studio Bar (Gemini Style) with Floating Capsule Effect */}
          <div className="w-full max-w-4xl relative z-10 px-4 md:px-0">
            {/* Background Halo Glow */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[150%] w-[120%] -left-[10%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                borderColor: isFocused ? "#4F46E5" : "rgba(79, 70, 229, 0.15)",
                boxShadow: isFocused
                  ? "0 25px 60px -12px rgba(79, 70, 229, 0.2)"
                  : "0 10px 40px -12px rgba(0, 0, 0, 0.05)",
              }}
              transition={{
                delay: 1.0,
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                // Shadows and border color should still be fast when focusing
                borderColor: { duration: 0.3 },
                boxShadow: { duration: 0.3 },
              }}
              className={`bg-white/95 backdrop-blur-3xl rounded-[3rem] border-2 p-4 md:p-6 flex flex-col transition-all duration-500 ${isFidelityMode ? "ring-4 ring-indigo-500/5" : ""}`}
              onFocusCapture={() => setIsFocused(true)}
              onBlurCapture={() => setIsFocused(false)}
            >
              {/* Top Label */}
              <div className="mb-1">
                <span className="text-[10px] font-bold text-indigo-600/30 uppercase tracking-[0.2em] px-1">
                  Description Prompt
                </span>
              </div>

              {/* Input Area */}
              <div className="relative min-h-[56px] md:min-h-[72px] flex items-start">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-google-dark placeholder:text-transparent outline-none z-10 font-medium resize-none leading-relaxed py-0"
                  rows={2}
                />

                <AnimatePresence mode="wait">
                  {!inputValue && !isFocused && (
                    <div className="absolute top-0 left-0 pointer-events-none flex items-center">
                      <span className="relative z-10 flex items-center">
                        {Array.from(PHRASES[phraseIndex])
                          .reduce<
                            { char: string; id: string; delay: number }[]
                          >((acc, char, i) => {
                            acc.push({
                              char,
                              id: `phrase-${phraseIndex}-${i}`,
                              delay: i * 0.03,
                            });
                            return acc;
                          }, [])
                          .map(({ char, id, delay }) => (
                            <div
                              key={id}
                              className="relative inline-flex items-center justify-center"
                            >
                              <motion.span
                                initial={{
                                  opacity: 0,
                                  scale: 0.5,
                                  filter: "blur(4px)",
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                  filter: "blur(0px)",
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  duration: 0.4,
                                  delay,
                                  ease: [0.215, 0.61, 0.355, 1],
                                }}
                                className="relative z-10 inline-block text-xl md:text-2xl text-google-gray/20"
                                style={{
                                  minWidth: char === " " ? "0.25em" : "auto",
                                }}
                              >
                                {char}
                              </motion.span>
                            </div>
                          ))}
                      </span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Integrated Toolbar (No divider, pure icons) */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <Select value={modelVersion} onValueChange={setModelVersion}>
                    <SelectTrigger className="h-8 bg-gray-100/50 hover:bg-indigo-50 border-none text-[10px] font-black text-indigo-600 px-4 py-1.5 uppercase tracking-widest rounded-full transition-all focus:ring-0 focus:ring-offset-0 shadow-none ring-offset-transparent w-auto min-w-[125px]">
                      <SelectValue placeholder="Select model">
                        {modelVersion ? `Lyria - ${modelVersion}` : "Model"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      side="top"
                      align="start"
                      sideOffset={8}
                      className="bg-white/95 backdrop-blur-3xl border border-indigo-100/20 shadow-2xl rounded-2xl min-w-[260px] p-2"
                    >
                      {MODEL_CONFIGS.map((m) => (
                        <SelectItem
                          key={m.id}
                          value={m.id}
                          className="px-4 py-3 focus:bg-indigo-50/50 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex flex-col gap-0.5 items-start">
                            <span className="text-[13px] font-bold text-google-dark">
                              Lyria {m.id}
                            </span>
                            <span className="text-[11px] text-google-gray/50 font-medium leading-tight">
                              {m.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Minimalism Fidelity Switch */}
                  <button
                    className="relative flex items-center gap-2 transition-all"
                    onClick={() => setIsFidelityMode(!isFidelityMode)}
                    type="button"
                    title="High Fidelity"
                  >
                    <div
                      className={`w-8 h-4.5 rounded-full transition-colors ${isFidelityMode ? "bg-indigo-600" : "bg-gray-200"}`}
                    >
                      <motion.div
                        animate={{ x: isFidelityMode ? 14 : 2 }}
                        className="mt-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-black tracking-widest transition-colors ${isFidelityMode ? "text-indigo-600" : "text-google-gray/30"}`}
                    >
                      48kHz
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Stealth Random Button */}
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="p-2.5 text-google-gray/30 hover:text-indigo-600 transition-all active:scale-90"
                    title="Random Prompt"
                  >
                    <Wand2 size={20} />
                  </button>

                  {/* Round CTA Button */}
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/create";
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                      inputValue.trim()
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!inputValue.trim()}
                  >
                    <Music2
                      size={22}
                      className={inputValue.trim() ? "animate-pulse" : ""}
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Vertical Scrolling Suggestion Pill */}
            <section
              aria-label="Quick style suggestions"
              className="mt-8 w-full max-w-2xl mx-auto flex items-center justify-center gap-3 px-4 overflow-hidden"
              onMouseEnter={() => setIsSuggestionPaused(true)}
              onMouseLeave={() => setIsSuggestionPaused(false)}
            >
              <span className="text-[10px] font-black text-indigo-600/40 uppercase tracking-[0.2em] whitespace-nowrap">
                Quick Styles:
              </span>

              <div className="h-6 relative group w-auto min-w-[120px]">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={suggestionIndex}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() =>
                      handleSuggestionClick(SUGGESTIONS[suggestionIndex])
                    }
                    className="absolute inset-0 flex items-center justify-start text-[11px] font-bold text-google-gray/40 hover:text-indigo-600 transition-colors cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <span className="opacity-40 mr-1.5">#</span>
                    {SUGGESTIONS[suggestionIndex]}
                  </motion.button>
                </AnimatePresence>
              </div>
            </section>
          </div>
        </section>

        {/* Feature Cards Section (Only visible after scroll) */}
        <section className="grid md:grid-cols-3 gap-6 w-full max-w-5xl py-24">
          {pillars.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="group p-8 rounded-xl bg-white border border-gray-100 hover:border-google-blue/30 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 flex flex-col items-start text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-google-gray mb-6 group-hover:bg-blue-50 group-hover:text-google-blue transition-colors">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-google-dark mb-3">
                {item.title}
              </h3>
              <p className="text-google-gray text-sm leading-relaxed mb-8 flex-1">
                {item.detail}
              </p>
              <Link
                className="flex items-center gap-2 text-sm font-bold text-google-blue hover:gap-3 transition-all"
                href={item.href}
              >
                Learn more
                <ChevronRight />
              </Link>
            </motion.article>
          ))}
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-google-gray/50 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded-md" />
          <span className="font-bold text-google-dark/40">LyriaSong</span>
        </div>

        <div className="flex gap-8 font-medium">
          <a
            href="/privacy"
            className="hover:text-google-dark transition-colors"
          >
            Privacy
          </a>
          <a href="/terms" className="hover:text-google-dark transition-colors">
            Terms
          </a>
          <a
            href="/security"
            className="hover:text-google-dark transition-colors"
          >
            Security
          </a>
        </div>

        <p>© 2026 LyriaSong AI.</p>
      </footer>
    </div>
  );
}
