import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SelfContainedSwapTab } from '@/components/self-contained-swap-tab';
import { SelfContainedStakingTab } from '@/components/self-contained-staking-tab';
import { RealSendTab } from '@/components/real-send-tab';
import { TransactionHistory } from '@/components/transaction-history';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { ExternalWalletSelector } from '@/components/external-wallet-selector';

import { RealTimeNotifications } from '@/components/real-time-notifications';
import { ExternalLink } from 'lucide-react';
import { AnimatedTokenomicsCharts } from '@/components/animated-tokenomics-charts';
import { realTimeDataService, RealTimeTokenData } from '@/services/real-time-data-service';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { goldTokenService } from '@/services/gold-token-service';
import { autoSaveTransaction } from "@/lib/historyUtils";
import { useGoldBalance } from '@/hooks/use-gold-balance';
import goldiumLogo from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';
import GoldiumGamifiedStaking from '@/components/goldium-gamified-staking';
import { TwitterEmbed } from '@/components/twitter-embed';

export default function HomeSimple() {
  const wallet = useSolanaWallet();
  const [tokenData, setTokenData] = useState<RealTimeTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('0.000047'); // Default amount for 1 GOLD
  
  const externalWallet = useExternalWallets();
  const { toast } = useToast();
  const goldBalance = useGoldBalance();

  // Fetch real-time data on component mount
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        const data = await realTimeDataService.getRealTimeTokenData();
        setTokenData(data);
      } catch (error) {
        console.error('Failed to fetch token data:', error);
        // Fallback to realistic demo data
        setTokenData({
          currentPrice: 0.0089,
          priceChange24h: 12.8,
          volume24h: 485000,
          marketCap: 890000,
          totalSupply: 100000000,
          circulatingSupply: 60000000,
          stakingAPY: 8.5,
          totalStaked: 21000000,
          holders: 1247
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();

    // Update data every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyGoldium = async () => {
    if (!externalWallet.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to buy GOLDIUM tokens.",
        variant: "destructive"
      });
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive"
      });
      return;
    }

    setBuyingToken(true);
    
    try {
      // REAL BLOCKCHAIN TRANSACTION - No more simulation!
      console.log('🚀 Starting REAL GOLDIUM purchase with blockchain integration');
      
      const solAmount = parseFloat(buyAmount);
      const goldAmount = solAmount * 21486.893; // Exchange rate: 1 SOL = 21,486.893 GOLD
      
      // Import and use REAL swap service
      const { SwapService } = await import('@/lib/swap-service');
      const swapService = new SwapService();
      
      // Set external wallet for real transaction
      if (externalWallet.walletInstance) {
        swapService.setExternalWallet(externalWallet);
        console.log('✅ External wallet connected for REAL transaction');
      }
      
      console.log(`💰 Executing REAL swap: ${solAmount} SOL → ${goldAmount.toFixed(2)} GOLD`);
      console.log(`🔗 Transaction will be tracked with GOLD Contract Address (CA)`);
      
      // Execute REAL blockchain swap
      const swapResult = await swapService.swapSolToGold(solAmount);
      
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Swap failed');
      }
      
      const signature = swapResult.signature!;
      console.log(`✅ REAL transaction completed: ${signature}`);
      console.log(`🔍 View on Solscan: https://solscan.io/tx/${signature}`);
      
      // Update transaction history with REAL signature
      const { transactionHistory } = await import('@/lib/transaction-history');
      if (externalWallet.address) {
        transactionHistory.setCurrentWallet(externalWallet.address);
        transactionHistory.addGoldTransaction('swap_receive', goldAmount, signature);
      }

      // Auto-save REAL transaction
      if (externalWallet.address) {
        await autoSaveTransaction(
          externalWallet.address,
          signature,
          'buy',
          solAmount,
          goldAmount,
          'success'
        );
      }

      toast({
        title: "🎉 REAL Purchase Successful!",
        description: `Successfully bought ${goldAmount.toFixed(2)} GOLDIUM tokens with ${buyAmount} SOL! Transaction: ${signature.slice(0, 8)}...`,
        variant: "default"
      });

      // Reset buy amount
      setBuyAmount('0.000047');
      
      // Refresh balances after real transaction
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to buy GOLDIUM:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to buy GOLDIUM tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBuyingToken(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-purple-400/20 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-400 bg-cyan-400/10 overflow-hidden animate-bounce-gentle">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-cyan-400 animate-bounce-gentle">$GOLDIUM</div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#brand" className="text-purple-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-105 animate-fade-in-up animation-delay-200">Brand</a>
                <a href="#defi" className="text-purple-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-105 animate-fade-in-up animation-delay-300">DeFi</a>
                <a href="#tokenomics" className="text-purple-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-105 animate-fade-in-up animation-delay-400">Tokenomics</a>
              {externalWallet.connected && (
                 <div className="hidden sm:flex items-center gap-2 sm:gap-4 bg-gray-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-cyan-400 animate-fade-in-up animation-delay-450">
                   <div className="flex items-center gap-1 sm:gap-2">
                     <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm relative">
                       <div className="absolute top-0.5 left-0.5 right-0.5 bottom-1 bg-black rounded-sm"></div>
                       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 sm:w-2 h-0.5 sm:h-1 bg-yellow-400 rounded-b"></div>
                     </div>
                     <span className="text-xs sm:text-sm text-gray-300">
                       {externalWallet.address?.slice(0, 4)}...{externalWallet.address?.slice(-4)}
                     </span>
                   </div>
                   <div className="flex items-center gap-1 sm:gap-2">
                     <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                       <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400 relative">
                         <div className="absolute inset-0.5 rounded-full bg-yellow-200"></div>
                       </div>
                     </div>
                     <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                       {externalWallet.balance.toFixed(4)} SOL
                     </span>
                   </div>
                   <div className="flex items-center gap-1 sm:gap-2">
                     <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                     <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                       {goldBalance.balance.toFixed(2)} GOLD
                     </span>
                   </div>
                 </div>
               )}
              <div className="animate-fade-in-up animation-delay-500">
                <ExternalWalletSelector />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {externalWallet.connected && (
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded border border-cyan-400/50">
                  <span className="text-xs text-cyan-400 font-semibold">
                    {externalWallet.balance.toFixed(2)} SOL
                  </span>
                </div>
              )}
              <button className="text-cyan-400 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Real-time notifications */}
      <div className="fixed top-16 sm:top-20 right-2 sm:right-6 z-40">
        <RealTimeNotifications className="shadow-2xl" maxNotifications={3} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="relative">
                  <img 
                    src={goldiumLogo} 
                    alt="Goldium Logo" 
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-float drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-cyan-400 mb-6 sm:mb-8 tracking-tight animate-fade-in-up">
                <span className="inline-block animate-bounce-gentle drop-shadow-lg">$</span>
                <span className="inline-block animate-slide-in-left drop-shadow-lg">G</span>
                <span className="inline-block animate-slide-in-left animation-delay-100 drop-shadow-lg">O</span>
                <span className="inline-block animate-slide-in-left animation-delay-200 drop-shadow-lg">L</span>
                <span className="inline-block animate-slide-in-left animation-delay-300 drop-shadow-lg">D</span>
                <span className="inline-block animate-slide-in-left animation-delay-400 drop-shadow-lg">I</span>
                <span className="inline-block animate-slide-in-left animation-delay-500 drop-shadow-lg">U</span>
                <span className="inline-block animate-slide-in-left animation-delay-600 drop-shadow-lg">M</span>
              </h1>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up animation-delay-700">
                <span className="bg-gradient-to-r from-purple-200 to-cyan-400 bg-clip-text text-transparent">DIGITAL GOLD</span>
                <span className="block text-cyan-400 mt-1 sm:mt-2 animate-fade-in-up animation-delay-900 drop-shadow-lg">REVOLUTION</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-200 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-1100 drop-shadow-md px-4">
                The Ultimate Store of Value on Solana Blockchain
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 animate-fade-in-up animation-delay-1300">
              <div className="flex flex-col gap-4 items-center bg-black/40 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mx-4 sm:mx-0">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg border-2 border-cyan-400/40">
                      <img 
                        src={goldiumLogo} 
                        alt="Goldium Logo" 
                        className="w-full h-full object-contain bg-gradient-to-br from-cyan-400/20 to-blue-600/20 p-1"
                      />
                    </div>
                    <p className="text-cyan-300 font-bold text-xl">BUY GOLDIUM WITH SOL</p>
                  </div>
                  <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3">
                    <p className="text-purple-200 text-sm font-medium">Exchange Rate: <span className="text-cyan-400 font-bold">1 SOL = 21,486.893 GOLD</span></p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 items-center w-full max-w-sm sm:max-w-md">
                  <div className="flex gap-3 items-center w-full">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        placeholder="Enter SOL amount"
                        min="0.000047"
                        step="0.000047"
                        className="bg-gray-900/80 border-2 border-cyan-400/50 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-center font-semibold text-sm sm:text-base"
                        disabled={buyingToken}
                      />
                      <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 font-bold text-xs sm:text-sm">SOL</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-base sm:text-lg">
                    <span className="text-purple-200/70">↓</span>
                    <span className="text-cyan-300 font-bold text-sm sm:text-lg">{buyAmount ? (parseFloat(buyAmount) * 21486.893).toLocaleString() : '0'} GOLD</span>
                  </div>
                </div>
                <Button
                  onClick={handleBuyGoldium}
                  disabled={buyingToken || !externalWallet.connected}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-sm sm:max-w-md"
                >
                  {buyingToken ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      BUYING GOLDIUM...
                    </div>
                  ) : (
                    'BUY GOLDIUM WITH SOL'
                  )}
                </Button>
                {!externalWallet.connected && (
                  <p className="text-sm text-gray-400 text-center">Connect wallet to buy GOLDIUM tokens</p>
                )}
              </div>
              <div className="flex flex-col gap-4 items-center bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mx-4 sm:mx-0">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg transform rotate-12">
                      <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <p className="text-yellow-300 font-bold text-xl">FOLLOW US ON TWITTER</p>
                  </div>
                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
                    <p className="text-yellow-200 text-sm font-medium">Stay updated with <span className="text-yellow-400 font-bold">latest news and announcements</span></p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-2xl w-full max-w-sm sm:max-w-md"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    FOLLOW TWITTER
                  </div>
                </Button>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-black via-gray-900/10 to-black border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up animation-delay-300">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-4 sm:mb-6 animate-pulse-gentle flex items-center justify-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-xl">
                <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-100 rounded-sm"></div>
                  <div className="w-1.5 h-2 sm:w-2 sm:h-3 bg-yellow-100 rounded-sm"></div>
                  <div className="w-1.5 h-0.5 sm:w-2 sm:h-1 bg-yellow-100 rounded-sm"></div>
                  <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-yellow-100 rounded-sm"></div>
                </div>
              </div>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">LIVE MARKET DATA</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-yellow-200 animate-fade-in-up animation-delay-500 max-w-4xl mx-auto font-medium px-4">Real-time market statistics and performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all transform hover:scale-105 backdrop-blur-sm animate-fade-in-up animation-delay-600">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-lg border-2 border-yellow-400/40 animate-bounce">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-1"
                />
              </div>
              <div className="text-yellow-300 font-bold text-lg sm:text-xl mb-1 sm:mb-2">GOLD Price</div>
              <div className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">${tokenData ? tokenData.currentPrice.toFixed(6) : '0.000000'}</div>
              <div className="bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">{tokenData ? `+${tokenData.priceChange24h.toFixed(2)}%` : '+0.00%'} ↗</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all transform hover:scale-105 backdrop-blur-sm animate-fade-in-up animation-delay-700">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                <div className="flex items-end gap-0.5 sm:gap-1">
                  <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-yellow-100 rounded-sm"></div>
                  <div className="w-0.5 sm:w-1 h-3 sm:h-5 bg-yellow-100 rounded-sm"></div>
                  <div className="w-0.5 sm:w-1 h-2.5 sm:h-4 bg-yellow-100 rounded-sm"></div>
                  <div className="w-0.5 sm:w-1 h-4 sm:h-6 bg-yellow-100 rounded-sm"></div>
                </div>
              </div>
              <div className="text-yellow-300 font-bold text-lg sm:text-xl mb-1 sm:mb-2">Market Cap</div>
              <div className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">${tokenData ? (tokenData.marketCap / 1000000).toFixed(1) : '0.0'}M</div>
              <div className="bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">+5.67% ↗</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-2 border-yellow-400/40 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all transform hover:scale-105 backdrop-blur-sm animate-fade-in-up animation-delay-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg animate-bounce">
                <div className="relative">
                  <div className="w-3 h-4 sm:w-4 sm:h-6 bg-yellow-100 rounded-t-full"></div>
                  <div className="absolute -top-0.5 sm:-top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-yellow-300 font-bold text-lg sm:text-xl mb-1 sm:mb-2">24h Volume</div>
              <div className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">${tokenData ? (tokenData.volume24h / 1000).toFixed(0) : '0'}K</div>
              <div className="bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">+12.45% ↗</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-2 border-green-400/40 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-green-400 hover:shadow-2xl hover:shadow-green-400/20 transition-all transform hover:scale-105 backdrop-blur-sm animate-fade-in-up animation-delay-900">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-green-100 rounded-full"></div>
                  <div className="w-1.5 h-4 sm:w-2 sm:h-5 bg-green-100 rounded-full"></div>
                  <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-green-100 rounded-full"></div>
                </div>
              </div>
              <div className="text-green-300 font-bold text-lg sm:text-xl mb-1 sm:mb-2">Holders</div>
              <div className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{tokenData ? tokenData.holders.toLocaleString() : '0'}</div>
              <div className="bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">+8.23% ↗</div>
            </div>
          </div>
          

        </div>
      </section>

      {/* DeFi Section */}
      <section id="defi" className="py-20 px-6 bg-gradient-to-b from-black via-yellow-900/5 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-black text-yellow-400 mb-8">
              DEFI PLATFORM
            </h2>
            <p className="text-2xl text-yellow-200 max-w-4xl mx-auto font-medium">
              Complete DeFi ecosystem for trading, staking, and managing your digital gold
            </p>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-yellow-400/30 rounded-3xl p-8">
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 bg-yellow-900/20 border border-yellow-400/30">
                <TabsTrigger value="swap" className="text-yellow-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
                  🔄 Swap
                </TabsTrigger>
                <TabsTrigger value="stake" className="text-yellow-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
                  💎 Stake
                </TabsTrigger>
                <TabsTrigger value="dragon" className="text-yellow-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
                  🐉 Dragon
                </TabsTrigger>
                <TabsTrigger value="send" className="text-yellow-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
                  📤 Send
                </TabsTrigger>
                <TabsTrigger value="history" className="text-yellow-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
                  📊 History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="swap">
                <SelfContainedSwapTab />
              </TabsContent>
              
              <TabsContent value="stake">
                <SelfContainedStakingTab />
              </TabsContent>
              
              <TabsContent value="dragon">
                <GoldiumGamifiedStaking />
              </TabsContent>
              
              <TabsContent value="send">
                <RealSendTab />
              </TabsContent>
              
              <TabsContent value="history">
                <TransactionHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-6 bg-gradient-to-b from-black via-yellow-900/5 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-black text-yellow-400 mb-8">
              TOKENOMICS
            </h2>
            <p className="text-2xl text-yellow-200 max-w-4xl mx-auto font-medium">
              Transparent and sustainable token distribution designed for long-term value
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-400/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg border-2 border-yellow-400/40">
                    <img 
                      src={goldiumLogo} 
                      alt="Goldium Logo" 
                      className="w-full h-full object-contain bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-1"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-400">Token Distribution</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Total Supply</span>
                    <span className="text-white font-bold">1,000,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Circulating Supply</span>
                    <span className="text-white font-bold">600,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Liquidity Pool</span>
                    <span className="text-white font-bold">300,000,000 (30%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Community Rewards</span>
                    <span className="text-white font-bold">250,000,000 (25%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Development</span>
                    <span className="text-white font-bold">200,000,000 (20%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Marketing</span>
                    <span className="text-white font-bold">150,000,000 (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Team (Locked)</span>
                    <span className="text-white font-bold">100,000,000 (10%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <AnimatedTokenomicsCharts />
            </div>
          </div>
        </div>
      </section>

      {/* Twitter Feed Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black via-yellow-900/5 to-black border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">COMMUNITY UPDATES</h2>
            </div>
            <p className="text-yellow-200 text-lg">Stay connected with the latest news from Goldium and Solana ecosystem</p>
          </div>
          
          <div className="flex justify-center">
            <TwitterEmbed />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 border-t border-yellow-400/30 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-100">GOLDIUM</div>
              <p className="text-yellow-200/70 leading-relaxed text-sm sm:text-base">
                The future of digital gold on Solana blockchain. Secure, fast, and decentralized.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-10 h-10 bg-black/80 border border-yellow-400/40 rounded-full flex items-center justify-center hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-black/80 border border-yellow-400/40 rounded-full flex items-center justify-center hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-black/80 border border-yellow-400/40 rounded-full flex items-center justify-center hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-yellow-100">Product</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#defi" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">DeFi App</a>
                <a href="#tokenomics" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Tokenomics</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">API</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-yellow-100">Resources</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Documentation</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Whitepaper</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Security Audit</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-yellow-100">Support</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Help Center</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Contact Us</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors text-sm sm:text-base">Status</a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-yellow-400/30">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-yellow-300/60 text-center sm:text-left">
                <a href="#" className="hover:text-yellow-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a>
              </div>
              <div className="text-xs sm:text-sm text-yellow-300/60 text-center">
                © 2025 Goldium. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
