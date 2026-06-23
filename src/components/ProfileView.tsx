import React, { useState } from 'react';
import { Camera, MapPin, User, Tag, Heart, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
}

const AVAILABLE_TAGS = [
  'Gastronomie', 'Musées', 'Randonnée', 'Photographie', 'Musique', 'Voyages',
  'Yoga', 'Concerts', 'Design', 'Sports nautiques', 'Plage', 'Cinéma',
  'Lecture', 'Cuisine', 'Jeux', 'Animaux', 'Salsa', 'Cuisine du monde', 'Festivals'
];

export default function ProfileView({ currentUser, onSave, onLogout }: ProfileViewProps) {
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [city, setCity] = useState(currentUser.city);
  const [gender, setGender] = useState(currentUser.gender);
  const [searchGender, setSearchGender] = useState(currentUser.searchGender);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [photos, setPhotos] = useState<string[]>(currentUser.photos || []);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  
  const [showNotification, setShowNotification] = useState(false);

  // Interest tags management
  const toggleInterest = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter(t => t !== tag));
    } else {
      if (interests.length < 6) {
        setInterests([...interests, tag]);
      } else {
        alert("Vous pouvez choisir jusqu'à 6 centres d'intérêt !");
      }
    }
  };

  // Add customized photo via URL
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrlInput.trim()) return;
    
    if (photos.length >= 6) {
      alert("Vous pouvez ajouter jusqu'à 6 photos maximum.");
      return;
    }

    setPhotos([...photos, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) {
      alert("Vous devez garder au moins 1 photo de profil principale !");
      return;
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      age: Number(age),
      city,
      gender,
      searchGender,
      bio,
      interests,
      photos
    };
    onSave(updated);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="w-full h-full bg-neutral-950 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neutral-900 text-white shrink-0">
        <h2 className="text-sm font-black uppercase tracking-wider">Mon Profil Rose</h2>
        <button 
          onClick={onLogout}
          className="text-[9px] bg-neutral-950 border border-white/15 px-2.5 py-1 rounded hover:bg-neutral-800 hover:text-rose-400 transition-colors font-mono uppercase tracking-widest"
        >
          Déconnexion
        </button>
      </div>

      {/* Main Form content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-neutral-950">
        {showNotification && (
          <div className="bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-bold p-3 rounded flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
            Votre profil a été mis à jour avec succès !
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Photo Management Section */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest">Galerie Photos ({photos.length}/6)</label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded overflow-hidden border border-white/10 bg-neutral-900 shadow-sm" style={{ contentVisibility: 'auto' }}>
                  <img src={url} alt="Aperçu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <div className="aspect-square rounded border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 bg-neutral-900/40">
                  <Camera className="w-5 h-5 mb-1 text-white/30" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Ajouter</span>
                </div>
              )}
            </div>

            {/* Photo URL Input Form */}
            {photos.length < 6 && (
              <div className="flex gap-2 mt-2">
                <input
                  type="url"
                  placeholder="Coller l'URL d'une nouvelle photo..."
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded bg-neutral-900 border border-white/10 text-xs focus:outline-none focus:border-rose-500 text-white placeholder-white/30"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-colors rounded-none"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>

          {/* Identity Parameters */}
          <div className="space-y-4 bg-neutral-900 p-4 rounded border border-white/10 shadow-sm">
            <div>
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Prénom</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-rose-500 text-xs text-white bg-neutral-950"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Âge</label>
                <input
                  type="number"
                  required
                  min="18"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-rose-500 text-xs text-white bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Ville</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded focus:outline-none focus:border-rose-500 text-xs text-white bg-neutral-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Votre genre</label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full px-2 py-2 border border-white/10 rounded text-xs text-white bg-neutral-950 focus:outline-none focus:border-rose-500"
                >
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Recherche</label>
                <select
                  value={searchGender}
                  onChange={(e: any) => setSearchGender(e.target.value)}
                  className="w-full px-2 py-2 border border-white/10 rounded text-xs text-white bg-neutral-950 focus:outline-none focus:border-rose-500"
                >
                  <option value="homme">Hommes</option>
                  <option value="femme">Femmes</option>
                  <option value="tous">Les deux</option>
                </select>
              </div>
            </div>
          </div>

          {/* Biography Section */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Ma description (300 car. max)</label>
            <textarea
              maxLength={300}
              rows={3}
              placeholder="Décrivez votre univers..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-white/10 rounded focus:outline-none focus:border-rose-500 text-xs text-white bg-neutral-900"
            />
          </div>

          {/* Interests Tags Selection */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Centres d'intérêt ({interests.length}/6)</label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-900 rounded border border-white/10 shadow-sm">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`text-[9px] px-2.5 py-1 rounded font-mono uppercase tracking-wider border transition-all ${
                      isSelected 
                        ? 'bg-rose-600 border-rose-600 text-white font-black' 
                        : 'bg-neutral-950 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Save Button */}
          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.15em] text-xs hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 rounded-none shadow-md mt-4"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
