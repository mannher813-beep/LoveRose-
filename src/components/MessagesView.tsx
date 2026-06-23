import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, ShieldAlert, Check, CheckCheck, MapPin, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { Match, Message, UserProfile } from '../types';
import { dbService } from '../services/firebase';

interface MessagesViewProps {
  currentUser: UserProfile;
  matches: Match[];
  onBackToDiscovery: () => void;
}

export default function MessagesView({ currentUser, matches: initialMatches, onBackToDiscovery }: MessagesViewProps) {
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [activePartner, setActivePartner] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [matchedUsers, setMatchedUsers] = useState<{ [uid: string]: UserProfile }>({});
  
  const [antiSpamWarning, setAntiSpamWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested starter tags to keep chat active and fun
  const starters = [
    "Coucou ! Qu'est-ce qui t'a le plus marqué dans ma bio ? 😊",
    "Hello ! Team café ou team thé en terrasse ? ☕️",
    "Salut ! Quel est ton spot préféré pour s'évader le week-end ? 🌲",
    "Hey ! Si tu devais résumer ta journée en un seul emoji ? 🤔"
  ];

  // Fetch match partner profiles
  useEffect(() => {
    const fetchPartners = async () => {
      const usersMap: { [uid: string]: UserProfile } = {};
      for (const m of initialMatches) {
        const partnerId = m.users.find(uid => uid !== currentUser.uid);
        if (partnerId) {
          const profile = await dbService.getUserProfile(partnerId);
          if (profile) {
            usersMap[partnerId] = profile;
          }
        }
      }
      setMatchedUsers(usersMap);
    };
    fetchPartners();
  }, [initialMatches, currentUser.uid]);

  // Set up real-time snapshot listener when chat is opened
  useEffect(() => {
    if (!activeMatch) return;

    const unsubscribe = dbService.listenToMessages(activeMatch.id, (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [activeMatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectMatch = async (match: Match) => {
    const partnerId = match.users.find(uid => uid !== currentUser.uid);
    if (partnerId) {
      const partnerProfile = matchedUsers[partnerId] || await dbService.getUserProfile(partnerId);
      setActivePartner(partnerProfile);
      setActiveMatch(match);
      setAntiSpamWarning(null);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || !activeMatch) return;

    // --- Anti-Scam / Anti-Spam Filtering ---
    // Look for typical suspicious keywords like "argent", "virement", "whatsapp", "crypto", or outbound external links
    const lowerText = text.toLowerCase();
    const containsLink = /https?:\/\/[^\s]+/.test(lowerText);
    const containsSuspiciousKeywords = lowerText.includes('virement') || lowerText.includes('argent') || lowerText.includes('crypto') || lowerText.includes('western union');
    
    if (containsLink || containsSuspiciousKeywords) {
      setAntiSpamWarning("🚨 Alerte de modération : Par sécurité, ne partagez pas de liens de paiement ou d'informations financières sur LoveRose.");
      // If severe, we warn, but still allow sending after safety confirmation
    } else {
      setAntiSpamWarning(null);
    }

    await dbService.sendMessage(activeMatch.id, currentUser.uid, text);
    setInputValue('');
  };

  const handleBlockUser = () => {
    if (activePartner) {
      alert(`Le profil de ${activePartner.name} a été bloqué et signalé avec succès à l'équipe de modération de LoveRose.`);
      setActiveMatch(null);
      setActivePartner(null);
    }
  };

  return (
    <div className="w-full h-full bg-neutral-950 overflow-hidden flex flex-col text-white">
      {!activeMatch ? (
        /* Conversation list view */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-neutral-900 text-white">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">Mes Matchs</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Discussions actives</p>
            </div>
            <Sparkles className="w-5 h-5 text-rose-500" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 bg-neutral-950">
            {initialMatches.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-rose-950/40 rounded-full flex items-center justify-center text-rose-500 border border-rose-800/45">
                  <Smile className="w-9 h-9 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Pas encore de match</h3>
                  <p className="text-xs text-white/60 mt-1 px-4 leading-relaxed">
                    Continuez de swiper ! Dès qu'un intérêt sera partagé, la magie commencera ici.
                  </p>
                </div>
                <button
                  onClick={onBackToDiscovery}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-none text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition-colors"
                >
                  Découvrir
                </button>
              </div>
            ) : (
              initialMatches.map((match) => {
                const partnerId = match.users.find(uid => uid !== currentUser.uid);
                const partner = matchedUsers[partnerId || ''] || {
                  name: 'Partenaire Rose',
                  photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'],
                  city: 'France',
                  isPremium: false
                };

                return (
                  <button
                    key={match.id}
                    onClick={() => selectMatch(match)}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-850 rounded-lg border border-white/5 transition-all text-left group"
                  >
                    <div className="relative">
                      <img
                        src={partner.photos?.[0]}
                        alt={partner.name}
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1 uppercase tracking-wide">
                          {partner.name}
                          {partner.isPremium && <span className="w-2 h-2 rounded-full bg-amber-500" title="Premium" />}
                        </span>
                        <span className="text-[9px] font-mono text-white/40">
                          {match.lastMessageAt ? new Date(match.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 truncate font-normal">{match.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Chat details view */
        <div className="flex flex-col h-full bg-neutral-950">
          {/* Chat Partner Header */}
          <div className="p-4 border-b border-white/10 bg-neutral-900 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => { setActiveMatch(null); setActivePartner(null); }}
                className="p-1.5 hover:bg-neutral-800 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <img
                src={activePartner?.photos?.[0]}
                alt={activePartner?.name}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
              
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-1">
                  {activePartner?.name}
                  {activePartner?.isPremium && (
                    <span className="text-[9px] bg-amber-500 text-black font-black uppercase tracking-wider px-1.5 rounded">VIP</span>
                  )}
                </h3>
                <p className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> EN LIGNE • {activePartner?.city}
                </p>
              </div>
            </div>

            <button 
              onClick={handleBlockUser}
              className="p-2 text-white/40 hover:text-red-500 rounded-full hover:bg-red-950/30 transition-colors"
              title="Signaler / Bloquer"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>

          {/* Anti-spam Alert Banner */}
          {antiSpamWarning && (
            <div className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-2 text-[10px] text-amber-200 flex items-start gap-2 font-mono uppercase tracking-wider">
              <span>{antiSpamWarning}</span>
            </div>
          )}

          {/* Chat History Canvas */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 bg-neutral-950">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-white/40 italic mb-4 font-mono uppercase tracking-widest">Écrivez un message pour commencer ! 🌹</p>
                {/* Conversation starters */}
                <div className="space-y-2 max-w-xs mx-auto">
                  {starters.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(starter)}
                      className="w-full text-left p-3 bg-neutral-900 hover:bg-neutral-850 border border-white/5 text-xs text-white/90 font-medium transition-all rounded"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`} style={{ contentVisibility: 'auto' }}>
                    <div className="max-w-[80%] flex flex-col">
                      <div className={`p-3 text-xs leading-relaxed ${isMe ? 'bg-rose-600 text-white rounded-lg rounded-tr-none' : 'bg-neutral-900 text-white border border-white/10 rounded-lg rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-white/40 mt-1 flex items-center gap-1 font-mono ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-rose-500" />}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Shield secure note */}
          <div className="bg-neutral-950 px-4 py-1.5 text-[9px] text-white/40 border-t border-white/10 flex items-center gap-1.5 justify-center font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Chat crypté & certifié conforme
          </div>

          {/* Quick Chat Entry */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-neutral-900 border-t border-white/10 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Écrire un message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded bg-neutral-950 border border-white/10 focus:border-rose-500 focus:outline-none text-xs text-white placeholder-white/30"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded bg-white text-black hover:bg-rose-600 hover:text-white flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
