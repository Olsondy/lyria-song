"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Music2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiTwitterXFill } from "react-icons/ri";
import { toast } from "sonner"; // 项目中配了 sonner
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/client";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthStep = "LOGIN" | "VERIFY";

export function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>("LOGIN");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        toast.error(error.message || "Failed to send code");
      } else {
        toast.success("Verification code sent to your email");
        setStep("VERIFY");
      }
    } catch (_err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        toast.error(error.message || "Invalid or expired code");
        setOtp("");
      } else {
        toast.success("Login successful!");
        onOpenChange(false);
        // 重置状态
        setTimeout(() => {
          setStep("LOGIN");
          setEmail("");
          setOtp("");
        }, 300);
      }
    } catch (_err) {
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-xl border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Sign in to LyriaSong</DialogTitle>
        </VisuallyHidden>
        <div className="bg-white px-8 pb-10 pt-12">
          <AnimatePresence mode="wait">
            {step === "LOGIN" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-9 h-9 bg-google-blue rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Music2 size={20} strokeWidth={2.5} />
                </div>

                <h2 className="text-2xl font-bold text-google-dark my-8 text-center">
                  Sign in to LyriaSong
                </h2>

                <div className="w-full space-y-4 mb-8">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-12 rounded-2xl border-google-border flex items-center justify-center gap-3 font-medium text-google-gray hover:bg-gray-50 transition-colors"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <FcGoogle className="w-5 h-5" />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-12 rounded-2xl border-google-border flex items-center justify-center gap-3 font-medium text-google-gray hover:bg-gray-50 transition-colors"
                  >
                    <RiTwitterXFill className="w-5 h-5 text-black" />
                    Continue with X
                  </Button>
                </div>

                <div className="w-full flex items-center gap-4 mb-8">
                  <Separator className="flex-1" />
                  <span className="text-xs text-google-gray/60 font-medium">
                    or
                  </span>
                  <Separator className="flex-1" />
                </div>

                <form onSubmit={handleSendOTP} className="w-full space-y-6">
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="h-14 rounded-2xl border-google-border focus-visible:ring-google-blue bg-white text-lg px-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-full bg-google-blue hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>

                <p className="mt-8 text-xs text-center text-google-gray/60 leading-relaxed px-4">
                  By continuing, you agree to LyriaSong's{" "}
                  <a href="/terms" className="text-google-blue hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-google-blue hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck
                    className="w-8 h-8 text-google-blue"
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="text-2xl font-bold text-google-dark mb-2 text-center">
                  Check your email
                </h2>
                <p className="text-google-gray text-center mb-8 px-2 leading-relaxed">
                  We sent a code to{" "}
                  <span className="font-semibold text-google-dark">
                    {email}
                  </span>
                </p>

                <div className="mb-10">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOTP}
                    disabled={isLoading}
                    autoFocus
                  >
                    <InputOTPGroup className="gap-3 sm:gap-4">
                      {([0, 1, 2, 3, 4, 5] as const).map((slotIndex) => (
                        <InputOTPSlot
                          key={`otp-slot-${slotIndex}`}
                          index={slotIndex}
                          className="w-12 h-16 sm:w-14 sm:h-16 text-2xl font-bold rounded-2xl border-google-border focus:border-google-blue focus:ring-1 focus:ring-google-blue bg-white transition-all shadow-sm"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  className="w-full h-14 rounded-full bg-google-blue hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all mb-6"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>

                <div className="flex flex-col items-center gap-6">
                  <p className="text-sm text-google-gray">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      className="text-google-blue font-semibold hover:underline"
                      onClick={handleSendOTP}
                    >
                      Resend code
                    </button>
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep("LOGIN")}
                    className="flex items-center gap-2 text-google-gray hover:text-google-dark font-medium text-sm transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
