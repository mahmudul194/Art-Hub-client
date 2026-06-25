"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Palette, Mail, Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-zinc-800"
      >
        <div>
          <div className="flex justify-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow-inner">
              <Palette className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-center text-slate-500 dark:text-zinc-400 font-medium">
            Join the global ArtHub community
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
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="pl-12 appearance-none rounded-xl block w-full px-4 py-4 border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-purple-500 font-medium transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="pl-12 appearance-none rounded-xl block w-full px-4 py-4 border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-purple-500 font-medium transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="pl-12 appearance-none rounded-xl block w-full px-4 py-4 border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-purple-500 font-medium transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Confirm</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="pl-12 appearance-none rounded-xl block w-full px-4 py-4 border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:border-purple-500 font-medium transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-3 uppercase tracking-wide">I am joining as a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`py-4 px-4 text-lg font-black rounded-xl border-2 text-center transition-all ${
                    formData.role === 'user' 
                      ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/40 dark:border-purple-500 dark:text-purple-300 shadow-md' 
                      : 'bg-white dark:bg-zinc-950/50 border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  Collector
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'artist' })}
                  className={`py-4 px-4 text-lg font-black rounded-xl border-2 text-center transition-all ${
                    formData.role === 'artist' 
                      ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/40 dark:border-purple-500 dark:text-purple-300 shadow-md' 
                      : 'bg-white dark:bg-zinc-950/50 border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  Artist
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-lg shadow-purple-500/25 transition-all font-black text-lg hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </div>

          <div className="text-center font-medium text-slate-500 dark:text-zinc-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors border-b-2 border-transparent hover:border-purple-500 pb-0.5">
              Sign in
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
