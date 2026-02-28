"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Image as ImageIcon,
  LogOut,
  Mic,
  Music2,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/client";

const PHRASES = [
  "Paste your lyrics or tell a story...",
  "Upload a sunset photo for mood...",
  "Describe a rainy afternoon in Paris...",
  "A high-energy rock anthem about coding...",
  "Lofi beats for late night studying...",
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
  const [isFidelityMode, setIsFidelityMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      {/* Background decoration */}
      <div className="bg-wave-container opacity-50">
        <div className="wave-line" style={{ marginLeft: "-10%" }} />
        <div className="wave-line" style={{ marginLeft: "5%" }} />
        <div className="wave-line" style={{ marginLeft: "-5%" }} />
        <div className="wave-line" style={{ marginLeft: "10%" }} />
      </div>

      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 md:px-12 bg-white/70 backdrop-blur-md z-50 border-b border-gray-100/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-google-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Music2 size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-google-dark tracking-tight">
            LyriaSong
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-google-gray">
          <Link href="/" className="hover:text-google-dark transition-colors">
            Explore
          </Link>
          <Link
            href="/pricing"
            className="hover:text-google-dark transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/resources"
            className="hover:text-google-dark transition-colors"
          >
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-full" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/user/my-songs"
                className="hidden sm:block text-sm font-medium text-google-gray hover:text-google-dark transition-colors"
              >
                My Songs
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-google-blue border border-blue-100 overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-google-gray hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-google-dark text-white text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pt-32 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-google-blue border border-blue-100 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span>Next-Gen AI Music Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[1.1] text-google-dark mb-8 tracking-tighter">
            Generate 3-Minute Songs <br className="hidden md:block" />
            with <span className="text-google-blue">Lyria 3 fidelity.</span>
          </h1>

          <p className="text-lg md:text-2xl font-normal text-google-gray max-w-2xl mx-auto leading-relaxed">
            Professional verse-chorus structures. Studio-grade 48kHz output. All
            from a simple prompt.
          </p>
        </motion.div>

        {/* Search/Prompt Box */}
        <div className="w-full max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              borderColor: isFocused ? "#1A73E8" : "#DADCE0",
              boxShadow: isFocused
                ? "0 20px 50px rgba(26, 115, 232, 0.15)"
                : "0 10px 30px rgba(0,0,0,0.04)",
            }}
            transition={{ duration: 0.5 }}
            className={`glass-input relative flex items-center p-4 md:p-6 rounded-[40px] border transition-all duration-500 ${isFidelityMode ? "animate-pulse-glow" : ""} ${isFocused ? "border-google-blue shadow-[0_20px_50px_rgba(26,115,232,0.15)]" : "border-google-border shadow-[0_10px_30px_rgba(0,0,0,0.04)]"}`}
          >
            <div className="flex items-center gap-3 md:gap-4 px-2">
              <button
                className="text-google-gray hover:text-google-blue transition-all p-2 rounded-xl hover:bg-blue-50"
                title="Upload Image"
                type="button"
              >
                <ImageIcon size={24} strokeWidth={1.5} />
              </button>
              <button
                className="text-google-gray hover:text-google-blue transition-all p-2 rounded-xl hover:bg-blue-50"
                title="Upload Video"
                type="button"
              >
                <Video size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 px-4 md:px-6 relative min-h-[48px] flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-google-dark placeholder:text-transparent outline-none z-10 font-medium"
              />

              <AnimatePresence mode="wait">
                {!inputValue && !isFocused && (
                  <motion.div
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-4 md:left-6 pointer-events-none text-xl md:text-2xl text-google-gray/30 font-medium"
                  >
                    {PHRASES[phraseIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-2">
              <button
                className="text-google-gray hover:text-google-blue transition-all p-2 rounded-xl hover:bg-blue-50"
                title="Voice Input"
                type="button"
              >
                <Mic size={24} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>

          {/* Action Row */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between px-6 gap-8">
            <button
              className="flex items-center gap-4 select-none group cursor-pointer"
              onClick={() => setIsFidelityMode(!isFidelityMode)}
              type="button"
            >
              <div className="relative w-12 h-6">
                <div
                  className={`absolute inset-0 rounded-full transition-colors duration-300 ${isFidelityMode ? "bg-google-blue" : "bg-gray-200"}`}
                />
                <motion.div
                  animate={{ x: isFidelityMode ? 24 : 0 }}
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-google-dark font-bold text-sm tracking-wide">
                  High-Fidelity Mode
                </span>
                <span className="text-google-gray text-[11px] font-medium uppercase tracking-widest">
                  Lyria Engine 48kHz
                </span>
              </div>
            </button>

            <Link
              href="/create"
              className="group flex items-center gap-3 bg-google-blue text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:bg-blue-600 active:scale-95 transition-all duration-300 shadow-xl shadow-blue-500/10"
            >
              Compose Masterpiece
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
          {pillars.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="group p-8 rounded-[32px] bg-white border border-gray-100 hover:border-google-blue/30 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 flex flex-col items-start text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-google-gray mb-6 group-hover:bg-blue-50 group-hover:text-google-blue transition-colors">
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
                <ChevronRight size={16} />
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
          <a href="#" className="hover:text-google-dark transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-google-dark transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-google-dark transition-colors">
            Security
          </a>
        </div>

        <p>© 2026 LyriaSong AI. Precision-engineered for creators.</p>
      </footer>
    </div>
  );
}
