import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function ArtworkCard({ artwork }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 dark:border-slate-700/50 flex flex-col h-full transform hover:-translate-y-2">
      <div className="relative h-72 overflow-hidden">
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="glass-effect text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider backdrop-blur-md">
            {artwork.category}
          </div>
          
          <button className="p-2 rounded-full glass-effect text-white hover:text-pink-500 hover:bg-white transition-colors backdrop-blur-md">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Status Overlay */}
        {artwork.isSold && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-10">
            <div className="bg-red-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-2xl transform -rotate-12 border-2 border-white">
              SOLD OUT
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
          {artwork.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow">
          By <span className="font-semibold text-slate-800 dark:text-slate-200">{artwork.artistName}</span>
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
            ${artwork.price}
          </div>
          <Link 
            href={`/artwork/${artwork._id}`}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white dark:hover:bg-purple-600 text-slate-800 dark:text-slate-200 font-medium transition-all duration-300 shadow-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
