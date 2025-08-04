import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface BalanceStatusIndicatorProps {
  connected: boolean;
  balance: number;
  walletType?: string;
}

export function BalanceStatusIndicator({ connected, balance, walletType }: BalanceStatusIndicatorProps) {
  if (!connected) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 rounded-full">
        <XCircle className="w-3 h-3 text-red-500" />
        <span className="text-sm text-red-400">Not Connected</span>
      </div>
    );
  }

  const hasBalance = balance > 0;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
      hasBalance 
        ? 'bg-green-500/20' 
        : 'bg-yellow-500/20'
    }`}>
      {hasBalance ? (
        <CheckCircle className="w-3 h-3 text-green-500" />
      ) : (
        <AlertCircle className="w-3 h-3 text-yellow-500" />
      )}
      <span className={`text-sm ${
        hasBalance ? 'text-green-400' : 'text-yellow-400'
      }`}>
        {walletType?.charAt(0).toUpperCase()}{walletType?.slice(1)} • {balance.toFixed(6)} SOL
      </span>
    </div>
  );
}