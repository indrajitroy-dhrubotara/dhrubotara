"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { trackLogin } from '@/lib/analytics';

import { verifyAdmin } from '@/app/actions/auth';

export default function AdminLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [user, isAdmin, authLoading, router]);

  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Format phone number: Ensure it has country code if missing
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

      // 1. Verify if this number is an admin BEFORE sending OTP
      // This runs on the server, so the list remains hidden
      const isAuthorized = await verifyAdmin(formattedNumber);
      if (!isAuthorized) {
        throw new Error("Unauthorized Access. This phone number is not an admin.");
      }

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      if (auth && appVerifier) {
         const result = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
         setConfirmationResult(result);
         setStep('otp');
      }
    } catch (err: unknown) {
      console.error(err);
      let message = "Failed to send OTP. Check console.";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
         message = (err as { message: string }).message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
        trackLogin('phone');
        router.push('/admin/dashboard');
      }
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 shadow-xl rounded-sm"
      >
        <div className="text-center mb-8">
          <span className="font-serif text-2xl text-emerald-950 tracking-wider">dhrubotara</span>
	          <p className="text-stone-500 font-sans text-xs uppercase tracking-widest mt-2">Codex Admin Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start">
             <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
             <p className="text-red-700 text-sm font-sans">{error}</p>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 font-sans mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-sm focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                />
              </div>
              <p className="mt-2 text-xs text-stone-400">Enter your full number with country code.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending Code..." : "Send Login Code"}
            </button>
            <div id="recaptcha-container"></div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
             <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 font-serif">Enter Code</h3>
                <p className="text-sm text-stone-500 mt-1">We sent a code to {phoneNumber}</p>
             </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 font-sans mb-2">Verification Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-sm focus:ring-emerald-500 focus:border-emerald-500 font-sans tracking-widest text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Login"} <ArrowRight size={16} className="ml-2" />
            </button>
            
            <button
               type="button"
               onClick={() => setStep('phone')}
               className="w-full text-center text-xs text-stone-500 hover:text-emerald-800 underline"
            >
                Wrong number? Go back
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// Global declaration for recaptcha
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
