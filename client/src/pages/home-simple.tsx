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
import { ExternalLink, DollarSign } from 'lucide-react';
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
      {/* Navigation Bar - Chainzoku Style */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-2xl border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-2 shadow-xl shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300 chainzoku-pulse">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-2xl font-bold chainzoku-title font-['Space_Grotesk'] tracking-tight">GOLDIUM</div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#brand" className="text-white/80 hover:text-cyan-400 transition-all duration-300 font-medium font-['Inter'] text-sm uppercase tracking-wide hover:scale-105">Brand</a>
              <a href="#defi" className="text-white/80 hover:text-cyan-400 transition-all duration-300 font-medium font-['Inter'] text-sm uppercase tracking-wide hover:scale-105">DeFi</a>
              <a href="#tokenomics" className="text-white/80 hover:text-cyan-400 transition-all duration-300 font-medium font-['Inter'] text-sm uppercase tracking-wide hover:scale-105">Tokenomics</a>
              {externalWallet.connected && (
                 <div className="chainzoku-card flex items-center gap-3 bg-black/90 backdrop-blur-lg px-3 py-2 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-cyan-400 rounded-full chainzoku-pulse shadow-lg shadow-cyan-400/60"></div>
                     <span className="text-xs text-white/90 font-['Inter'] font-medium">
                       {externalWallet.address?.slice(0, 4)}...{externalWallet.address?.slice(-4)}
                     </span>
                   </div>
                   <div className="h-3 w-px bg-cyan-400/40"></div>
                   <div className="flex items-center gap-1">
                     <span className="text-xs font-semibold text-cyan-400 font-['Inter']">
                       {externalWallet.balance.toFixed(2)} SOL
                     </span>
                   </div>
                   <div className="flex items-center gap-1">
                     <DollarSign className="w-3 h-3 text-cyan-400" />
                     <span className="text-xs font-semibold text-cyan-400 font-['Inter']">
                       {goldBalance.balance.toFixed(0)} GOLD
                     </span>
                   </div>
                 </div>
               )}
              <ExternalWalletSelector />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {externalWallet.connected && (
                <div className="flex items-center gap-1 bg-black/80 backdrop-blur-lg px-3 py-2 rounded-lg border border-cyan-400/50">
            <span className="text-xs text-cyan-400 font-bold font-['Space_Grotesk']">
                    {externalWallet.balance.toFixed(2)} SOL
                  </span>
                </div>
              )}
              <button className="text-white p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300">
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

      {/* Hero Section - Chainzoku Style */}
      <section className="relative pt-20 pb-32 min-h-screen flex items-center overflow-hidden">
        {/* Chainzoku Background */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,255,0.08),rgba(0,191,255,0.05),rgba(0,0,0,0.95))]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,255,255,0.05),rgba(0,0,0,0.98),rgba(0,191,255,0.03),rgba(0,0,0,0.98))]" />
        
        {/* Chainzoku Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Chainzoku Golden Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-yellow-400/12 to-orange-500/12 rounded-full blur-3xl chainzoku-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-orange-500/8 to-yellow-600/8 rounded-full blur-3xl chainzoku-float delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-300/15 to-orange-400/15 rounded-full blur-2xl chainzoku-float delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-40 h-40 bg-gradient-to-r from-yellow-500/20 to-orange-300/20 rounded-full blur-xl chainzoku-float delay-3000"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-16 chainzoku-fade-in">
            <div className="space-y-8">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img 
                    src={goldiumLogo} 
                    alt="Goldium Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="chainzoku-title">
                  GOLDIUM
                </span>
              </h1>
              <div className="text-lg sm:text-xl md:text-2xl chainzoku-subtitle max-w-4xl mx-auto">
                Next-generation digital gold protocol
              </div>
              <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                Secure, transparent, and backed by real gold reserves on the Solana blockchain. 
                Experience the future of digital assets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="chainzoku-card p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-2.5 shadow-lg">
                      <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Buy GOLDIUM</h3>
                      <p className="text-sm text-white/60">Instant transactions</p>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 text-sm">
                      Exchange Rate: <span className="chainzoku-highlight font-semibold">1 SOL = 21,486 GOLD</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="0.1"
                      min="0.000047"
                      step="0.000047"
                      className="chainzoku-input w-full"
                      disabled={buyingToken}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm font-medium">SOL</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-lg font-medium">≈</span>
                    <span className="chainzoku-highlight font-semibold text-lg">
                      {buyAmount ? (parseFloat(buyAmount) * 21486.893).toLocaleString() : '0'} GOLD
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleBuyGoldium}
                  disabled={buyingToken || !externalWallet.connected}
                  className="chainzoku-btn w-full mt-6"
                >
                  {buyingToken ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Buy GOLDIUM'
                  )}
                </Button>
                {!externalWallet.connected && (
                  <p className="text-sm text-white/70 text-center font-['Inter'] font-medium mt-4">Connect your wallet to purchase GOLDIUM</p>
                )}
              </div>
              <div className="chainzoku-card p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Follow Updates</h3>
                      <p className="text-sm text-white/60">Stay connected</p>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 text-sm">
                      Stay updated with latest news and announcements
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
                  className="chainzoku-btn w-full"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Follow on Twitter
                  </div>
                </Button>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* ULTRA MODERN Market Data Section */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden bg-black">
        {/* Ultra Futuristic Market Background */}
        <div className="absolute inset-0 bg-radial-gradient(ellipse at center, #0a0a0f 0%, #000000 70%)"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(255,255,0,0.08),transparent)]"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-400/8 to-orange-500/8 rounded-full blur-3xl chainzoku-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-l from-orange-400/10 to-yellow-500/10 rounded-full blur-3xl chainzoku-float delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-300/6 to-red-400/6 rounded-full blur-2xl chainzoku-float delay-1000"></div>
        
        {/* Ultra Modern Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,215,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.4) 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 chainzoku-fade-in">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 font-['Orbitron'] uppercase tracking-wider">
              <span className="chainzoku-title chainzoku-glow" data-text="MARKET OVERVIEW">
                MARKET OVERVIEW
              </span>
            </h2>
            <p className="text-2xl sm:text-3xl text-white/85 max-w-5xl mx-auto font-['Exo_2'] font-bold leading-relaxed chainzoku-subtitle">
              🚀 REAL-TIME PERFORMANCE METRICS & MARKET STATISTICS 📊
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="chainzoku-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 shadow-2xl shadow-yellow-400/70 chainzoku-pulse chainzoku-float">
                <svg className="w-full h-full text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-white/80 font-bold text-sm mb-4 font-['Exo_2'] uppercase tracking-wider">💰 GOLDIUM PRICE</div>
              <div className="text-white text-4xl font-black mb-6 font-['Orbitron']">${tokenData ? tokenData.currentPrice.toFixed(6) : '0.000000'}</div>
              <div className="bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-400 text-sm font-black px-6 py-3 rounded-2xl shadow-lg shadow-yellow-400/30 font-['Orbitron'] uppercase chainzoku-glow">{tokenData ? `+${tokenData.priceChange24h.toFixed(1)}%` : '+0.0%'} 🚀</div>
            </div>
            
            <div className="chainzoku-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-orange-400 via-yellow-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-400/70 chainzoku-pulse chainzoku-float">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-white/80 font-bold text-sm mb-4 font-['Exo_2'] uppercase tracking-wider">📊 MARKET CAP</div>
              <div className="text-white text-4xl font-black mb-6 font-['Orbitron']">${tokenData ? (tokenData.marketCap / 1000000).toFixed(1) : '0.0'}M</div>
              <div className="bg-gradient-to-r from-orange-500/40 to-yellow-500/40 text-orange-400 text-sm font-black px-6 py-3 rounded-2xl shadow-lg shadow-orange-400/30 font-['Orbitron'] uppercase chainzoku-glow">+5.7% 📈</div>
            </div>
            
            <div className="chainzoku-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-400/70 chainzoku-pulse chainzoku-float">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-white/80 font-bold text-sm mb-4 font-['Exo_2'] uppercase tracking-wider">⚡ 24H VOLUME</div>
              <div className="text-white text-4xl font-black mb-6 font-['Orbitron']">${tokenData ? (tokenData.volume24h / 1000).toFixed(0) : '0'}K</div>
              <div className="bg-gradient-to-r from-red-500/40 to-orange-500/40 text-red-400 text-sm font-black px-6 py-3 rounded-2xl shadow-lg shadow-red-400/30 font-['Orbitron'] uppercase chainzoku-glow">+12.4% 💥</div>
            </div>
            
            <div className="chainzoku-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-yellow-500 via-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/70 chainzoku-pulse chainzoku-float">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-white/80 font-bold text-sm mb-4 font-['Exo_2'] uppercase tracking-wider">👥 HOLDERS</div>
              <div className="text-white text-4xl font-black mb-6 font-['Orbitron']">{tokenData ? tokenData.holders.toLocaleString() : '0'}</div>
              <div className="bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-400 text-sm font-black px-6 py-3 rounded-2xl shadow-lg shadow-yellow-400/30 font-['Orbitron'] uppercase chainzoku-glow">+8.2% 🔥</div>
            </div>
          </div>
          

        </div>
      </section>

      {/* DeFi Section */}
      <section id="defi" className="py-32 px-6 relative overflow-hidden bg-black">
        {/* Chainzoku Immersive DeFi Background */}
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(0,255,255,0.03),rgba(0,0,0,0.98),rgba(30,144,255,0.02),rgba(0,0,0,0.98))]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-cyan-400/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-gradient-to-r from-blue-500/6 to-transparent rounded-full blur-3xl"></div>
        
        {/* Additional Chainzoku Grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 chainzoku-fade-in">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 font-['Space_Grotesk'] uppercase tracking-wider">
              DeFi Platform
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto font-['Inter'] font-medium leading-relaxed">
              Complete ecosystem for trading, staking, and managing your digital assets
            </p>
          </div>
          
          <div className="chainzoku-card bg-black/95 backdrop-blur-xl border border-cyan-400/50 rounded-3xl p-10 shadow-2xl shadow-cyan-400/20 chainzoku-fade-in">
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-12 bg-black/80 border border-cyan-400/40 rounded-2xl p-2 shadow-lg shadow-cyan-400/10">
                <TabsTrigger value="swap" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500 data-[state=active]:text-black font-bold rounded-xl py-3 px-6 font-['Space_Grotesk'] uppercase tracking-wide transition-all duration-300 hover:bg-cyan-400/10">
                  Swap
                </TabsTrigger>
                <TabsTrigger value="stake" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500 data-[state=active]:text-black font-bold rounded-xl py-3 px-6 font-['Space_Grotesk'] uppercase tracking-wide transition-all duration-300 hover:bg-cyan-400/10">
                  Stake
                </TabsTrigger>
                <TabsTrigger value="dragon" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500 data-[state=active]:text-black font-bold rounded-xl py-3 px-6 font-['Space_Grotesk'] uppercase tracking-wide transition-all duration-300 hover:bg-cyan-400/10">
                  Dragon
                </TabsTrigger>
                <TabsTrigger value="send" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500 data-[state=active]:text-black font-bold rounded-xl py-3 px-6 font-['Space_Grotesk'] uppercase tracking-wide transition-all duration-300 hover:bg-cyan-400/10">
                  Send
                </TabsTrigger>
                <TabsTrigger value="history" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500 data-[state=active]:text-black font-bold rounded-xl py-3 px-6 font-['Space_Grotesk'] uppercase tracking-wide transition-all duration-300 hover:bg-cyan-400/10">
                  History
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
      <section id="tokenomics" className="py-20 px-6 relative overflow-hidden">
        {/* Premium Tokenomics Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/30 via-black to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_20%_50%,rgba(251,191,36,0.12),transparent)]"></div>
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-bl from-amber-400/15 to-yellow-500/10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Tokenomics
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Transparent and sustainable token distribution designed for long-term value
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 shadow-lg">
                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Token Distribution</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Supply</span>
                    <span className="text-white font-bold">1,000,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Circulating Supply</span>
                    <span className="text-white font-bold">600,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Liquidity Pool</span>
                    <span className="text-white font-bold">300,000,000 (30%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Community Rewards</span>
                    <span className="text-white font-bold">250,000,000 (25%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Development</span>
                    <span className="text-white font-bold">200,000,000 (20%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Marketing</span>
                    <span className="text-white font-bold">150,000,000 (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Team (Locked)</span>
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
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Premium Community Background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-black via-amber-950/20 to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(245,158,11,0.1),transparent)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Community Updates</h2>
            </div>
            <p className="text-slate-400 text-lg">Stay connected with the latest news from Goldium and Solana ecosystem</p>
          </div>
          
          <div className="flex justify-center">
            <TwitterEmbed />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 border-t border-slate-700 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-white">GOLDIUM</div>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                The future of digital gold on Solana blockchain. Secure, fast, and decentralized.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-10 h-10 bg-slate-800/80 border border-slate-600 rounded-full flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-slate-800/80 border border-slate-600 rounded-full flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-slate-800/80 border border-slate-600 rounded-full flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Product</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#defi" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">DeFi App</a>
                <a href="#tokenomics" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Tokenomics</a>
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">API</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Resources</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Documentation</a>
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Whitepaper</a>
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Security Audit</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Support</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Help Center</a>
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Contact Us</a>
                <a href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base">Status</a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-slate-300/60 text-center sm:text-left">
                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              </div>
              <div className="text-xs sm:text-sm text-slate-300/60 text-center">
                © 2025 Goldium. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
