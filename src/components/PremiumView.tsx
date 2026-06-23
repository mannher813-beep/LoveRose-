import React, { useState } from 'react';
import { Star, ShieldCheck, Zap, Heart, Check, HelpCircle, Code, Play } from 'lucide-react';
import { UserProfile } from '../types';
import { dbService } from '../services/firebase';

interface PremiumViewProps {
  currentUser: UserProfile;
  onUpgradeSuccess: (updatedProfile: UserProfile) => void;
}

export default function PremiumView({ currentUser, onUpgradeSuccess }: PremiumViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWebhookLog, setShowWebhookLog] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const price = selectedPlan === 'monthly' ? '9.99 € / mois' : '59.99 € / an';

  // Money Fusion payment & Webhook confirmation simulation
  const handleMoneyFusionCheckout = () => {
    setIsProcessing(true);
    setWebhookStatus(null);
    
    // Step 1: Simulate user routing to Money Fusion Secure Checkout
    setTimeout(() => {
      // Step 2: Simulate Money Fusion sending a secure signed webhook callback
      setShowWebhookLog(true);
      setWebhookStatus("📡 Connexion au serveur Money Fusion... Envoi du Webhook IPN...");
      
      setTimeout(async () => {
        const trxRef = 'MF_TRX_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setWebhookStatus(`✅ Webhook reçu ! Signature vérifiée. Transaction: ${trxRef}. Activation du plan.`);
        
        // Save to Firebase / LocalStorage
        await dbService.applyMoneyFusionPayment(currentUser.uid, selectedPlan, trxRef);
        
        // Trigger parent state update
        onUpgradeSuccess({ ...currentUser, isPremium: true });
        setIsProcessing(false);
      }, 1500);

    }, 1500);
  };

  return (
    <div className="w-full h-full bg-neutral-950 flex flex-col justify-between text-white">
      {/* Top Graphic Background Banner */}
      <div className="p-5 bg-neutral-900 text-white flex flex-col items-center relative text-center shrink-0 border-b border-white/10">
        <Star className="w-9 h-9 fill-current text-rose-500 animate-rosefloat mb-2" />
        <h2 className="text-xl font-black uppercase tracking-tight font-display">LOVE ROSE PREMIUM 👑</h2>
        <p className="text-[10px] text-white/60 max-w-xs mt-1 uppercase tracking-wider font-mono">Débloquez l'expérience ultime</p>
      </div>

      {/* Benefits Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-neutral-950">
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 p-3 bg-neutral-900 rounded border border-white/10 shadow-sm">
            <div className="p-1.5 bg-neutral-950 text-rose-500 rounded border border-white/10">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Likes illimités</h4>
              <p className="text-[10px] text-white/50">Pas de limites journalières. Swipez à l'infini.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-neutral-900 rounded border border-white/10 shadow-sm">
            <div className="p-1.5 bg-neutral-950 text-amber-500 rounded border border-white/10">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Super Likes exclusifs</h4>
              <p className="text-[10px] text-white/50">Mettez-vous en avant et notifiez instantanément vos coups de cœur.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-neutral-900 rounded border border-white/10 shadow-sm">
            <div className="p-1.5 bg-neutral-950 text-rose-500 rounded border border-white/10">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Voir qui m'a liké</h4>
              <p className="text-[10px] text-white/50">Découvrez instantanément qui vous apprécie déjà.</p>
            </div>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="bg-neutral-900 p-4 rounded border border-white/10 shadow-sm space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 text-center">Choisissez votre abonnement</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-2.5 rounded border text-center transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-rose-500 bg-rose-950/40 text-rose-400 font-bold' 
                  : 'border-white/10 text-white/60 hover:bg-neutral-850 hover:text-white'
              }`}
            >
              <span className="block text-xs uppercase tracking-wider font-bold">Mensuel</span>
              <span className="block text-[9px] font-mono text-white/40 font-normal">9.99 € / mois</span>
            </button>

            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`p-2.5 rounded border text-center relative transition-all ${
                selectedPlan === 'yearly' 
                  ? 'border-rose-500 bg-rose-950/40 text-rose-400 font-bold' 
                  : 'border-white/10 text-white/60 hover:bg-neutral-850 hover:text-white'
              }`}
            >
              <span className="absolute -top-2 right-2 bg-rose-600 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">ECO</span>
              <span className="block text-xs uppercase tracking-wider font-bold">Annuel</span>
              <span className="block text-[9px] font-mono text-white/40 font-normal">59.99 € / an</span>
            </button>
          </div>
        </div>

        {/* Money Fusion Live webhook simulation monitor */}
        {showWebhookLog && (
          <div className="bg-black text-rose-400 p-3 rounded border border-white/15 font-mono text-[9px] space-y-1.5 shadow-md">
            <div className="flex items-center gap-1.5 text-white font-black uppercase tracking-widest">
              <Code className="w-3.5 h-3.5 text-rose-500" /> MONEY FUSION WEBHOOK IPN
            </div>
            <p className="leading-relaxed whitespace-pre-wrap font-mono text-white/80">{webhookStatus}</p>
          </div>
        )}
      </div>

      {/* Purchase action bottom container */}
      <div className="p-4 bg-neutral-900 border-t border-white/10 shadow-lg flex flex-col gap-2 shrink-0">
        {currentUser.isPremium ? (
          <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded text-rose-400 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500 animate-pulse" />
            Abonnement Actif — VIP 👑
          </div>
        ) : (
          <>
            <button
              onClick={handleMoneyFusionCheckout}
              disabled={isProcessing}
              className={`w-full py-3 bg-white text-black font-black uppercase tracking-[0.12em] text-xs transition-all flex items-center justify-center gap-2 rounded-none ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-600 hover:text-white active:scale-98'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Paiement en cours...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current text-rose-500" />
                  S'abonner via Money Fusion ({price})
                </>
              )}
            </button>
            <span className="text-[9px] text-white/40 text-center font-mono uppercase tracking-widest">Paiement sécurisé Money Fusion™</span>
          </>
        )}
      </div>
    </div>
  );
}
