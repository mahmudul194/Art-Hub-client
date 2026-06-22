import Link from 'next/link';
import { Palette, Mail, MessageCircle, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <Palette className="h-8 w-8 text-purple-500" />
              ArtHub
            </Link>
            <p className="text-sm text-slate-400">
              Discover, buy, and sell original art from talented artists around the world.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Star className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-purple-400 transition-colors">Browse Artworks</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse?category=Painting" className="hover:text-purple-400 transition-colors">Paintings</Link></li>
              <li><Link href="/browse?category=Digital" className="hover:text-purple-400 transition-colors">Digital Art</Link></li>
              <li><Link href="/browse?category=Photography" className="hover:text-purple-400 transition-colors">Photography</Link></li>
              <li><Link href="/browse?category=Sculpture" className="hover:text-purple-400 transition-colors">Sculptures</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe to get updates on new artists and exclusive offers.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-purple-500"
              />
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-slate-400 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} ArtHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
