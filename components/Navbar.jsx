"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Palette, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'artist') return '/dashboard/artist';
    return '/dashboard/user';
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500 ${scrolled ? 'opacity-100 shadow-lg' : 'opacity-0'}`} />
      </div>
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-500">
        <div className="flex justify-between h-14 items-center rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-lg border border-white/20 dark:border-zinc-700/30 px-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 text-2xl font-black font-outfit text-zinc-900 dark:text-white group">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-colors">
                <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="tracking-tight">ArtHub</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-xl text-zinc-600 hover:text-purple-600 hover:bg-purple-50/80 dark:text-zinc-300 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 font-semibold text-sm transition-all">
              Home
            </Link>
            <Link href="/browse" className="px-4 py-2 rounded-xl text-zinc-600 hover:text-purple-600 hover:bg-purple-50/80 dark:text-zinc-300 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 font-semibold text-sm transition-all">
              Gallery
            </Link>
            
            <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-3"></div>

            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <Link href={getDashboardLink()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-600 hover:text-purple-600 hover:bg-purple-50/80 dark:text-zinc-300 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 font-semibold text-sm transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={logout} className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-all" aria-label="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="pl-2">
                <Link href="/login" className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 inline-block">
                  Sign In
                </Link>
              </div>
            )}

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-3 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
          </div>

          <div className="flex items-center md:hidden gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-zinc-600 dark:text-zinc-300"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 shadow-sm"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 p-3 rounded-2xl bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl animate-in slide-in-from-top-4 fade-in-0 zoom-in-95">
            <div className="flex flex-col gap-1">
              <Link 
                href="/" 
                className="px-4 py-3 rounded-xl text-sm font-bold text-zinc-700 hover:text-purple-600 hover:bg-purple-50 dark:text-zinc-200 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                className="px-4 py-3 rounded-xl text-sm font-bold text-zinc-700 hover:text-purple-600 hover:bg-purple-50 dark:text-zinc-200 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"></div>
              
              {user ? (
                <>
                  <Link 
                    href={getDashboardLink()} 
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-zinc-700 hover:text-purple-600 hover:bg-purple-50 dark:text-zinc-200 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="mt-2 text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-purple-600 shadow-md hover:bg-purple-500 transition-colors"
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
