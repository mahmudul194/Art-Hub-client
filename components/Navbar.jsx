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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              <Palette className="h-8 w-8 text-purple-600" />
              ArtHub
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 font-medium transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 font-medium transition-colors">
              Browse Artworks
            </Link>
            
            {user ? (
              <>
                <Link href={getDashboardLink()} className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 font-medium transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout} className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all shadow-md hover:shadow-lg">
                Login / Register
              </Link>
            )}

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
          </div>

          <div className="flex items-center md:hidden gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-slate-800 dark:text-slate-200"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              Browse Artworks
            </Link>
            
            {user ? (
              <>
                <Link 
                  href={getDashboardLink()} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-purple-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
