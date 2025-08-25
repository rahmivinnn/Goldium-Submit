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
import { RealTimePriceTicker } from '@/components/real-time-price-ticker';
import { RealTimeNotifications } from '@/components/real-time-notifications';
import { TrendingUp, Users, Coins, ExternalLink, BarChart3, Shield, Zap, Activity, DollarSign, Wallet } from 'lucide-react';
import { AnimatedTokenomicsCharts } from '@/components/animated-tokenomics-charts';
import { realTimeDataService, RealTimeTokenData } from '@/services/real-time-data-service';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { goldTokenService } from '@/services/gold-token-service';
import { autoSaveTransaction } from "@/lib/historyUtils";
import { useGoldBalance } from '@/hooks/use-gold-balance';
import goldiumLogo from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';
import GoldiumGamifiedStaking from '@/components/goldium-gamified-staking';

export default function HomeSimple() {
  const wallet = useSolanaWallet();
  const [tokenData, setTokenData] = useState<RealTimeTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('1'); // Default 1 SOL
  
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
      setBuyAmount('1');
      
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
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-yellow-400/20 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-yellow-400 bg-yellow-400/10 overflow-hidden animate-bounce-gentle">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="text-3xl font-black text-yellow-400 animate-bounce-gentle">$GOLDIUM</div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#brand" className="text-yellow-300 hover:text-yellow-400 transition-all duration-300 font-medium hover:scale-105 animate-fade-in-up animation-delay-200">Brand</a>
              <a href="#defi" className="text-yellow-300 hover:text-yellow-400 transition-all duration-300 font-medium hover:scale-105 animate-fade-in-up animation-delay-300">DeFi</a>
              <a href="#tokenomics" className="text-yellow-300 hover:text-yellow-400 transition-all duration-300 font-medium hover:scale-105 animate-fade-in-up animation-delay-400">Tokenomics</a>
              {externalWallet.connected && (
                 <div className="flex items-center gap-4 bg-gray-800 px-4 py-2 rounded-lg border border-yellow-400 animate-fade-in-up animation-delay-450">
                   <div className="flex items-center gap-2">
                     <Wallet className="w-4 h-4 text-yellow-400" />
                     <span className="text-sm text-gray-300">
                       {externalWallet.address?.slice(0, 4)}...{externalWallet.address?.slice(-4)}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Coins className="w-4 h-4 text-yellow-400" />
                     <span className="text-sm font-semibold text-yellow-400">
                       {externalWallet.balance.toFixed(4)} SOL
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <DollarSign className="w-4 h-4 text-yellow-400" />
                     <span className="text-sm font-semibold text-yellow-400">
                       {goldBalance.balance.toFixed(2)} GOLD
                     </span>
                   </div>
                 </div>
               )}
              <div className="animate-fade-in-up animation-delay-500">
                <ExternalWalletSelector />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Real-time notifications */}
      <div className="fixed top-20 right-6 z-40">
        <RealTimeNotifications className="shadow-2xl" maxNotifications={3} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-900/10" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-8xl md:text-9xl font-black text-yellow-400 mb-8 tracking-tight animate-fade-in-up">
                <span className="inline-block animate-bounce-gentle">$</span>
                <span className="inline-block animate-slide-in-left">G</span>
                <span className="inline-block animate-slide-in-left animation-delay-100">O</span>
                <span className="inline-block animate-slide-in-left animation-delay-200">L</span>
                <span className="inline-block animate-slide-in-left animation-delay-300">D</span>
                <span className="inline-block animate-slide-in-left animation-delay-400">I</span>
                <span className="inline-block animate-slide-in-left animation-delay-500">U</span>
                <span className="inline-block animate-slide-in-left animation-delay-600">M</span>
              </h1>
              <div className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up animation-delay-700">
                DIGITAL GOLD
                <span className="block text-yellow-400 mt-2 animate-fade-in-up animation-delay-900">REVOLUTION</span>
              </div>
              <p className="text-2xl md:text-3xl text-yellow-200 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-1100">
                The Ultimate Store of Value on Solana Blockchain
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 animate-fade-in-up animation-delay-1300">
              <div className="flex flex-col gap-3 items-center">
                <div className="text-center mb-2">
                  <p className="text-yellow-300 font-semibold text-lg">💰 BUY GOLDIUM WITH SOL</p>
                  <p className="text-yellow-200/70 text-sm">Exchange Rate: 1 SOL = 21,486.893 GOLD</p>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="Enter SOL amount"
                    min="0.01"
                    step="0.01"
                    className="bg-gray-800 border border-yellow-400 text-white px-4 py-2 rounded-lg w-36 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    disabled={buyingToken}
                  />
                  <span className="text-yellow-400 font-semibold">SOL</span>
                  <span className="text-yellow-200/70">→</span>
                  <span className="text-yellow-300 font-semibold">{buyAmount ? (parseFloat(buyAmount) * 21486.893).toLocaleString() : '0'} GOLD</span>
                </div>
                <Button
                  onClick={handleBuyGoldium}
                  disabled={buyingToken || !externalWallet.connected}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-12 py-4 rounded-xl text-xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-2xl animate-pulse-gentle disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buyingToken ? 'BUYING GOLDIUM...' : 'BUY GOLDIUM WITH SOL'}
                </Button>
                {!externalWallet.connected && (
                  <p className="text-sm text-gray-400">Connect wallet to buy GOLDIUM tokens</p>
                )}
              </div>
              <button 
                onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-12 py-4 rounded-xl text-xl transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center gap-3 animate-float"
              >
                <svg className="w-6 h-6 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                FOLLOW TWITTER
              </button>
            </div>
            

          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section className="py-8 px-6 bg-gradient-to-b from-black via-gray-900/10 to-black border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in-up animation-delay-300">
            <h2 className="text-4xl font-black text-yellow-400 mb-4 animate-pulse-gentle">📊 LIVE MARKET DATA</h2>
            <p className="text-xl text-yellow-200 animate-fade-in-up animation-delay-500">Real-time price updates for SOL and GOLD tokens</p>
          </div>
          <div className="flex justify-center animate-fade-in-up animation-delay-700">
            <RealTimePriceTicker className="shadow-2xl" showConnectionStatus={true} />
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
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">📊 Token Distribution</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Total Supply</span>
                    <span className="text-white font-bold">1,000,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Circulating Supply</span>
                    <span className="text-white font-bold">750,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Liquidity Pool</span>
                    <span className="text-white font-bold">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Community Rewards</span>
                    <span className="text-white font-bold">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Development</span>
                    <span className="text-white font-bold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Marketing</span>
                    <span className="text-white font-bold">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Team (Locked)</span>
                    <span className="text-white font-bold">10%</span>
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

      {/* Footer */}
      <footer className="py-20 border-t border-yellow-400/30 bg-black/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="text-3xl font-bold text-yellow-100">GOLDIUM</div>
              <p className="text-yellow-200/70 leading-relaxed">
                The future of digital gold on Solana blockchain. Secure, fast, and decentralized.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-black/80 border border-yellow-400/40 rounded-full flex items-center justify-center hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer">
                  <span className="text-yellow-300 text-sm">X</span>
                </div>
                <div className="w-10 h-10 bg-black/80 border border-yellow-400/40 rounded-full flex items-center justify-center hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer">
                  <span className="text-yellow-300 text-sm">📱</span>
                </div>
                <div className="w-10 h-10 bg-black/80 border border-yellow-400/40 rounded-full flex items-center justify-center hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer">
                  <span className="text-yellow-300 text-sm">💬</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-100">Product</h3>
              <div className="space-y-2">
                <a href="#defi" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">DeFi App</a>
                <a href="#tokenomics" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Tokenomics</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">API</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-100">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Documentation</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Whitepaper</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Security Audit</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-100">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Help Center</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Contact Us</a>
                <a href="#" className="block text-yellow-200/70 hover:text-yellow-300 transition-colors">Status</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-yellow-400/30">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex space-x-8 text-sm text-yellow-300/60">
                <a href="#" className="hover:text-yellow-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a>
              </div>
              <div className="text-sm text-yellow-300/60">
                © 2024 Goldium. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
