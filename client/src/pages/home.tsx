import { useExternalWallets } from '@/hooks/use-external-wallets';
import { ExternalWalletSelector } from '@/components/external-wallet-selector';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BalanceCards } from '@/components/balance-cards';
import { SelfContainedSwapTab } from '@/components/self-contained-swap-tab';
import { RealSendTab } from '@/components/real-send-tab';
import { RealStakingTab } from '@/components/real-staking-tab';
import { TransactionHistory } from '@/components/transaction-history';
import { RealTransactionHistory } from '@/components/real-transaction-history';
import { GoldSendTab } from '@/components/gold-send-tab';
import { GoldStakingTab } from '@/components/gold-staking-tab';
import { WalletConnectionGuide } from '@/components/wallet-connection-guide';
import { BalanceStatusIndicator } from '@/components/balance-status-indicator';
import { SolanaLearnCard } from '@/components/solana-learn-card';
import { GoldPriceWidget } from '@/components/gold-price-widget';
import { RealTransactionFeed } from '@/components/real-transaction-feed';
import { GoldiumSentimentTrends } from '@/components/goldium-sentiment-trends';
import { BalanceDebug } from '@/components/balance-debug';
import { BlockchainEducation } from '@/components/blockchain-education';
import { SimpleThreeScene } from '@/components/simple-three-scene';
import { SolanaTokenAnimation } from '@/components/solana-token-animation';
import { MiniGamesHub } from '@/components/mini-games-hub';
import { TwitterEmbed } from '@/components/twitter-embed';

import { Info } from 'lucide-react';
import { Link } from 'wouter';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';
import { SolanaIcon } from '@/components/solana-icon';


