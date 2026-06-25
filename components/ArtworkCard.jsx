import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';

export default function ArtworkCard({ artwork, featured = false }) {
  return (
    <Link href={`/artwork/${artwork._id}`} className="block h-full">
      <div className={`bento-card group h-full flex flex-col ${featured ? 'min-h-[400px] md:min-h-[500px]' : 'min-h-[350px]'}`}>
        <div className="absolute inset-0 z-0">
          <img 
            src={artwork.image} 
            alt={artwork.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="glass-panel text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider backdrop-blur-md">
            {artwork.category}
          </div>
          
          <button className="p-2.5 rounded-full glass-panel text-white hover:text-pink-500 hover:bg-white transition-colors backdrop-blur-md" onClick={(e) => e.preventDefault()}>
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Status Overlay */}
        {artwork.isSold && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-red-500/90 text-white text-sm font-bold px-6 py-2 rounded-full shadow-2xl -rotate-12 border-2 border-white backdrop-blur-sm">
              SOLD OUT
            </div>
          </div>
        )}
        
        <div className="relative z-10 mt-auto p-6 md:p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex justify-between items-end gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl md:text-3xl font-outfit font-black text-white mb-2 line-clamp-1 drop-shadow-md">
                {artwork.title}
              </h3>
              <p className="text-zinc-300 text-sm md:text-base font-medium">
                By <span className="text-white">{artwork.artistName}</span>
              </p>
            </div>
            
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="text-2xl md:text-3xl font-black font-outfit text-white mb-3 drop-shadow-md">
                ${artwork.price}
              </div>
              <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:bg-white group-hover:text-zinc-950 text-white transition-all duration-300 shadow-xl">
                <ArrowUpRight className="w-5 h-5 transform group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
