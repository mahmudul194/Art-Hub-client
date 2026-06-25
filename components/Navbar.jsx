"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'artist') return '/dashboard/artist';
    return '/dashboard/user';
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl rounded-full glass-panel transition-all duration-300">
        <div className="px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 text-2xl font-black font-outfit text-gradient drop-shadow-sm hover:scale-105 transition-transform duration-300">
                <Palette className="h-7 w-7 text-purple-600" />
                ArtHub
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/" className="px-4 py-2 rounded-full text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 font-medium transition-all">
                Home
              </Link>
              <Link href="/browse" className="px-4 py-2 rounded-full text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 font-medium transition-all">
                Browse
              </Link>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              {user ? (
                <>
                  <Link href={getDashboardLink()} className="px-4 py-2 rounded-full text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 font-medium transition-all">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-all">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-lg shadow-purple-500/25 transform hover:-translate-y-0.5">
                  Sign In
                </Link>
              )}

              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="ml-2 p-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              )}
            </div>

            <div className="flex items-center md:hidden gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-slate-700 dark:text-slate-300"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass-panel border-t-0 rounded-b-3xl mt-2 overflow-hidden animate-in slide-in-from-top-4">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link 
                href="/" 
                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:bg-purple-900/20"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:bg-purple-900/20"
                onClick={() => setIsOpen(false)}
              >
                Browse Artworks
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href={getDashboardLink()} 
                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:bg-purple-900/20"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-red-50 dark:text-slate-300 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="block mt-4 text-center px-4 py-3 rounded-xl text-base font-bold text-white bg-purple-600 shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
