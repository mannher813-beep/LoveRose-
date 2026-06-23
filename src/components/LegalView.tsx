import React from 'react';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';

export default function LegalView() {
  return (
    <div className="w-full h-full bg-neutral-950 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-neutral-900 text-white shadow-sm shrink-0">
        <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-rose-500" /> Mentions Légales & RGPD
        </h2>
      </div>

      {/* Content scrollable area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-xs text-white/70 leading-relaxed bg-neutral-950">
        
        {/* GDPR Compliance Note */}
        <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded space-y-1.5">
          <h3 className="font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5 text-[10px]">
            <CheckCircle className="w-3.5 h-3.5 text-rose-500" /> Conformité RGPD Active
          </h3>
          <p className="text-[10px] text-white/60 leading-relaxed font-mono">
            Conformément au Règlement Général sur la Protection des Données (RGPD), LoveRose s'engage à protéger la vie privée de ses utilisateurs. Vous disposez d'un droit complet d'accès, de rectification, de portabilité et de suppression de vos données personnelles.
          </p>
        </div>

        {/* 1. CGU */}
        <div className="space-y-1.5">
          <h3 className="font-black uppercase tracking-wider text-white flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-rose-500" /> 1. Conditions d'Utilisation
          </h3>
          <p>
            L'inscription sur LoveRose est réservée aux personnes majeures (18 ans et plus). Les membres s'engagent à fournir des informations réelles et authentiques sur leur profil. Tout propos offensant, harcèlement, spam ou tentative d'arnaque entraînera le bannissement immédiat et irrévocable du compte.
          </p>
        </div>

        {/* 2. Privacy Policy */}
        <div className="space-y-1.5">
          <h3 className="font-black uppercase tracking-wider text-white flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-rose-500" /> 2. Confidentialité
          </h3>
          <p>
            Vos données de géolocalisation et vos préférences sont utilisées uniquement pour vous suggérer des profils compatibles à proximité. Vos photos sont stockées de manière sécurisée et ne sont jamais revendues ou cédées à des tiers.
          </p>
        </div>

        {/* 3. Cookies */}
        <div className="space-y-1.5">
          <h3 className="font-black uppercase tracking-wider text-white">3. Gestion des Cookies</h3>
          <p>
            LoveRose utilise des cookies fonctionnels locaux et des mécanismes de cache PWA (Service Workers) pour assurer la rapidité de l'application et son fonctionnement partiel hors-ligne.
          </p>
        </div>

        {/* Footer Contact */}
        <div className="pt-4 border-t border-white/10 text-center text-[10px] text-white/40 font-mono uppercase tracking-widest">
          Pour toute suppression de compte : <br />
          <strong className="text-white/60 mt-1 block">privacy@loverose.app</strong>
        </div>
      </div>
    </div>
  );
}
