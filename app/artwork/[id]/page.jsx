"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { ShoppingCart, Heart, Share2, MessageCircle, AlertCircle, Trash2, Edit2 } from 'lucide-react';
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
  const [purchased, setPurchased] = useState(false); // Check if user purchased

  useEffect(() => {
    const fetchArtworkAndComments = async () => {
      try {
        const [artRes, comRes] = await Promise.all([
          api.get(`/artworks/${id}`),
          api.get(`/comments/${id}`)
        ]);
        setArtwork(artRes.data);
        setComments(comRes.data);
        
        // If user is logged in, check if they purchased it
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
      // Add user info locally for immediate display
      const addedComment = { ...res.data, userId: { _id: user.id, name: user.name, avatar: user.avatar } };
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    }
  };

  if (loading) return <div className="min-h-screen pt-20"><LoadingSpinner /></div>;
  if (error || !artwork) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Artwork Not Found</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
      <button onClick={() => router.push('/browse')} className="px-6 py-2 bg-purple-600 text-white rounded-full">
        Back to Browse
      </button>
    </div>
  );

  const isOwner = user && (user.id === artwork.artistId || user.role === 'admin');
  const canBuy = user && user.id !== artwork.artistId && !artwork.isSold;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Artwork Info Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image */}
            <div className="relative h-96 lg:h-auto bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-lg"
              />
              {artwork.isSold && (
                <div className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                  SOLD OUT
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider rounded-full">
                  {artwork.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  Uploaded on {new Date(artwork.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                {artwork.title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Created by <span className="font-bold text-slate-900 dark:text-white border-b-2 border-purple-500">{artwork.artistName}</span>
              </p>

              <div className="prose prose-slate dark:prose-invert mb-8 max-w-none">
                <p>{artwork.description}</p>
              </div>

              <div className="flex items-end justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Price</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">${artwork.price}</p>
                </div>
                
                <div className="flex gap-4">
                  <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                {canBuy && (
                  <button 
                    onClick={handlePurchase}
                    className="flex-1 min-w-[200px] flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" /> Purchase Artwork
                  </button>
                )}

                {artwork.isSold && !isOwner && (
                  <button disabled className="flex-1 min-w-[200px] flex items-center justify-center px-8 py-4 bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-xl cursor-not-allowed">
                    Unavailable (Sold)
                  </button>
                )}

                {isOwner && (
                  <>
                    <button 
                      onClick={() => router.push(`/dashboard/artist/edit/${id}`)}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl font-bold transition-colors"
                    >
                      <Edit2 className="w-5 h-5 mr-2" /> Edit
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 rounded-xl font-bold transition-colors"
                    >
                      <Trash2 className="w-5 h-5 mr-2" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Collector Comments</h2>
          </div>

          {(purchased || user?.role === 'admin') ? (
            <form onSubmit={submitComment} className="mb-10">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this piece..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 min-h-[100px]"
                required
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-10 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center border border-dashed border-slate-300 dark:border-slate-600">
              <p className="text-slate-600 dark:text-slate-400">
                You must purchase this artwork to leave a comment.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-slate-500 italic text-center py-4">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center font-bold text-lg">
                      {comment.userId?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{comment.userId?.name || 'Unknown User'}</h4>
                      <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{comment.comment}</p>
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
