"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Palette, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-zinc-800"
      >
        <div>
          <div className="flex justify-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow-inner">
              <Palette className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-slate-500 dark:text-zinc-400 font-medium">
            Sign in to your ArtHub account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm text-center font-bold border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="pl-12 appearance-none rounded-xl block w-full px-4 py-4 border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-purple-500 font-medium transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="pl-12 appearance-none rounded-xl block w-full px-4 py-4 border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-purple-500 font-medium transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-lg shadow-purple-500/25 transition-all font-black text-lg hover:-translate-y-0.5"
            >
              Sign in to ArtHub
            </button>
          </div>
          
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center mt-2">
              <div className="w-full border-t-2 border-slate-100 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider text-xs">Or continue with</span>
            </div>
          </div>
          
          <button
            type="button"
            className="w-full flex justify-center items-center py-4 px-4 border-2 border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all font-bold hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center font-medium text-slate-500 dark:text-zinc-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors border-b-2 border-transparent hover:border-purple-500 pb-0.5">
              Create one now
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
