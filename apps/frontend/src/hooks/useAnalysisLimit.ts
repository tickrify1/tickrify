import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface AnalysisLimitData {
  total: number;
  used: number;
  remaining: number;
  canAnalyze: boolean;
  isUnlimited: boolean;
  plan: 'free' | 'pro';
}

export function useAnalysisLimit(): AnalysisLimitData {
  const { user, isLoaded } = useUser();
  const [analysisCount, setAnalysisCount] = useState(0);

  // Verificar se está no modo demo (rota /demo sem usuário)
  const isDemo = !user;
  
  // TEMPORÁRIO: Usuários logados são "Pro" (ilimitado) até Stripe
  // Quando Stripe estiver ativo, verificar subscription real
  const STRIPE_CONFIGURED = false; // Mudar para true quando Stripe estiver ativo
  
  // Determinar plano:
  // - Demo (sem login): não tem limite (retorna valores fake)
  // - Logado sem Stripe: Pro (ilimitado)
  // - Logado com Stripe: verificar subscription (free ou pro)
  const userPlan: 'free' | 'pro' = STRIPE_CONFIGURED ? 'free' : 'pro'; // Temporário: todos pro

  const FREE_LIMIT = 3;
  const isUnlimited = userPlan === 'pro';

  useEffect(() => {
    if (isLoaded && user) {
      // Buscar contagem de análises do localStorage
      const storageKey = `analysis_count_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      setAnalysisCount(stored ? parseInt(stored, 10) : 0);
    }
  }, [isLoaded, user]);

  // Se é demo, retorna valores que não importam (demo não usa limite)
  if (isDemo) {
    return {
      total: Infinity,
      used: 0,
      remaining: Infinity,
      canAnalyze: true,
      isUnlimited: true,
      plan: 'pro',
    };
  }

  // Usuário logado
  const total = isUnlimited ? Infinity : FREE_LIMIT;
  const used = analysisCount;
  const remaining = isUnlimited ? Infinity : Math.max(0, FREE_LIMIT - used);
  const canAnalyze = isUnlimited || remaining > 0;

  return {
    total,
    used,
    remaining,
    canAnalyze,
    isUnlimited,
    plan: userPlan,
  };
}

// Hook auxiliar para incrementar análises
export function useIncrementAnalysis() {
  const { user } = useUser();

  return () => {
    if (!user) {
      // Demo: não incrementa nada
      return;
    }

    // TEMPORÁRIO: Desabilitado até Stripe ser configurado
    const STRIPE_CONFIGURED = false; // Mudar para true quando Stripe estiver ativo
    
    if (STRIPE_CONFIGURED) {
      // Com Stripe: incrementa para plano Free
      const storageKey = `analysis_count_${user.id}`;
      const current = parseInt(localStorage.getItem(storageKey) || '0', 10);
      localStorage.setItem(storageKey, (current + 1).toString());
    }
    // Sem Stripe: não incrementa (todos são Pro temporariamente)
  };
}

