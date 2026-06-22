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
          api.get('/artworks', { params: { limit: 100 } }), // Or admin specific endpoint to get ALL including sold
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

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 md:min-h-[calc(100vh-4rem)] shrink-0">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-600" /> Admin Panel
        </h2>
        
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Activity className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Users className="w-5 h-5" /> Users
          </button>
          <button 
            onClick={() => setActiveTab('artworks')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'artworks' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <ImageIcon className="w-5 h-5" /> Artworks
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'transactions' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <DollarSign className="w-5 h-5" /> Transactions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Artists</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalArtists}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Artworks Sold</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalArtworksSold}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">${stats?.totalRevenue?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Can add charts here based on stats.artworksByCategory */}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-in fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Manage Users</h1>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr className="text-slate-500 dark:text-slate-400 text-sm">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Tier</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                        <td className="p-4 text-slate-500">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' : 
                            u.role === 'artist' ? 'bg-purple-100 text-purple-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500 uppercase">{u.subscriptionTier}</td>
                        <td className="p-4">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={u._id === user.id} // Cannot change own role
                            className="bg-transparent border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
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
          <div className="animate-in fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Manage Artworks</h1>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr className="text-slate-500 dark:text-slate-400 text-sm">
                      <th className="p-4 font-medium">Artwork</th>
                      <th className="p-4 font-medium">Artist</th>
                      <th className="p-4 font-medium">Price</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {artworks.map(art => (
                      <tr key={art._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                          <img src={art.image} alt="" className="w-10 h-10 rounded object-cover" />
                          {art.title}
                        </td>
                        <td className="p-4 text-slate-500">{art.artistName}</td>
                        <td className="p-4 font-medium">${art.price}</td>
                        <td className="p-4">
                          {art.isSold ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Sold</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Available</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleDeleteArtwork(art._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
          <div className="animate-in fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">All Transactions</h1>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr className="text-slate-500 dark:text-slate-400 text-sm">
                      <th className="p-4 font-medium">ID / Date</th>
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">User</th>
                      <th className="p-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {transactions.map(tx => (
                      <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white truncate w-32 md:w-auto" title={tx.transactionId}>{tx.transactionId}</div>
                          <div className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs uppercase font-medium ${tx.type === 'purchase' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{tx.userEmail}</td>
                        <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
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
