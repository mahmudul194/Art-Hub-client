"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleSelectionModal() {
  const { showRoleModal, updateUserRole } = useAuth();
  const [role, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showRoleModal) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await updateUserRole(role);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-zinc-800 overflow-hidden"
        >
          {/* Decorative backgrounds */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow-inner">
                <Palette className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black font-outfit text-center text-slate-900 dark:text-white mb-2">
              Welcome to ArtHub!
            </h2>
            <p className="text-center text-slate-500 dark:text-zinc-400 font-medium mb-8">
              How would you like to use the platform?
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`w-full py-4 px-4 text-lg font-black rounded-xl border-2 text-center transition-all ${
                  role === 'user' 
                    ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/40 dark:border-purple-500 dark:text-purple-300 shadow-md' 
                    : 'bg-slate-50 dark:bg-zinc-950/50 border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                Join as Collector
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`w-full py-4 px-4 text-lg font-black rounded-xl border-2 text-center transition-all ${
                  role === 'artist' 
                    ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/40 dark:border-purple-500 dark:text-purple-300 shadow-md' 
                    : 'bg-slate-50 dark:bg-zinc-950/50 border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                Join as Artist
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-8 w-full flex justify-center items-center py-4 px-4 rounded-xl text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-lg shadow-purple-500/25 transition-all font-black text-lg hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
