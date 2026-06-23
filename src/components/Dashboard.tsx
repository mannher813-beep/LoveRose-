import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Star, User, Shield, Download, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile, Match } from '../types';
import { dbService } from '../services/firebase';
import SwipeCard from './SwipeCard';
import MessagesView from './MessagesView';
import PremiumView from './PremiumView';
import ProfileView from './ProfileView';
import LegalView from './LegalView';

interface DashboardProps {
  currentUser: UserProfile;
  onLogout: () => void;
}

export default function Dashboard({ currentUser, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'chat' | 'premium' | 'profile' | 'legal'>('discover');
  
  // States for Discovery Swipe
  const [discoverableProfiles, setDiscoverableProfiles] = useState<UserProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loadingDiscovery, setLoadingDiscovery] = useState(true);
  
  // Matches state
  const [matches, setMatches] = useState<Match[]>([]);
  
  // PWA Installation prompt event holder
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Match Confetti popup state
  const [activeMatchModal, setActiveMatchModal] = useState<{
    show: boolean;
    partnerName: string;
    partnerPhoto: string;
  } | null>(null);

  // Load Discoverable profiles & User's matches
  const reloadData = async () => {
    setLoadingDiscovery(true);
    try {
      const list = await dbService.getDiscoverableProfiles(currentUser);
      setDiscoverableProfiles(list);
      setCurrentProfileIndex(0);

      const userMatches = await dbService.getMatches(currentUser.uid);
      setMatches(userMatches);
    } catch (e) {
      console.error("Error loading profiles or matches", e);
    } finally {
      setLoadingDiscovery(false);
    }
  };

  useEffect(() => {
    reloadData();

    // Set up native PWA install listener
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [currentUser]);

  // Handle Swipe actions
  const handleSwipe = async (type: 'like' | 'pass' | 'superlike') => {
    const activeProfile = discoverableProfiles[currentProfileIndex];
    if (!activeProfile) return;

    // Check Premium limit (if not premium, we restrict swipe to 10/day)
    if (!currentUser.isPremium && type !== 'pass') {
      if (currentUser.dailyLikesLeft <= 0) {
        alert("👑 Vous avez atteint votre limite de 10 likes gratuits aujourd'hui. Passez Premium pour continuer à swiper à l'infini !");
        setActiveTab('premium');
        return;
      }
      currentUser.dailyLikesLeft -= 1;
    }

    // Perform swipe action
    const result = await dbService.swipe(currentUser.uid, activeProfile.uid, type);

    if (result.isMatch) {
      // Trigger "It's a Match!" visual screen overlay
      setActiveMatchModal({
        show: true,
        partnerName: activeProfile.name,
        partnerPhoto: activeProfile.photos?.[0] || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'
      });
      
      // Update local matches list
      const updatedMatches = await dbService.getMatches(currentUser.uid);
      setMatches(updatedMatches);
    }

    // Go to next profile card
    setCurrentProfileIndex((prev) => prev + 1);
  };

  // Perform custom App install
  const triggerPwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  // Update current user profile inside core state
  const handleProfileSave = (updatedProfile: UserProfile) => {
    Object.assign(currentUser, updatedProfile);
    reloadData();
  };

  // Upgraded Premium callback
  const handleUpgradeSuccess = (updatedProfile: UserProfile) => {
    Object.assign(currentUser, updatedProfile);
    reloadData();
  };

  const handleReport = (uid: string) => {
    alert("Merci d'avoir signalé ce profil. Notre équipe de modération va l'examiner sous 24h pour préserver la sécurité de LoveRose.");
    setCurrentProfileIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-4 text-white">
      
      {/* Shell mockup representing complete mobile screen */}
      <div className="w-full max-w-sm h-[660px] bg-neutral-900 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-neutral-800 overflow-hidden flex flex-col justify-between relative">
        
        {/* Custom App Install Header Banner */}
        {showInstallBanner && (
          <div className="bg-rose-600 text-white px-4 py-2.5 text-xs flex justify-between items-center z-30 shrink-0 font-mono uppercase tracking-wider border-b border-white/10">
            <span className="flex items-center gap-1.5 font-bold">
              <Download className="w-4 h-4 animate-bounce" /> INSTALL LOVE ROSE
            </span>
            <div className="flex gap-2">
              <button 
                onClick={triggerPwaInstall}
                className="bg-white text-black px-2.5 py-0.5 rounded-none font-black shadow hover:bg-rose-600 hover:text-white transition-colors uppercase text-[10px]"
              >
                INSTALL
              </button>
              <button onClick={() => setShowInstallBanner(false)} className="text-white/80 font-bold hover:text-white px-1">✕</button>
            </div>
          </div>
        )}

        {/* Content Box */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* DISCOVER SWIPE VIEW */}
          {activeTab === 'discover' && (
            <div className="h-full flex flex-col items-center justify-between p-4 bg-neutral-950">
              
              {/* Top Navigation Row */}
              <div className="w-full flex justify-between items-center px-2 py-1 shrink-0">
                <span className="text-xl font-black font-display text-white tracking-tighter uppercase">
                  LOVE <span className="text-rose-500 underline decoration-rose-500 decoration-2 underline-offset-2">ROSE</span>
                </span>
                <span className="text-[9px] bg-neutral-900 border border-white/10 text-rose-400 font-mono uppercase tracking-widest px-2.5 py-1 rounded">
                  {currentUser.isPremium ? '👑 PREMIUM' : `LIKES : ${currentUser.dailyLikesLeft}/10`}
                </span>
              </div>

              {/* Core Deck Canvas */}
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                {loadingDiscovery ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Recherche de profils...</span>
                  </div>
                ) : currentProfileIndex < discoverableProfiles.length ? (
                  <SwipeCard
                    profile={discoverableProfiles[currentProfileIndex]}
                    currentUser={currentUser}
                    onSwipe={handleSwipe}
                    onReport={handleReport}
                  />
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 bg-rose-950/40 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-800/50">
                      <Sparkles className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">C'est tout pour aujourd'hui !</h3>
                      <p className="text-[11px] text-white/60 px-4 leading-relaxed">
                        Revenez plus tard ou élargissez vos critères pour découvrir d'autres profils magnifiques à proximité.
                      </p>
                    </div>
                    <button
                      onClick={() => { setCurrentProfileIndex(0); }}
                      className="px-5 py-2.5 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-none shadow hover:bg-rose-700 transition-colors"
                    >
                      Recommencer
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CHAT / MESSAGES VIEW */}
          {activeTab === 'chat' && (
            <MessagesView
              currentUser={currentUser}
              matches={matches}
              onBackToDiscovery={() => setActiveTab('discover')}
            />
          )}

          {/* PREMIUM UPGRADE VIEW */}
          {activeTab === 'premium' && (
            <PremiumView
              currentUser={currentUser}
              onUpgradeSuccess={handleUpgradeSuccess}
            />
          )}

          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onSave={handleProfileSave}
              onLogout={onLogout}
            />
          )}

          {/* LEGAL / COMPLIANCE VIEW */}
          {activeTab === 'legal' && (
            <LegalView />
          )}
        </div>

        {/* BOTTOM NAVIGATION TAB BAR */}
        <div className="h-16 border-t border-white/10 bg-neutral-950 flex justify-around items-center px-1 shrink-0 z-20">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded transition-all ${
              activeTab === 'discover' ? 'text-rose-500 scale-105 font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${activeTab === 'discover' ? 'fill-current' : ''}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider">SWIPE</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded relative transition-all ${
              activeTab === 'chat' ? 'text-rose-500 scale-105 font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">MESSAGES</span>
            {matches.length > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-rose-600 text-white rounded-full text-[8px] flex items-center justify-center font-bold border border-neutral-950">
                {matches.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('premium')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded transition-all ${
              activeTab === 'premium' ? 'text-rose-500 scale-105 font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            <Star className={`w-5 h-5 ${activeTab === 'premium' ? 'fill-current' : ''}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider">VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded transition-all ${
              activeTab === 'profile' ? 'text-rose-500 scale-105 font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">PROFIL</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded transition-all ${
              activeTab === 'legal' ? 'text-rose-500 scale-105 font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">LEGAL</span>
          </button>
        </div>

        {/* ITS A MATCH popup visual overlay */}
        {activeMatchModal?.show && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
            <Sparkles className="w-12 h-12 text-rose-500 animate-rosefloat mb-4" />
            
            <h2 className="text-3xl font-black font-display text-white tracking-tighter uppercase leading-none mb-2">
              IT'S A MATCH ! 🌹
            </h2>
            <p className="text-rose-200 text-xs px-4 mb-6">
              Vous et <strong>{activeMatchModal.partnerName}</strong> vous plaisez mutuellement.
            </p>

            {/* Circular Avatars */}
            <div className="flex items-center gap-4 mb-8">
              <img
                src={currentUser.photos?.[0]}
                alt="Me"
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xl"
                referrerPolicy="no-referrer"
              />
              <Heart className="w-8 h-8 text-rose-500 fill-current animate-heartbeat" />
              <img
                src={activeMatchModal.partnerPhoto}
                alt={activeMatchModal.partnerName}
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={() => {
                  setActiveMatchModal(null);
                  setActiveTab('chat');
                }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider text-xs rounded-none transition-colors"
              >
                Envoyer un message
              </button>
              <button
                onClick={() => setActiveMatchModal(null)}
                className="w-full py-2.5 bg-transparent hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
