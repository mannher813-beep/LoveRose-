import React, { useState } from 'react';
import { Heart, Mail, Lock, User, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(24);
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<'homme' | 'femme' | 'autre'>('femme');
  const [searchGender, setSearchGender] = useState<'homme' | 'femme' | 'tous'>('homme');
  
  const [step, setStep] = useState<1 | 2>(1); // 1 = details/credentials, 2 = simulated email verification

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Execute fast login
      const dummyUser: UserProfile = {
        uid: 'user_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0] || 'Rose',
        age: 26,
        city: 'Paris',
        gender: 'femme',
        searchGender: 'homme',
        bio: 'Bienvenue sur LoveRose ! Modifiez votre profil pour ajouter des photos et une description attractive.',
        photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'],
        interests: ['Cinéma', 'Café', 'Musique'],
        isPremium: false,
        dailyLikesLeft: 10,
        lastLikeReset: new Date().toISOString()
      };
      onAuthSuccess(dummyUser);
    } else {
      // In register mode, show simulation step for email verification!
      setStep(2);
    }
  };

  const handleVerificationComplete = () => {
    // Save registered user
    const newUser: UserProfile = {
      uid: 'user_' + Math.random().toString(36).substring(2, 9),
      name: name || 'Célibataire',
      age: Number(age) || 25,
      city: city || 'Paris',
      gender,
      searchGender,
      bio: 'Heureux de rejoindre LoveRose 🌹',
      photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'],
      interests: ['Cuisine', 'Voyages'],
      isPremium: false,
      dailyLikesLeft: 10,
      lastLikeReset: new Date().toISOString()
    };
    onAuthSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl border border-white/10 p-8 text-white">
        
        {/* App Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] mb-4 animate-rosefloat">
            <Heart className="w-9 h-9 fill-current text-white" />
          </div>
          <h1 className="text-3xl font-black font-display text-white tracking-tighter uppercase flex items-center gap-1">
            LOVE ROSE <span className="text-rose-500 underline decoration-rose-500 decoration-2 underline-offset-4">PWA</span>
          </h1>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-1.5">Le jardin des rencontres sincères</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleAction} className="space-y-4">
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-white/10 mb-4">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${isLogin ? 'bg-rose-600 text-white' : 'text-white/50 hover:text-white'}`}
                onClick={() => setIsLogin(true)}
              >
                Connexion
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${!isLogin ? 'bg-rose-600 text-white' : 'text-white/50 hover:text-white'}`}
                onClick={() => setIsLogin(false)}
              >
                Inscription
              </button>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="Votre prénom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Âge</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Lyon"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-white/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Votre genre</label>
                    <select
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="w-full px-3 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white"
                    >
                      <option value="femme">Femme</option>
                      <option value="homme">Homme</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Recherche</label>
                    <select
                      value={searchGender}
                      onChange={(e: any) => setSearchGender(e.target.value)}
                      className="w-full px-3 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white"
                    >
                      <option value="homme">Hommes</option>
                      <option value="femme">Femmes</option>
                      <option value="tous">Les deux</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.15em] hover:bg-rose-600 hover:text-white transition-all transform hover:scale-[1.02] rounded-none mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </button>
          </form>
        ) : (
          /* Step 2: Email verification Simulation */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-rose-950 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-800">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase tracking-wide text-white">Vérifiez votre boîte mail !</h2>
              <p className="text-sm text-white/70 px-4">
                Un lien d'activation sécurisé a été envoyé à <strong className="text-white">{email}</strong>.
              </p>
            </div>
            
            <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl text-xs text-white/70 leading-relaxed text-left">
              💡 <strong className="text-rose-400">Simulation de sécurité :</strong> Pour les besoins du test de l'application, nous simulons la validation du lien d'activation Firebase Auth. Cliquez ci-dessous pour activer et continuer.
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerificationComplete}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.15em] hover:bg-rose-600 hover:text-white transition-all rounded-none shadow-md"
              >
                Confirmer l'activation
              </button>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-white/50 hover:text-white underline tracking-wider uppercase block mx-auto"
              >
                Retour
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-[10px] text-white/40 tracking-wider uppercase">
          En continuant, vous acceptez nos <span className="underline cursor-pointer hover:text-white">CGU</span> et notre <span className="underline cursor-pointer hover:text-white">Politique RGPD</span>.
        </div>
      </div>
    </div>
  );
}
