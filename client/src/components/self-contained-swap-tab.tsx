import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { solscanTracker } from '@/lib/solscan-tracker';
import { useSelfContainedWallet } from './self-contained-wallet-provider';
import { useSelfContainedBalances } from '@/hooks/use-self-contained-balances';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useInstantBalance } from '@/hooks/use-instant-balance';
import { useToast } from '@/hooks/use-toast';
import { TransactionSuccessModal } from './transaction-success-modal';
import { SOL_TO_GOLD_RATE, GOLD_TO_SOL_RATE, SOLSCAN_BASE_URL } from '@/lib/constants';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754275575442.png';

export function SelfContainedSwapTab() {
  const walletContext = useSelfContainedWallet();
  const { connected, swapService } = walletContext;
  const { balances, refetch } = useSelfContainedBalances();
  const externalWallet = useExternalWallets();
  const instantBalance = useInstantBalance();
  const { toast } = useToast();
  
  const [fromToken, setFromToken] = useState<'SOL' | 'GOLD'>('SOL');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<{
    type: 'swap';
    amount: number;
    tokenFrom: string;
    tokenTo: string;
    txSignature: string;
  } | null>(null);

  // Calculate exchange rate based on real market data
  const exchangeRate = fromToken === 'SOL' ? SOL_TO_GOLD_RATE : GOLD_TO_SOL_RATE;
  const slippage = 0.5; // 0.5% slippage
  
  // Display exchange rate info
  const displayRate = fromToken === 'SOL' 
    ? `1 SOL = ${Math.round(SOL_TO_GOLD_RATE).toLocaleString()} GOLD`
    : `1 GOLD = ${GOLD_TO_SOL_RATE.toFixed(8)} SOL`;

  // Calculate amounts
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const amount = Number(value);
    if (amount > 0) {
      const calculated = amount * exchangeRate;
      setToAmount(calculated.toFixed(6));
    } else {
      setToAmount('');
    }
  };

  // Swap direction
  const handleSwapDirection = () => {
    setFromToken(fromToken === 'SOL' ? 'GOLD' : 'SOL');
    setFromAmount('');
    setToAmount('');
  };

  // Use INSTANT balance that updates immediately when switching wallets
  const getTokenBalance = (token: 'SOL' | 'GOLD') => {
    if (token === 'SOL') {
      // Debug the wallet states
      console.log('WALLET DEBUG:', {
        externalConnected: externalWallet.connected,
        externalAddress: externalWallet.address,
        externalBalance: externalWallet.balance,
        externalWallet: externalWallet.selectedWallet,
        selfContainedBalance: balances.sol
      });
      
      // Show external wallet balance if connected, otherwise self-contained balance
      if (externalWallet.connected && externalWallet.address && externalWallet.balance > 0) {
        console.log(`✅ Using EXTERNAL wallet balance: ${externalWallet.balance} SOL`);
        return externalWallet.balance;
      }
      console.log(`✅ Using SELF-CONTAINED wallet balance: ${balances.sol} SOL`);
      return balances.sol;
    }
    return balances.gold || 0; // User's actual GOLD balance
  };
  
  // Display current wallet source for transparency
  const balanceSource = externalWallet.connected && externalWallet.address ? 
    `${externalWallet.selectedWallet} - ${externalWallet.address.slice(0, 8)}...` : 
    'Self-contained wallet';

  // Execute swap
  const handleSwap = async () => {
    if (!connected || !fromAmount) {
      toast({
        title: "Invalid Input",
        description: "Please enter an amount to swap",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(fromAmount);
    const balance = getTokenBalance(fromToken);
    const feeBuffer = fromToken === 'SOL' ? 0.001 : 0; // Reserve SOL for transaction fees

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive"
      });
      return;
    }

    if (fromToken === 'SOL' && (amount + feeBuffer) > balance) {
      toast({
        title: "Insufficient Balance",
        description: `Need ${(amount + feeBuffer).toFixed(6)} SOL (including fees) but only have ${balance.toFixed(6)} SOL`,
        variant: "destructive"
      });
      return;
    } else if (fromToken === 'GOLD' && amount > balance) {
      toast({
        title: "Insufficient Balance", 
        description: `Insufficient GOLD balance. You have ${balance.toFixed(4)} GOLD`,
        variant: "destructive"
      });
      return;
    }

    // Additional check: ensure external wallet is connected for SOL swaps
    if (fromToken === 'SOL' && !externalWallet.connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect an external wallet to swap SOL",
        variant: "destructive"
      });
      return;
    }

    setIsSwapping(true);

    try {
      console.log(`Starting swap: ${amount} ${fromToken}, wallet balance: ${balance.toFixed(6)} SOL`);
      
      // Pass external wallet info to swap service for REAL transactions
      if (externalWallet.connected) {
        const externalWalletData = {
          ...externalWallet,
          walletInstance: (window as any).phantom?.solana || (window as any).solflare || (window as any).trustwallet?.solana
        };
        swapService.setExternalWallet(externalWalletData);
        console.log(`Using REAL external wallet: ${externalWallet.address} with ${externalWallet.balance} SOL`);
      }
      
      let result;
      
      if (fromToken === 'SOL') {
        result = await swapService.swapSolToGold(amount);
      } else {
        result = await swapService.swapGoldToSol(amount);
      }

      if (result.success && result.signature) {
        setLastTxId(result.signature);
        
        // Track transaction for Solscan
        solscanTracker.trackTransaction({
          signature: result.signature,
          type: 'swap',
          token: fromToken,
          amount
        });
        
        // Show contract address info for GOLD swaps
        if (fromToken === 'GOLD') {
          solscanTracker.showContractInfo('GOLD');
        }
        
        console.log('🔗 Swap Transaction on Solscan:', solscanTracker.getSolscanUrl(result.signature));
        
        // Set transaction details for success modal
        setCompletedTransaction({
          type: 'swap',
          amount,
          tokenFrom: fromToken,
          tokenTo: fromToken === 'SOL' ? 'GOLD' : 'SOL',
          txSignature: result.signature
        });
        setShowSuccessModal(true);

        // Update GOLD balance in transaction history immediately
        try {
          const { transactionHistory } = await import('../lib/transaction-history');
          const walletAddress = externalWallet.connected ? externalWallet.address : (connected ? balances.address : null);
          
          if (walletAddress) {
            transactionHistory.setCurrentWallet(walletAddress);
            
            if (fromToken === 'SOL') {
              // User swapped SOL to GOLD - add GOLD to their balance
              const goldReceived = Number(toAmount);
              transactionHistory.addGoldTransaction('swap_receive', goldReceived, result.signature);
              console.log(`🪙 Added ${goldReceived} GOLD to user balance from swap`);
            } else {
              // User swapped GOLD to SOL - deduct GOLD from their balance
              const goldSpent = Number(fromAmount);
              transactionHistory.addGoldTransaction('swap_send', goldSpent, result.signature);
              console.log(`🪙 Deducted ${goldSpent} GOLD from user balance for swap`);
            }
          }
        } catch (error) {
          console.error('Failed to update GOLD balance:', error);
        }

        // Clear form
        setFromAmount('');
        setToAmount('');
        
        // Refresh balances immediately and again after delay
        refetch();
        setTimeout(() => refetch(), 1000);
        
      } else {
        throw new Error(result.error || 'Swap failed');
      }
      
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast({
        title: "Swap Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const fromBalance = getTokenBalance(fromToken);
  const isValidAmount = fromAmount && Number(fromAmount) > 0 && Number(fromAmount) <= fromBalance;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* From Token */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-galaxy-bright">From</label>
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-galaxy-blue/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Button
                variant="outline"
                className="bg-galaxy-button border-galaxy-purple/30 hover:border-galaxy-blue/50 text-white"
                onClick={handleSwapDirection}
              >
                {fromToken === 'SOL' ? (
                  <span className="text-galaxy-blue">◎</span>
                ) : (
                  <img 
                    src={logoImage} 
                    alt="GOLD" 
                    className="w-6 h-6"
                  />
                )}
                <span className="ml-2">{fromToken}</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
              <span className="text-sm text-galaxy-accent">
                Balance: {externalWallet.connected ? 
                  (fromToken === 'SOL' ? externalWallet.balance.toFixed(6) : balances.gold.toFixed(6)) : 
                  fromBalance.toFixed(6)
                }
              </span>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="bg-white text-black text-2xl font-semibold border-none p-2 h-auto placeholder:text-gray-500"
            />
          </CardContent>
        </Card>
      </div>

      {/* Swap Direction Arrow */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-galaxy-card border-galaxy-purple/30 hover:border-galaxy-blue/50"
          onClick={handleSwapDirection}
        >
          <ArrowUpDown className="h-4 w-4 text-galaxy-accent" />
        </Button>
      </div>

      {/* To Token */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-galaxy-bright">To</label>
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-gold-primary/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Button
                variant="outline"
                className="bg-galaxy-button/60 border-galaxy-purple/30 hover:border-gold-primary/50 text-white opacity-80"
                disabled
              >
                {fromToken === 'GOLD' ? (
                  <span className="text-galaxy-blue">◎</span>
                ) : (
                  <img 
                    src={logoImage} 
                    alt="GOLD" 
                    className="w-6 h-6"
                  />
                )}
                <span className="ml-2">{fromToken === 'GOLD' ? 'SOL' : 'GOLD'}</span>
              </Button>
              <span className="text-sm text-galaxy-accent">
                Balance: {fromToken === 'GOLD' ? balances.sol.toFixed(6) : balances.gold.toFixed(6)}
              </span>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="bg-white text-black text-2xl font-semibold border-none p-2 h-auto placeholder:text-gray-500"
            />
          </CardContent>
        </Card>
      </div>

      {/* Swap Details */}
      <Card className="bg-galaxy-card/60 border-galaxy-purple/20">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-galaxy-accent">Rate</span>
            <span className="text-galaxy-bright">
              {fromToken === 'SOL' 
                ? `1 SOL = ${exchangeRate.toLocaleString()} GOLD`
                : `1 GOLD = ${exchangeRate.toFixed(8)} SOL`
              }
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-galaxy-accent">Slippage</span>
            <span className="text-galaxy-bright">{slippage}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-galaxy-accent">Network Fee</span>
            <span className="text-galaxy-bright">~0.000005 SOL</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-galaxy-accent">Treasury</span>
            <span className="text-galaxy-bright">APkB...pump</span>
          </div>
        </CardContent>
      </Card>

      {/* Swap Button */}
      <Button
        className="w-full bg-galaxy-button hover:bg-galaxy-button py-4 font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
        onClick={handleSwap}
        disabled={!connected || !isValidAmount || isSwapping}
      >
        {isSwapping ? 'Swapping...' : `Swap ${fromToken} → ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}`}
      </Button>

      {/* Last Transaction */}
      {lastTxId && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400 mb-2">Last swap transaction:</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${lastTxId}`, '_blank')}
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {/* Success Modal */}
      {completedTransaction && (
        <TransactionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          transactionType={completedTransaction.type}
          amount={completedTransaction.amount}
          tokenFrom={completedTransaction.tokenFrom}
          tokenTo={completedTransaction.tokenTo}
          txSignature={completedTransaction.txSignature}
        />
      )}
    </div>
  );
}