'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Camera, User, Mail, Settings, 
  Bell, Target, LogOut, Save, Edit2, Award, TrendingUp 
} from 'lucide-react';
import { useAppStore } from '@/store';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = useAppStore((state) => state.user);
  const settings = useAppStore((state) => state.settings);
  const userStats = useAppStore((state) => state.userStats);
  const achievements = useAppStore((state) => state.achievements);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const updateUser = useAppStore((state) => state.updateUser);
  const logout = useAppStore((state) => state.logout);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  
  const [localSettings, setLocalSettings] = useState({
    targetPace: settings.targetPace || 150,
    dailyGoal: settings.dailyGoal || 1,
    weeklyGoal: settings.weeklyGoal || 5,
    emailNotifications: settings.emailNotifications ?? true,
    soundEffects: settings.soundEffects ?? true
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser({
      ...user!,
      name: profileData.name,
      bio: profileData.bio,
      avatar: profileData.avatar
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    toast.success('Settings saved!');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-bold">Profile</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-1">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-gray-900"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="text-2xl font-bold bg-gray-700/50 rounded-lg px-3 py-1 w-full"
                    />
                  ) : (
                    <h3 className="text-2xl font-bold">{profileData.name}</h3>
                  )}
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {profileData.email}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-gray-700/50 rounded-lg px-4 py-3 resize-none h-24"
                  />
                ) : (
                  <p className="text-gray-300">
                    {profileData.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Sessions</p>
                  <p className="text-2xl font-bold">{userStats.totalSessions}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Avg Score</p>
                  <p className="text-2xl font-bold">{userStats.averageScore}%</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Achievements</p>
                  <p className="text-2xl font-bold">{unlockedAchievements}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Improvement</p>
                  <p className="text-2xl font-bold text-green-400">+{userStats.improvement}%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Settings
              </h2>

              {/* Target Pace */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Target Pace (WPM)
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={localSettings.targetPace}
                  onChange={(e) => setLocalSettings({ ...localSettings, targetPace: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>100</span>
                  <span className="text-purple-400 font-semibold">{localSettings.targetPace}</span>
                  <span>200</span>
                </div>
              </div>

              {/* Daily Goal */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Daily Goal (sessions)
                </label>
                <select
                  value={localSettings.dailyGoal}
                  onChange={(e) => setLocalSettings({ ...localSettings, dailyGoal: Number(e.target.value) })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value={1}>1 session</option>
                  <option value={2}>2 sessions</option>
                  <option value={3}>3 sessions</option>
                  <option value={5}>5 sessions</option>
                </select>
              </div>

              {/* Weekly Goal */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Weekly Goal (sessions)
                </label>
                <select
                  value={localSettings.weeklyGoal}
                  onChange={(e) => setLocalSettings({ ...localSettings, weeklyGoal: Number(e.target.value) })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value={3}>3 sessions</option>
                  <option value={5}>5 sessions</option>
                  <option value={7}>7 sessions</option>
                  <option value={10}>10 sessions</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="mb-6">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Email Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications}
                    onChange={(e) => setLocalSettings({ ...localSettings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
              </div>

              {/* Sound Effects */}
              <div className="mb-8">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Sound Effects</span>
                  <input
                    type="checkbox"
                    checked={localSettings.soundEffects}
                    onChange={(e) => setLocalSettings({ ...localSettings, soundEffects: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}