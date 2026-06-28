"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Plus, Image as ImageIcon, DollarSign, Trash2, Paintbrush, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding artwork
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Painting', image: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'artist') {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [artRes, salesRes] = await Promise.all([
          api.get('/artworks', { params: { artistId: user._id || user.id, limit: 100 } }),
          api.get('/payments/history')
        ]);
        
        setArtworks(artRes.data.artworks.filter(a => a.artistId === (user._id || user.id)));
        setSales(salesRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await api.delete(`/artworks/${id}`);
        setArtworks(artworks.filter(a => a._id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/artworks', formData);
      setArtworks([res.data, ...artworks]);
      setIsAdding(false);
      setFormData({ title: '', description: '', price: '', category: 'Painting', image: '' });
    } catch (err) {
      alert('Failed to add artwork');
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">Studio</h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2">Welcome back, <span className="text-purple-600 dark:text-purple-400 font-bold">{user.name}</span></p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-xl hover:scale-105 transition-all shadow-xl hover:shadow-purple-500/20"
          >
            {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" /> Publish Masterpiece</>}
          </button>
        </div>

        {isAdding && (
          <div className="bento-card p-8 mb-10 border-purple-500/30 bg-purple-50/50 dark:bg-purple-900/10">
            <h2 className="text-2xl font-black font-outfit mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <Paintbrush className="w-6 h-6 text-purple-500" /> Let's Create
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-purple-500 focus:ring-0 transition-colors font-medium" placeholder="E.g., Starry Night 2.0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price ($)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-purple-500 focus:ring-0 transition-colors font-medium" placeholder="E.g., 500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-purple-500 focus:ring-0 transition-colors font-medium">
                    <option value="Painting">Painting</option>
                    <option value="Digital">Digital</option>
                    <option value="Photography">Photography</option>
                    <option value="Sculpture">Sculpture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Upload Image (via imgBB)</label>
                  <div className="w-full px-2 py-1.5 rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:border-purple-500 transition-colors relative overflow-hidden flex items-center">
                    <input 
                      required={!formData.image} 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        const form = new FormData();
                        form.append('image', file);
                        
                        try {
                          const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'ab22d1cd4dbef18ec0ccfe80a426f43e';
                          const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                            method: 'POST',
                            body: form
                          });
                          const data = await res.json();
                          if (data.success) {
                            setFormData({...formData, image: data.data.display_url});
                          } else {
                            alert('Image upload failed: ' + data.error.message);
                          }
                        } catch (err) {
                          alert('Error uploading to imgBB');
                        }
                      }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex items-center gap-3 w-full pl-2">
                      <div className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold rounded-lg text-sm">Choose File</div>
                      <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium truncate flex-1">
                        {formData.image ? 'Image ready!' : 'No file chosen'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-purple-500 focus:ring-0 transition-colors font-medium h-32 resize-none" placeholder="Tell the story behind your creation..." />
              </div>
              <button disabled={!formData.image} type="submit" className="px-8 py-4 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 w-full md:w-auto shadow-lg shadow-purple-500/25">
                Publish Masterpiece
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* My Artworks */}
          <div className="bento-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">Portfolio Showcase</h3>
            </div>
            
            {artworks.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
                <Paintbrush className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-zinc-400 font-medium">Your canvas is empty. Start adding artworks!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {artworks.map(art => (
                  <div key={art._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 group hover:border-purple-500/30 transition-colors gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl shadow-sm relative group-hover:shadow-md transition-shadow">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/artwork/${art._id}`} className="font-black text-lg text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 truncate block">
                          {art.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">${art.price}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600"></span>
                          <span className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{art.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto shrink-0">
                      <button onClick={() => handleDelete(art._id)} className="p-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sales History */}
          <div className="bento-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">Sales Ledger</h3>
            </div>
            
            {sales.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
                <DollarSign className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-zinc-400 font-medium">Awaiting your first collector.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider">
                      <th className="pb-4 font-bold">Artwork</th>
                      <th className="pb-4 font-bold">Collector</th>
                      <th className="pb-4 font-bold text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {sales.map((tx) => (
                      <tr key={tx._id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="py-5 pr-4 font-black text-slate-900 dark:text-white">
                          {tx.artworkId?.title || 'Unknown Artwork'}
                        </td>
                        <td className="py-5 font-medium text-slate-500 dark:text-zinc-400">{tx.userEmail}</td>
                        <td className="py-5 text-right font-black text-green-600 dark:text-green-400">
                          +${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
