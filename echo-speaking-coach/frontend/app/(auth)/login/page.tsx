'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ArrowLeft, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { useAppStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAppStore((state) => state.setAuth);
  const theme = useAppStore((state) => state.settings.theme);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    setMounted(true);
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      // Store auth data
      setAuth(user, token);
      
      toast.success('Welcome back!');
      
      // Check if there was a redirect URL (came from practice)
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        // If user came from "Start Practicing" button, go to practice
        // Otherwise go to dashboard
        const cameFromPractice = sessionStorage.getItem('intendedAction') === 'practice';
        sessionStorage.removeItem('intendedAction');
        
        if (cameFromPractice) {
          router.push('/practice');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account for friends to try
  // const fillDemoAccount = () => {
  //   setFormData({
  //     email: 'demo@echo.ai',
  //     password: 'demo123'
  //   });
  //   toast.success('Demo credentials filled!');
  // };


  // Replace the existing fillDemoAccount function (around line 90) with this:
const fillDemoAccount = () => {
  setFormData({
    email: 'demo@echo.ai',
    password: 'demo123'
  });
  toast.success('Demo credentials filled! Logging in...');
  
  // Auto-submit after filling
  setTimeout(() => {
    handleDemoLogin();
  }, 500);
};

// Add this new function right after fillDemoAccount:
const handleDemoLogin = async () => {
  setIsLoading(true);
  try {
    const response = await authAPI.login({
      email: 'demo@echo.ai',
      password: 'demo123'
    });
    const { token, user } = response.data;
    
    // Store auth data
    setAuth(user, token);
    
    toast.success('Welcome to Echo Demo!');
    
    // Go directly to practice page for demo users
    router.push('/practice');
  } catch (error: any) {
    // If demo account doesn't exist in backend, create a mock session
    const mockUser = {
      id: 'demo-user',
      email: 'demo@echo.ai',
      name: 'Demo User'
    };
    const mockToken = 'demo-token-' + Date.now();
    
    setAuth(mockUser, mockToken);
    toast.success('Welcome to Echo Demo!');
    router.push('/practice');
  } finally {
    setIsLoading(false);
  }
};

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-all duration-500">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo and Home Button */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-2">
              <Link 
                href="/" 
                className="p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-2">
                <Mic className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  Echo
                </h1>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400">AI Public Speaking Coach</p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Welcome Back
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {/* Demo Account Button */}
              <button
                onClick={fillDemoAccount}
                className="w-full py-2 border border-purple-300 dark:border-purple-700 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm font-medium"
              >
                Use Demo Account
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    New to Echo?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link
                href="/register"
                className="block w-full text-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors font-medium"
              >
                Create an Account
              </Link>
            </div>
          </motion.div>

          {/* Features for new users */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm"
          >
            <p>Join thousands improving their speaking skills</p>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-1">
                <span className="text-green-500 dark:text-green-400">✓</span>
                <span>Real-time feedback</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-500 dark:text-green-400">✓</span>
                <span>Progress tracking</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}