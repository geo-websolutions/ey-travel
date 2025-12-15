"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { app } from "@/lib/firebase";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiEgyptianTemple } from "react-icons/gi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Check authentication state on component mount
  useEffect(() => {
    const firebaseAuth = getAuth(app);

    const unsubscribeFirebase = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check Supabase auth if Firebase is authenticated
        const {
          data: { session: supabaseSession },
        } = await supabase.auth.getSession();
        if (supabaseSession) {
          router.push("/admin/dashboard");
        }
      }
      setAuthChecked(true);
    });

    return () => {
      unsubscribeFirebase();
    };
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Login to Firebase
      const firebaseAuth = getAuth(app);
      const firebaseUser = await signInWithEmailAndPassword(firebaseAuth, email, password);

      // 2. Login to Supabase
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      // 3. Redirect on success
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/70 to-stone-900/20 z-10" />

        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <GiEgyptianTemple className="text-amber-400 mr-3" size={36} />
            Welcome to <span className="text-amber-400 ml-2">EY Travel</span>
          </h1>
          <p className="text-lg">Sign in to access your account</p>
        </div>
      </section>

      {/* Login Form */}
      <section className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-stone-800/50 rounded-lg border border-stone-700 p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-amber-400">Member Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-stone-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-white placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-stone-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-white placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-stone-400 hover:text-amber-400" />
                  ) : (
                    <FaEye className="text-stone-400 hover:text-amber-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="hidden items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-600 rounded bg-stone-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-amber-400 hover:text-amber-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
