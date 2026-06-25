import Link from 'next/link';
import { Palette, Mail, MessageCircle, Star, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-slate-300 py-16 border-t border-zinc-800 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 text-3xl font-black font-outfit text-white group">
              <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Palette className="h-8 w-8 text-purple-500" />
              </div>
              ArtHub
            </Link>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-sm">
              Discover, buy, and sell original art from talented artists around the globe. Elevate your space with exclusive masterpieces.
            </p>
            <div className="flex space-x-3 pt-4">
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-105">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-105">
                <Star className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-105">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4 font-medium text-zinc-400">
              <li><Link href="/" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Home</Link></li>
              <li><Link href="/browse" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Gallery</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />About Us</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-4 font-medium text-zinc-400">
              <li><Link href="/browse?category=Painting" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Paintings</Link></li>
              <li><Link href="/browse?category=Digital" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Digital Art</Link></li>
              <li><Link href="/browse?category=Photography" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Photography</Link></li>
              <li><Link href="/browse?category=Sculpture" className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />Sculptures</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm font-medium text-zinc-400 mb-6 leading-relaxed">Join our exclusive mailing list to get updates on new drops and featured artists.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 font-medium text-white placeholder-zinc-500 w-full focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-500/25 w-full text-center"
              >
                Subscribe Now
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t-2 border-zinc-800/50 mt-16 pt-8 text-sm font-bold text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>&copy; {new Date().getFullYear()} ArtHub Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
