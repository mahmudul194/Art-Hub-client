"use client";
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import ArtworkCard from '../../components/ArtworkCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Explore Artworks</h1>
          <p className="text-slate-600 dark:text-slate-400">Discover thousands of original pieces from talented artists.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <form onSubmit={handleSearchSubmit} className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </form>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              
              <select 
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setCategory(''); setPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === '' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setPage(1); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="md:w-1/3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Price Range</h4>
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Apply
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No artworks found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            
            <span className="flex items-center px-4 font-medium text-slate-700 dark:text-slate-300">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
