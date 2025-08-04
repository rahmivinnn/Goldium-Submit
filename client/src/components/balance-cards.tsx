import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useExternalWalletBalances } from '@/hooks/use-external-wallet-balances';
import { WalletStateManager } from '@/lib/wallet-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useGoldBalance } from '@/hooks/use-gold-balance';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';
import { SolanaIcon } from '@/components/solana-icon';

export function BalanceCards() {
  const { data: balances, isLoading } = useExternalWalletBalances();
  const goldBalance = useGoldBalance();
  const [walletState, setWalletState] = useState(WalletStateManager.getState());
  
  // Subscribe to global wallet state
  useEffect(() => {
    const unsubscribe = WalletStateManager.subscribe(() => {
      setWalletState(WalletStateManager.getState());
    });
    return unsubscribe;
  }, []);

  // Show external wallet balance if connected, otherwise use self-contained balance
  const currentBalance = (walletState.connected && walletState.address && walletState.balance > 0) ? walletState.balance : (balances?.sol || 0);
  
  console.log('Balance Cards Global State Debug:', {
    connected: walletState.connected,
    selectedWallet: walletState.selectedWallet,
    walletBalance: walletState.balance,
    currentBalance: currentBalance,
    address: walletState.address,
    selfContainedBalance: balances?.sol
  });

  // Use same balance structure as Swap tab for consistency
  const safeBalances = {
    sol: currentBalance, // Direct balance from wallet state
    gold: goldBalance.balance, // User's actual GOLD balance from real service
    stakedGold: goldBalance.stakedBalance // User's actual staked amount from real service
  };

  // Skip refresh balance calls to avoid RPC errors
  // React.useEffect(() => {
  //   if (wallet.refreshBalance) {
  //     const timer = setTimeout(() => {
  //       wallet.refreshBalance();
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [wallet.refreshBalance]);
  
  // Show wallet info if external wallet is connected
  const walletInfo = walletState.connected && walletState.selectedWallet ? 
    ` (${walletState.selectedWallet.charAt(0).toUpperCase() + walletState.selectedWallet.slice(1)})` : '';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-defi-secondary/80 backdrop-blur-sm border-defi-accent/30">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* SOL Balance */}
      <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-galaxy-blue/50 transition-all duration-300 transform hover:scale-105 balance-card stagger-item">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold gradient-text">SOL Balance{walletInfo}</h3>
            <SolanaIcon size={24} className="text-purple-400 float-animation" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-galaxy-bright shimmer">
              {currentBalance.toFixed(6)}
            </p>

            <p className="text-sm text-galaxy-accent">
              ≈ ${(currentBalance * 195.5).toFixed(2)} USD
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GOLD Balance */}
      <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-gold-primary/50 transition-all duration-300 transform hover:scale-105 balance-card stagger-item">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold gradient-text">GOLD Balance</h3>
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="GOLD Token" 
                className="w-8 h-8 object-contain logo-spin"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="text-gold-primary text-lg font-bold hidden">🥇</div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-galaxy-bright shimmer">
              {safeBalances.gold.toFixed(4)}
            </p>
            <p className="text-sm text-galaxy-accent">
              ≈ ${(safeBalances.gold * 20).toFixed(2)} USD
            </p>
            {goldBalance.isLoading && (
              <p className="text-xs text-galaxy-text loading-dots">Updating</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staked GOLD */}
      <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 balance-card stagger-item">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold gradient-text">Staked GOLD</h3>
            <div className="relative">
              <img 
                src={logoImage} 
                alt="Staked GOLD" 
                className="w-8 h-8 object-contain logo-spin"
              />
              <div className="absolute -top-1 -right-1 text-green-400 text-sm animate-pulse">🔒</div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-galaxy-bright shimmer">
              {safeBalances.stakedGold.toFixed(4)}
            </p>
            <p className="text-sm text-green-400">
              {goldBalance.stakingInfo.apy}% APY • ${(safeBalances.stakedGold * 20).toFixed(2)}
            </p>
            {goldBalance.isLoading && (
              <p className="text-xs text-galaxy-text loading-dots">Updating</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
