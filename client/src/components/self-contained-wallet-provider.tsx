import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';
import { selfContainedWallet, walletInfo } from '@/lib/wallet-service';
import { swapService } from '@/lib/swap-service';
import { stakingService } from '@/lib/staking-service';
import { transactionTracker } from '@/lib/transaction-tracker';

// Wallet context interface
interface WalletContextType {
  // Wallet connection
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  wallet: string | null;
  balance: number;
  
  // Connection methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Balance methods
  refreshBalance: () => Promise<void>;
  
  // Services
  swapService: typeof swapService;
  stakingService: typeof stakingService;
  transactionTracker: typeof transactionTracker;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function SelfContainedWalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);

  // Initialize wallet connection
  const connect = async () => {
    setConnecting(true);
    try {
      // Self-contained wallet is always "connected"
      setConnected(true);
      await refreshBalance();
      console.log(`Self-contained wallet connected: ${walletInfo.address}`);
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    setConnected(false);
    setBalance(0);
    console.log('Self-contained wallet disconnected');
  };

  // Refresh SOL balance
  const refreshBalance = async () => {
    try {
      const newBalance = await selfContainedWallet.getBalance();
      setBalance(newBalance);
      // Reduce console noise - balance is self-contained at 0 SOL
      if (newBalance > 0) {
        console.log(`Self-contained balance: ${newBalance} SOL`);
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, []);

  // Refresh balance periodically
  useEffect(() => {
    if (connected) {
      const interval = setInterval(refreshBalance, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [connected]);

  const contextValue: WalletContextType = {
    // Wallet state
    connected,
    connecting,
    publicKey: connected ? walletInfo.publicKey : null,
    wallet: connected ? walletInfo.walletType : null,
    balance,
    
    // Methods
    connect,
    disconnect,
    refreshBalance,
    
    // Services
    swapService,
    stakingService,
    transactionTracker
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useSelfContainedWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useSelfContainedWallet must be used within a SelfContainedWalletProvider');
  }
  return context;
}

// Export wallet address for easy access
export const WALLET_ADDRESS = walletInfo.address;