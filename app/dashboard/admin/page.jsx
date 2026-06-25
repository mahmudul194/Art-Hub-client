"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Users, Image as ImageIcon, DollarSign, Activity, Trash2, Shield, Palette } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, usersRes, artRes, transRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/users/admin'),
          api.get('/artworks', { params: { limit: 100 } }),
          api.get('/admin/transactions')
        ]);
        
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setArtworks(artRes.data.artworks);
        setTransactions(transRes.data);
      } catch (err) {
        console.error('Admin fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/admin/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? res.data : u));
    } catch (err) {
      alert('Role update failed');
    }
  };

  const handleDeleteArtwork = async (id) => {
    if (window.confirm('Delete this artwork from the platform?')) {
      try {
        await api.delete(`/artworks/${id}`);
        setArtworks(artworks.filter(a => a._id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-24 pb-12 relative overflow-hidden flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

      {/* Sidebar */}
      <div className="w-full md:w-72 shrink-0 relative z-10">
        <div className="bento-card p-6 md:sticky md:top-24">
          <h2 className="text-2xl font-black font-outfit text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            Command Center
          </h2>
          
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
            {[
              { id: 'overview', icon: Activity, label: 'Overview' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'artworks', icon: ImageIcon, label: 'Artworks' },
              { id: 'transactions', icon: DollarSign, label: 'Transactions' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all whitespace-nowrap font-bold text-sm ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg scale-[1.02]' 
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 max-w-6xl">
        
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">Platform Overview</h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2">Real-time metrics and analytics.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'blue' },
                { label: 'Total Artists', value: stats?.totalArtists, icon: Palette, color: 'purple' },
                { label: 'Artworks Sold', value: stats?.totalArtworksSold, icon: ImageIcon, color: 'pink' },
                { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2)}`, icon: DollarSign, color: 'green' },
              ].map((stat, i) => (
                <div key={i} className="bento-card p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group hover:border-purple-500/30 transition-colors relative overflow-hidden">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-colors`} />
                  <div className={`p-4 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-2xl w-fit mb-4`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-zinc-400 font-bold mb-1">{stat.label}</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white mb-8">Manage Users</h1>
            <div className="bento-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-zinc-900/50 border-b-2 border-slate-100 dark:border-zinc-800">
                    <tr className="text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider">
                      <th className="p-6 font-bold">User</th>
                      <th className="p-6 font-bold">Role</th>
                      <th className="p-6 font-bold">Tier</th>
                      <th className="p-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {users.map(u => (
                      <tr key={u._id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="p-6">
                          <p className="font-black text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{u.email}</p>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                            u.role === 'artist' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{u.subscriptionTier}</td>
                        <td className="p-6 text-right">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={u._id === user.id}
                            className="bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                          >
                            <option value="user">User</option>
                            <option value="artist">Artist</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artworks' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white mb-8">Manage Artworks</h1>
            <div className="bento-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-zinc-900/50 border-b-2 border-slate-100 dark:border-zinc-800">
                    <tr className="text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider">
                      <th className="p-6 font-bold">Artwork</th>
                      <th className="p-6 font-bold">Artist</th>
                      <th className="p-6 font-bold">Status</th>
                      <th className="p-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {artworks.map(art => (
                      <tr key={art._id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="p-6 flex items-center gap-4">
                          <img src={art.image} alt="" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                          <div>
                            <p className="font-black text-slate-900 dark:text-white">{art.title}</p>
                            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">${art.price}</p>
                          </div>
                        </td>
                        <td className="p-6 font-medium text-slate-600 dark:text-zinc-300">{art.artistName}</td>
                        <td className="p-6">
                          {art.isSold ? (
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs rounded-full font-bold uppercase tracking-wider">Sold</span>
                          ) : (
                            <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-bold uppercase tracking-wider">Available</span>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDeleteArtwork(art._id)}
                            className="p-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors inline-block"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white mb-8">All Transactions</h1>
            <div className="bento-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-zinc-900/50 border-b-2 border-slate-100 dark:border-zinc-800">
                    <tr className="text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider">
                      <th className="p-6 font-bold">Transaction</th>
                      <th className="p-6 font-bold">User</th>
                      <th className="p-6 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {transactions.map(tx => (
                      <tr key={tx._id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${tx.type === 'purchase' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                              {tx.type}
                            </span>
                            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">{new Date(tx.date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white truncate w-48 md:w-auto" title={tx.transactionId}>{tx.transactionId}</div>
                        </td>
                        <td className="p-6 font-medium text-slate-600 dark:text-zinc-300">{tx.userEmail}</td>
                        <td className="p-6 text-right font-black text-xl text-slate-900 dark:text-white">
                          ${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
