"use client";
import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong!</h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
        
        <button 
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors w-full sm:w-auto"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
}
