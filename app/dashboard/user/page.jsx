"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Crown, ShoppingBag, Settings, User as UserIcon } from 'lucide-react';
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

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 overflow-hidden relative border-4 border-white dark:border-slate-800 shadow-sm">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
                <label className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] font-bold py-1 text-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  EDIT
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-slate-500 mb-6">{user.email}</p>
              
              <div className="w-full pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Plan</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.subscriptionTier === 'premium' ? 'bg-yellow-100 text-yellow-700' : 
                    user.subscriptionTier === 'pro' ? 'bg-blue-100 text-blue-700' : 
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.subscriptionTier}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Purchases Left</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user.subscriptionTier === 'premium' ? 'Unlimited' : user.purchasesRemaining}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Upgrade Section */}
            {user.subscriptionTier !== 'premium' && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Crown className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Upgrade your experience</h3>
                  <p className="text-purple-100 mb-6 max-w-md">Get more artwork purchases and support the platform by upgrading your subscription tier.</p>
                  
                  <div className="flex gap-4">
                    {user.subscriptionTier === 'free' && (
                      <button 
                        onClick={() => handleSubscription('pro')}
                        className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Pro ($9.99/mo)
                      </button>
                    )}
                    <button 
                      onClick={() => handleSubscription('premium')}
                      className="px-6 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                      Premium ($19.99/mo)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Purchase History</h3>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">You haven't made any purchases yet.</p>
                  <Link href="/browse" className="text-purple-600 font-medium hover:underline">
                    Browse Artworks
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                        <th className="pb-3 font-medium">Item</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((tx) => (
                        <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                          <td className="py-4">
                            {tx.type === 'purchase' ? (
                              <Link href={`/artwork/${tx.artworkId?._id}`} className="font-medium text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                                {tx.artworkId?.title || 'Unknown Artwork'}
                              </Link>
                            ) : (
                              <span className="font-medium text-slate-900 dark:text-white">Subscription Upgrade</span>
                            )}
                          </td>
                          <td className="py-4 text-sm text-slate-500">
                            <span className={`px-2 py-1 rounded text-xs ${tx.type === 'purchase' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-slate-500">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right font-medium text-slate-900 dark:text-white">
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
