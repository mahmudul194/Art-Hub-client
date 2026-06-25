"use client";
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import ArtworkCard from '../../components/ArtworkCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

export default function BrowseArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Painting', 'Digital', 'Photography', 'Sculpture'];

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/artworks', {
        params: {
          search,
          category,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          page,
          limit: 12
        }
      });
      setArtworks(res.data.artworks);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch artworks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, [category, sort, page]); // Re-fetch when these change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArtworks();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold text-sm mb-4">
            <Palette className="w-4 h-4" /> Gallery
          </div>
          <h1 className="text-5xl font-black font-outfit text-slate-900 dark:text-white tracking-tight mb-4">Explore Masterpieces</h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-lg">Discover thousands of original pieces from talented artists around the globe.</p>
        </div>

        {/* Search and Filters */}
        <div className="bento-card p-6 mb-12 animate-in fade-in slide-in-from-bottom-4 delay-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            <form onSubmit={handleSearchSubmit} className="w-full lg:flex-1 relative">
              <input
                type="text"
                placeholder="Search by title, artist, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors font-medium text-lg placeholder:text-slate-400"
              />
              <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
            </form>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                  showFilters 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-purple-500'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </button>
              
              <div className="flex-1 lg:flex-none relative">
                <select 
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full appearance-none px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-purple-500 transition-colors font-bold cursor-pointer"
                >
                  <option value="newest">Latest Arrivals</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          <div className={`grid transition-all duration-300 ease-in-out ${showFilters ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t-2 border-slate-100 dark:border-zinc-800' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Medium</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => { setCategory(''); setPage(1); }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${category === '' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105' : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setPage(1); }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${category === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105' : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Price Range</h4>
                  <form onSubmit={handleSearchSubmit} className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <span className="text-slate-400 font-bold hidden sm:block">-</span>
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-xl">
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800 animate-in fade-in">
            <Filter className="w-16 h-16 text-slate-300 dark:text-zinc-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black font-outfit text-slate-900 dark:text-white mb-2">No masterpieces found</h3>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Try adjusting your filters or search term to discover more art.</p>
            <button 
              onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1); fetchArtworks(); }}
              className="mt-6 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artworks.map((artwork, index) => (
              <div key={artwork._id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    page === i + 1 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-110' 
                      : 'bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:border-purple-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
