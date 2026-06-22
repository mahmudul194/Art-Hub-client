"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../lib/api';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight, Star, Palette, Image as ImageIcon } from 'lucide-react';

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
    { name: 'Painting', icon: <Palette className="w-8 h-8 mb-2 text-purple-500" /> },
    { name: 'Digital', icon: <ImageIcon className="w-8 h-8 mb-2 text-blue-500" /> },
    { name: 'Photography', icon: <ImageIcon className="w-8 h-8 mb-2 text-green-500" /> },
    { name: 'Sculpture', icon: <Palette className="w-8 h-8 mb-2 text-orange-500" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-slate-900 text-white pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Art Background" 
            className="w-full h-full object-cover opacity-50 scale-105 transform hover:scale-100 transition-transform duration-[20s]"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass-effect p-8 md:p-12 rounded-3xl max-w-4xl w-full mx-auto shadow-2xl relative overflow-hidden"
          >
            {/* Decorative abstract shape inside the glass box */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-outfit tracking-tight mb-6 relative z-10">
              Collect <br />
              <span className="text-gradient drop-shadow-sm">Masterpieces</span>
            </h1>
            
            <p className="mt-4 text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 font-light relative z-10 leading-relaxed">
              Experience the world's most exclusive digital and physical art gallery. Connect directly with visionary artists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link 
                href="/browse" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Gallery <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white glass-effect hover:bg-white/10 transition-all duration-300"
              >
                Join as Artist
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Featured Artworks</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork, idx) => (
                <motion.div 
                  key={artwork._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <ArtworkCard artwork={artwork} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link 
              href="/browse"
              className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            >
              View all artworks <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Top Artists</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Elena Rostova', sold: 42, img: 10 },
              { name: 'Marcus Chen', sold: 38, img: 11 },
              { name: 'Sophia Reynolds', sold: 29, img: 12 }
            ].map((artist, idx) => (
              <motion.div 
                key={artist.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-slate-50 dark:bg-slate-700 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <img 
                    src={`https://i.pravatar.cc/150?img=${artist.img}`} 
                    alt={artist.name} 
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800 shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-sm">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{artist.name}</h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">{artist.sold} Artworks Sold</p>
                <button className="px-6 py-2 rounded-full border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Art Categories</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} href={`/browse?category=${cat.name}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-800 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-700"
                >
                  <div className="transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {cat.name}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
