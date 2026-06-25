"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { ShoppingCart, Heart, Share2, MessageCircle, AlertCircle, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArtworkDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchArtworkAndComments = async () => {
      try {
        const [artRes, comRes] = await Promise.all([
          api.get(`/artworks/${id}`),
          api.get(`/comments/${id}`)
        ]);
        setArtwork(artRes.data);
        setComments(comRes.data);
        
        if (user) {
          const txRes = await api.get('/payments/history');
          const hasPurchased = txRes.data.some(tx => 
            tx.artworkId?._id === id && tx.type === 'purchase'
          );
          setPurchased(hasPurchased);
        }
      } catch (error) {
        setError('Failed to load artwork details. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchArtworkAndComments();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await api.post('/payments/create-checkout-session', { artworkId: id });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await api.delete(`/artworks/${id}`);
        router.push('/dashboard/artist');
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/${id}`, { comment: newComment });
      const addedComment = { ...res.data, userId: { _id: user.id, name: user.name, avatar: user.avatar } };
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950"><LoadingSpinner /></div>;
  if (error || !artwork) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950">
      <AlertCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-lg" />
      <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white mb-4">Artwork Not Found</h1>
      <p className="text-slate-600 dark:text-zinc-400 mb-8 font-medium text-lg text-center max-w-md">{error}</p>
      <button onClick={() => router.push('/browse')} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-black hover:scale-105 transition-transform shadow-xl">
        Return to Gallery
      </button>
    </div>
  );

  const isOwner = user && (user.id === artwork.artistId || user.role === 'admin');
  const canBuy = user && user.id !== artwork.artistId && !artwork.isSold;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-24 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-slate-200 dark:bg-zinc-800 group-hover:bg-slate-300 dark:group-hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to browsing
        </button>

        {/* Artwork Info Section */}
        <div className="bento-card overflow-hidden p-0 mb-12 flex flex-col lg:flex-row">
            
          {/* Image */}
          <div className="relative w-full lg:w-3/5 bg-slate-100/50 dark:bg-zinc-900/50 flex items-center justify-center min-h-[400px] lg:min-h-[600px] p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-200 dark:border-zinc-800">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="max-h-[70vh] max-w-full object-contain drop-shadow-2xl rounded-2xl"
            />
            {artwork.isSold && (
              <div className="absolute top-8 right-8 bg-red-500/90 backdrop-blur text-white text-sm font-black px-6 py-2 rounded-full shadow-lg shadow-red-500/25 transform rotate-12 border-2 border-red-400">
                SOLD OUT
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-between bg-white/50 dark:bg-zinc-950/50">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-black uppercase tracking-widest rounded-full">
                  {artwork.category}
                </span>
                <span className="text-slate-400 dark:text-zinc-500 text-sm font-bold">
                  {new Date(artwork.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black font-outfit text-slate-900 dark:text-white mb-4 leading-tight">
                {artwork.title}
              </h1>
              
              <p className="text-lg text-slate-500 dark:text-zinc-400 mb-8 font-medium">
                Created by <span className="font-black text-slate-900 dark:text-white pb-1 border-b-2 border-purple-500">{artwork.artistName}</span>
              </p>

              <div className="text-slate-600 dark:text-zinc-300 mb-10 leading-relaxed font-medium">
                <p>{artwork.description}</p>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-8 border-b-2 border-slate-200 dark:border-zinc-800 gap-6">
                <div>
                  <p className="text-sm font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Investment</p>
                  <p className="text-5xl font-black font-outfit text-slate-900 dark:text-white">${artwork.price}</p>
                </div>
                
                <div className="flex gap-3">
                  <button className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-105 shadow-sm">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:scale-105 shadow-sm">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                {canBuy && (
                  <button 
                    onClick={handlePurchase}
                    className="w-full flex items-center justify-center px-8 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-lg shadow-purple-500/25 transition-transform transform hover:-translate-y-1 text-lg"
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" /> Acquire Masterpiece
                  </button>
                )}

                {artwork.isSold && !isOwner && (
                  <button disabled className="w-full flex items-center justify-center px-8 py-5 bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 font-black rounded-xl cursor-not-allowed border-2 border-slate-300 dark:border-zinc-700 border-dashed">
                    Already Collected
                  </button>
                )}

                {isOwner && (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => router.push(`/dashboard/artist/edit/${id}`)}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 rounded-xl font-black transition-transform shadow-xl"
                    >
                      <Edit2 className="w-5 h-5 mr-2" /> Edit Details
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl font-black transition-colors"
                    >
                      <Trash2 className="w-5 h-5 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bento-card p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-black font-outfit text-slate-900 dark:text-white">Collector Reflections</h2>
          </div>

          {(purchased || user?.role === 'admin') ? (
            <form onSubmit={submitComment} className="mb-12">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts or interpretation of this piece..."
                className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-medium mb-4 min-h-[120px] resize-none transition-colors"
                required
              />
              <button 
                type="submit"
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5"
              >
                Post Reflection
              </button>
            </form>
          ) : (
            <div className="mb-12 p-8 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl text-center border-2 border-dashed border-slate-200 dark:border-zinc-800">
              <MessageCircle className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-zinc-400 font-medium">
                Only verified collectors can leave reflections on this artwork.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-slate-500 dark:text-zinc-500 font-medium text-center py-8">No reflections yet. Be the first to share your interpretation.</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="flex gap-5 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/50 group hover:border-purple-500/30 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">
                      {comment.userId?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-1">
                      <h4 className="font-black text-slate-900 dark:text-white text-lg">{comment.userId?.name || 'Unknown User'}</h4>
                      <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