export default function Home() {
  const wallet = useExternalWallets();

  // Self-contained wallet is always connected, no need for wallet selection

  return (
    <div className="min-h-screen">
      {/* Galaxy Background Pattern */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-galaxy-gradient opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-galaxy-purple/10 via-transparent to-galaxy-pink/10" />
      </div>
      
      {/* Main Container */}
      <div className="relative min-h-screen">
        {/* Header */}
        <header className="border-b border-galaxy-purple/30 bg-galaxy-card backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src={logoImage} 
                    alt="Goldium Logo" 
                    className="w-10 h-10 object-contain logo-spin"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    Goldium
                  </h1>
                  <p className="text-xs text-galaxy-accent">DeFi Exchange</p>
                </div>
              </div>
              
              {/* Navigation & Wallet */}
              <div className="flex items-center space-x-4">
                {/* About Button */}
                <Link href="/about">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-galaxy-accent hover:text-galaxy-bright hover:bg-galaxy-purple/20 interactive-hover"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </Button>
                </Link>
                
                {/* Balance Status Indicator */}
                <div className="hidden md:block">
                  <BalanceStatusIndicator 
                    connected={wallet.connected}
                    balance={wallet.balance}
                    walletType={wallet.selectedWallet || undefined}
                  />
                </div>
                
                {/* Network Status */}
                <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full network-status">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">Mainnet</span>
                </div>
                
                {/* External Wallet Selector */}
                <ExternalWalletSelector />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wallet Connection Status */}
          {wallet.connected && wallet.balance === 0 && (
            <div className="mb-6">
              <WalletConnectionGuide 
                walletType={wallet.selectedWallet || undefined} 
                showFundingInstructions={true} 
              />
            </div>
          )}
          
          {/* Balance Cards with Price Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3 stagger-item">
              <BalanceCards />
            </div>
            <div className="space-y-6">
              <div className="stagger-item">
                <GoldPriceWidget />
              </div>
              <div className="stagger-item">
                <SolanaLearnCard />
              </div>
            </div>
          </div>

          {/* Enhanced DeFi Tab Navigation with New Features - Always Visible */}
          <Card className="bg-galaxy-card border-galaxy-purple/30 mb-8 stagger-item">
            <Tabs defaultValue="swap" className="w-full">
                  <TabsList className="grid w-full grid-cols-8 bg-galaxy-purple/20 border-b border-galaxy-purple/30">
                    <TabsTrigger
                      value="swap"
                      className="data-[state=active]:bg-blue-gradient data-[state=active]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <SolanaIcon size={16} className="text-blue-400" />
                        Swap
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="send"
                      className="data-[state=active]:bg-blue-gradient data-[state=active]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <SolanaIcon size={16} className="text-purple-400" />
                        Send SOL
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="gold-send"
                      className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <img src={logoImage} alt="GOLD" className="w-4 h-4 object-contain" />
                        Send GOLD
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="staking"
                      className="data-[state=active]:bg-blue-gradient data-[state=active]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <SolanaIcon size={16} className="text-purple-400" />
                        SOL Stake
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="gold-staking"
                      className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <img src={logoImage} alt="GOLD" className="w-4 h-4 object-contain" />
                        GOLD Stake
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="learn"
                      className="data-[state=active]:bg-blue-gradient data-[state=active]:text-white"
                    >
                      <span className="mr-2">🎓</span>Learn
                    </TabsTrigger>
                    <TabsTrigger
                      value="games"
                      className="data-[state=active]:bg-blue-gradient data-[state=active]:text-white"
                    >
                      <span className="mr-2">🎮</span>Games
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="data-[state=active]:bg-blue-gradient data-[state=active]:text-white"
                    >
                      <span className="mr-2">𝕏</span>Social
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="swap" className="mt-0 animate-tab-enter">
                      <SelfContainedSwapTab />
                    </TabsContent>
                    <TabsContent value="send" className="mt-0 animate-tab-enter">
                      <RealSendTab />
                    </TabsContent>
                    <TabsContent value="gold-send" className="mt-0 animate-tab-enter">
                      <GoldSendTab />
                    </TabsContent>
                    <TabsContent value="staking" className="mt-0 animate-tab-enter">
                      <RealStakingTab />
                    </TabsContent>
                    <TabsContent value="gold-staking" className="mt-0 animate-tab-enter">
                      <GoldStakingTab />
                    </TabsContent>
                    
                    <TabsContent value="learn" className="mt-0 animate-tab-enter">
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <SolanaTokenAnimation width={600} height={350} className="shadow-2xl float-animation" />
                        </div>
                        <BlockchainEducation />
                      </div>
                    </TabsContent>

                    <TabsContent value="games" className="mt-0 animate-tab-enter">
                      <MiniGamesHub />
                    </TabsContent>

                    <TabsContent value="social" className="mt-0 animate-tab-enter">
                      <div className="space-y-6">
                        <TwitterEmbed />
                      </div>
                    </TabsContent>
                  </div>
            </Tabs>
          </Card>

          {/* Analytics and Transaction Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="stagger-item">
              <GoldiumSentimentTrends />
            </div>
            <div className="stagger-item">
              <RealTransactionFeed />
            </div>
          </div>

          {/* Real Transaction History with Solscan Links */}
          <div className="stagger-item">
            <RealTransactionHistory />
          </div>
          
          {/* GOLD Transaction History from Local Tracking */}
          <div className="mt-8 stagger-item">
            <TransactionHistory />
          </div>

          {/* Wallet Connection Reminder - Only show when not connected */}
          {!wallet.connected && (
            <Card className="bg-galaxy-card border-galaxy-purple/30 mt-8">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-galaxy-gradient/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-galaxy-bright mb-2">
                      Connect Wallet for Trading
                    </h3>
                    <p className="text-galaxy-accent mb-4">
                      Connect your wallet to access live trading, real balances, and transaction features.
                    </p>
                    <div className="bg-galaxy-purple/20 rounded-lg p-3 mb-4">
                      <p className="text-xs text-galaxy-bright mb-2">Supported: Phantom • Solflare • Backpack • Trust</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
        

      </div>
    </div>
  );
}
