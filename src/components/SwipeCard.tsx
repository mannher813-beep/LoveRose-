import React, { useState } from 'react';
import { Heart, X, Star, MapPin, Zap, Info, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface SwipeCardProps {
  profile: UserProfile;
  currentUser: UserProfile;
  onSwipe: (type: 'like' | 'pass' | 'superlike') => void;
  onReport: (uid: string) => void;
}

export default function SwipeCard({ profile, currentUser, onSwipe, onReport }: SwipeCardProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showBioDetails, setShowBioDetails] = useState(false);

  const handleSwipeAction = (type: 'like' | 'pass' | 'superlike') => {
    // Prevent double tapping
    if (slideDirection) return;

    // Set slide direction for CSS transition
    if (type === 'pass') setSlideDirection('left');
    else if (type === 'like') setSlideDirection('right');
    else if (type === 'superlike') setSlideDirection('up');

    // Callback after animation completes
    setTimeout(() => {
      onSwipe(type);
      setSlideDirection(null);
      setActivePhotoIndex(0);
      setShowBioDetails(false);
    }, 450);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile.photos && profile.photos.length > 1) {
      setActivePhotoIndex((prev) => (prev + 1) % profile.photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile.photos && profile.photos.length > 1) {
      setActivePhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  // Safe checks for tags and photos
  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'];
  
  const interests = profile.interests || [];

  return (
    <div className="relative w-full max-w-sm h-[530px] flex flex-col justify-between">
      {/* Card container */}
      <div 
        className={`relative w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 transition-all duration-300 ease-out transform ${
          slideDirection === 'left' ? '-translate-x-[150%] rotate-[-20deg] opacity-0' :
          slideDirection === 'right' ? 'translate-x-[150%] rotate-[20deg] opacity-0' :
          slideDirection === 'up' ? '-translate-y-[150%] scale-75 opacity-0' : 'translate-x-0 rotate-0 scale-100'
        }`}
      >
        {/* Photo Canvas */}
        <div className="absolute inset-0 bg-neutral-950">
          <img 
            src={photos[activePhotoIndex]} 
            alt={profile.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Photo Taps Left/Right */}
        <div className="absolute inset-y-0 inset-x-0 flex justify-between">
          <button 
            onClick={prevPhoto} 
            className="w-1/2 h-full cursor-left focus:outline-none" 
            aria-label="Photo précédente"
          />
          <button 
            onClick={nextPhoto} 
            className="w-1/2 h-full cursor-right focus:outline-none" 
            aria-label="Photo suivante"
          />
        </div>

        {/* Top Indicators */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
          {/* Progress Indicators */}
          <div className="flex gap-1 flex-1 mr-4">
            {photos.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all ${i === activePhotoIndex ? 'bg-white' : 'bg-white/30'}`} 
                style={{ contentVisibility: 'auto' }}
              />
            ))}
          </div>

          {/* Premium Tag */}
          {profile.isPremium && (
            <span className="flex items-center gap-1 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
              <Zap className="w-3 h-3 fill-current" /> VIP
            </span>
          )}
        </div>

        {/* Profile Core Details Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-xl font-black font-display tracking-tight uppercase">{profile.name}</h2>
            <span className="text-sm font-medium text-white/80">{profile.age} ans</span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-rose-500" /> {profile.city}
          </p>

          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed mb-3 font-normal">
            {profile.bio}
          </p>

          {/* Interests Tags */}
          <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
            {interests.map((tag) => (
              <span key={tag} className="text-[9px] bg-white/10 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded font-mono uppercase tracking-wider text-white/90">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Extra buttons (Detail Toggle & Report) */}
        <div className="absolute top-16 right-4 flex flex-col gap-2 z-10">
          <button 
            onClick={() => setShowBioDetails(!showBioDetails)} 
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10"
            title="Détails"
          >
            <Info className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onReport(profile.uid)} 
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-red-400 flex items-center justify-center hover:bg-black/60 hover:text-red-300 transition-colors border border-white/10"
            title="Signaler"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Info Modal Layer */}
        {showBioDetails && (
          <div className="absolute inset-0 bg-neutral-950 z-20 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar text-white">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{profile.name}, {profile.age} ans</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {profile.city}
                  </p>
                </div>
                <button 
                  onClick={() => setShowBioDetails(false)}
                  className="px-3 py-1 bg-neutral-900 border border-white/10 text-white font-mono uppercase tracking-widest text-[9px] rounded hover:bg-neutral-800 transition-all"
                >
                  Fermer
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Ma bio</h4>
                  <p className="text-xs text-white/80 leading-relaxed bg-neutral-900 p-3 rounded border border-white/10">
                    {profile.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Intérêts</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((tag) => (
                      <span key={tag} className="text-[9px] bg-neutral-900 text-rose-400 px-2.5 py-1 rounded font-mono uppercase tracking-wider border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900 border border-amber-500/20 p-3 rounded flex items-start gap-2.5">
                  <div className="p-1 bg-amber-500 text-black rounded">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-amber-500">Cercle Privé LoveRose</h5>
                    <p className="text-[11px] text-white/75 mt-0.5">Ce profil recherche des rencontres sérieuses et authentiques certifiées.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Swipe control actions bar */}
      <div className="flex justify-center items-center gap-6 pb-2">
        <button
          onClick={() => handleSwipeAction('pass')}
          className="w-14 h-14 rounded-full bg-neutral-950 border border-white/10 text-white flex items-center justify-center shadow-lg hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all"
          title="Passer"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => handleSwipeAction('superlike')}
          className="w-12 h-12 rounded-full bg-neutral-950 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-lg hover:border-amber-500/50 hover:bg-neutral-900 active:scale-95 transition-all"
          title="Super Like"
        >
          <Star className="w-5 h-5 fill-current" />
        </button>

        <button
          onClick={() => handleSwipeAction('like')}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-rose-600 hover:text-white active:scale-95 transition-all"
          title="Liker"
        >
          <Heart className="w-6 h-6 stroke-[2.5] fill-current" />
        </button>
      </div>
    </div>
  );
}
