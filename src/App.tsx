import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage if exists
  useEffect(() => {
    const savedUser = localStorage.getItem('loverose_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('loverose_current_user', JSON.stringify(user));
    
    // Add current user to discoverable profiles to allow self editing
    const profiles = JSON.parse(localStorage.getItem('loverose_profiles') || '[]');
    if (!profiles.some((p: UserProfile) => p.uid === user.uid)) {
      profiles.push(user);
      localStorage.setItem('loverose_profiles', JSON.stringify(profiles));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loverose_current_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF1F2] flex flex-col items-center justify-center p-4">
        <span className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-rose-600 font-display font-semibold tracking-tight text-sm">Chargement du jardin...</span>
      </div>
    );
  }

  return (
    <>
      {currentUser ? (
        <Dashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthView onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}
