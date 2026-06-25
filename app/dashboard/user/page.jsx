"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Crown, ShoppingBag, Settings, User as UserIcon, Camera, PackageOpen, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'user') {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await api.get('/payments/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, router]);

  const handleSubscription = async (tier) => {
    try {
      const res = await api.post('/payments/subscription', { tier });
      window.location.href = res.data.url;
    } catch (err) {
      alert('Failed to start subscription process');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
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
        const updateRes = await api.put('/users/profile', { avatar: data.data.display_url });
        setUser(updateRes.data);
      } else {
        alert('Image upload failed: ' + data.error.message);
      }
    } catch (err) {
      alert('Error uploading avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 dark:text-white tracking-tight mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Profile Card (Col 1) */}
          <div className="bento-card p-8 flex flex-col items-center text-center relative group lg:col-span-1">
            <div className="relative w-32 h-32 mb-6 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse blur-md opacity-50" />
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl relative z-10 bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-slate-400" />
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <LoadingSpinner />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
            </div>
            
            <h2 className="text-2xl font-black font-outfit text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-slate-500 dark:text-zinc-400 font-medium mb-8">{user.email}</p>
            
            <div className="w-full space-y-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Plan</span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.subscriptionTier === 'premium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                  user.subscriptionTier === 'pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                  'bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-slate-300'
                }`}>
                  {user.subscriptionTier}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-pink-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Purchases Left</span>
                </div>
                <span className="font-black text-lg text-slate-900 dark:text-white">
                  {user.subscriptionTier === 'premium' ? '∞' : user.purchasesRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Area (Col 2 & 3) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            
            {/* Upgrade Section */}
            {user.subscriptionTier !== 'premium' && (
              <div className="bento-card p-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500" />
                <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                  <Crown className="w-48 h-48 text-white" />
                </div>
                
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                  <div className="text-white">
                    <h3 className="text-3xl font-black font-outfit mb-3">Upgrade Your Journey</h3>
                    <p className="text-white/80 font-medium text-lg max-w-md">Unlock more artwork purchases and support emerging artists by upgrading your tier.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                    {user.subscriptionTier === 'free' && (
                      <button 
                        onClick={() => handleSubscription('pro')}
                        className="px-8 py-4 glass-panel border border-white/20 text-white font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-all shadow-xl backdrop-blur-md"
                      >
                        Pro ($9.99)
                      </button>
                    )}
                    <button 
                      onClick={() => handleSubscription('premium')}
                      className="px-8 py-4 bg-white text-zinc-900 font-black rounded-2xl hover:scale-105 transition-all shadow-xl"
                    >
                      Premium ($19.99)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase History */}
            <div className="bento-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <PackageOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">Purchase History</h3>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-zinc-400 font-medium mb-6">Your collection is waiting to be started.</p>
                  <Link href="/browse" className="inline-flex px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg">
                    Browse Artworks
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider">
                        <th className="pb-4 font-bold">Item</th>
                        <th className="pb-4 font-bold">Type</th>
                        <th className="pb-4 font-bold">Date</th>
                        <th className="pb-4 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {history.map((tx) => (
                        <tr key={tx._id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="py-5 pr-4">
                            {tx.type === 'purchase' ? (
                              <Link href={`/artwork/${tx.artworkId?._id}`} className="font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                {tx.artworkId?.title || 'Unknown Artwork'}
                              </Link>
                            ) : (
                              <span className="font-bold text-slate-900 dark:text-white">Subscription Upgrade</span>
                            )}
                          </td>
                          <td className="py-5">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${tx.type === 'purchase' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-5 text-sm font-medium text-slate-500 dark:text-zinc-400">
                            {new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-5 text-right font-black text-slate-900 dark:text-white">
                            ${tx.amount.toFixed(2)}
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
    </div>
  );
}
