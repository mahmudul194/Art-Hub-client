"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../lib/api';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight, Star, Palette, Image as ImageIcon, Zap, Sparkles } from 'lucide-react';

export default function Home() {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/artworks/featured');
        setFeaturedArtworks(res.data);
      } catch (error) {
        console.error("Failed to fetch featured artworks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Painting', icon: <Palette className="w-8 h-8 text-purple-500" /> },
    { name: 'Digital', icon: <ImageIcon className="w-8 h-8 text-blue-500" /> },
    { name: 'Photography', icon: <Zap className="w-8 h-8 text-pink-500" /> },
    { name: 'Sculpture', icon: <Sparkles className="w-8 h-8 text-orange-500" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Modern Split-Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-40 animate-blob" />
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-40 animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full glass-panel border border-purple-500/30 text-purple-600 dark:text-purple-400 font-medium text-sm mb-6">
                <Sparkles className="w-4 h-4 mr-2" /> Redefining Digital Art
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-[1.1] mb-6 text-slate-900 dark:text-white">
                Discover <br />
                <span className="text-gradient">Masterpieces</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-lg mb-10 font-light leading-relaxed">
                Experience the world's most exclusive digital and physical art gallery. Connect directly with visionary artists from across the globe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/browse" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all transform hover:-translate-y-1 shadow-xl"
                >
                  Explore Gallery <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-slate-900 dark:text-white glass-panel hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-all transform hover:-translate-y-1"
                >
                  Join as Artist
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl glow-border">
                <img 
                  src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1972&auto=format&fit=crop" 
                  alt="Hero Art" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[10s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-3xl backdrop-blur-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Abstract Harmony</h3>
                      <p className="text-zinc-300 text-sm">By Elena Rostova</p>
                    </div>
                    <div className="bg-white text-zinc-950 px-4 py-2 rounded-full font-bold">
                      $1,200
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Modern Bento Grid Featured Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 dark:text-white tracking-tight mb-4">Curated Collection</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-lg">Hand-picked masterpieces for the discerning collector.</p>
            </div>
            <Link href="/browse" className="hidden md:inline-flex items-center text-purple-600 dark:text-purple-400 font-bold hover:text-pink-500 transition-colors group">
              View All <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtworks.map((artwork, idx) => (
                <motion.div 
                  key={artwork._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={idx === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
                >
                  <ArtworkCard artwork={artwork} featured={idx === 0} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bento Categories */}
      <section className="py-24 bg-white dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight mb-12 text-center">Explore Mediums</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} href={`/browse?category=${cat.name}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bento-card p-8 flex flex-col items-center justify-center text-center aspect-square group cursor-pointer"
                >
                  <div className="p-4 rounded-full bg-slate-50 dark:bg-zinc-800/50 mb-4 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                    {cat.name}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists Bento Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 dark:text-white tracking-tight mb-4">Trending Creators</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">The visionary minds behind our most sought-after pieces.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Elena Rostova', sold: 42, img: 10, bg: 'from-purple-500/20 to-pink-500/20' },
              { name: 'Marcus Chen', sold: 38, img: 11, bg: 'from-blue-500/20 to-cyan-500/20' },
              { name: 'Sophia Reynolds', sold: 29, img: 12, bg: 'from-orange-500/20 to-yellow-500/20' }
            ].map((artist, idx) => (
              <motion.div 
                key={artist.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bento-card group overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-r ${artist.bg} w-full relative`}>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${artist.img}`} 
                      alt={artist.name} 
                      className="w-full h-full object-cover rounded-2xl border-4 border-white dark:border-zinc-900 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-zinc-900">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="pt-16 pb-8 px-6 text-center">
                  <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white mb-1">{artist.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-6">{artist.sold} Masterpieces Sold</p>
                  <button className="w-full py-3 rounded-xl border-2 border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
                    Explore Gallery
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
