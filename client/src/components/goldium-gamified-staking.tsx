import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Flame, Star, Trophy } from 'lucide-react';

interface StakingData {
  amount: number;
  startTime: number;
  rewards: number;
  stage: number;
}

interface StageInfo {
  name: string;
  minDays: number;
  apy: number;
  icon: string;
  description: string;
  color: string;
}

const STAKING_STAGES: StageInfo[] = [
  {
    name: "Golden Egg",
    minDays: 0,
    apy: 10,
    icon: "/assets/golden-egg.svg",
    description: "Your GOLD is incubating...",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    name: "Cracked Egg",
    minDays: 7,
    apy: 12,
    icon: "/assets/cracked-egg.svg",
    description: "Something is stirring inside!",
    color: "from-orange-400 to-yellow-500"
  },
  {
    name: "Baby Dragon",
    minDays: 30,
    apy: 15,
    icon: "/assets/baby-dragon.svg",
    description: "Your dragon has hatched!",
    color: "from-red-400 to-orange-500"
  },
  {
    name: "Golden Dragon",
    minDays: 90,
    apy: 20,
    icon: "/assets/full-dragon.svg",
    description: "Legendary Golden Dragon!",
    color: "from-yellow-300 to-amber-500"
  }
];

const GoldiumGamifiedStaking: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [goldBalance, setGoldBalance] = useState<number>(0);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<StageInfo>(STAKING_STAGES[0]);
  const [stakingDays, setStakingDays] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Mock connection for demo purposes
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  useEffect(() => {
    if (connected && publicKey) {
      fetchGoldBalance();
      loadStakingData();
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (stakingData) {
      const interval = setInterval(() => {
        updateStakingProgress();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stakingData]);

  const fetchGoldBalance = async () => {
    try {
      // Mock GOLD balance - in real implementation, fetch SPL token balance
      const mockBalance = Math.random() * 10000;
      setGoldBalance(mockBalance);
    } catch (error) {
      console.error('Error fetching GOLD balance:', error);
    }
  };

  const loadStakingData = () => {
    // Load from localStorage for demo
    const saved = localStorage.getItem(`staking_${publicKey?.toString()}`);
    if (saved) {
      const data = JSON.parse(saved);
      setStakingData(data);
      updateStakingProgress(data);
    }
  };

  const saveStakingData = (data: StakingData) => {
    localStorage.setItem(`staking_${publicKey?.toString()}`, JSON.stringify(data));
  };

  const updateStakingProgress = (data?: StakingData) => {
    const currentData = data || stakingData;
    if (!currentData) return;

    const now = Date.now();
    const elapsed = now - currentData.startTime;
    const days = elapsed / (1000 * 60 * 60 * 24);
    setStakingDays(days);

    // Calculate rewards
    const stage = getCurrentStage(days);
    setCurrentStage(stage);
    
    const yearlyRewards = (currentData.amount * stage.apy) / 100;
    const dailyRewards = yearlyRewards / 365;
    const totalRewards = dailyRewards * days;
    
    const updatedData = { ...currentData, rewards: totalRewards };
    setStakingData(updatedData);
    saveStakingData(updatedData);

    // Progress to next stage
    const nextStage = STAKING_STAGES.find(s => s.minDays > days);
    if (nextStage) {
      const progressToNext = ((days - stage.minDays) / (nextStage.minDays - stage.minDays)) * 100;
      setProgress(Math.min(progressToNext, 100));
    } else {
      setProgress(100);
    }
  };

  const getCurrentStage = (days: number): StageInfo => {
    for (let i = STAKING_STAGES.length - 1; i >= 0; i--) {
      if (days >= STAKING_STAGES[i].minDays) {
        return STAKING_STAGES[i];
      }
    }
    return STAKING_STAGES[0];
  };

  const handleStake = async () => {
    if (!stakeAmount || !connected) return;
    
    setLoading(true);
    try {
      const amount = parseFloat(stakeAmount);
      if (amount > goldBalance) {
        alert('Insufficient GOLD balance');
        return;
      }

      // Mock staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStakingData: StakingData = {
        amount: stakingData ? stakingData.amount + amount : amount,
        startTime: stakingData?.startTime || Date.now(),
        rewards: stakingData?.rewards || 0,
        stage: 0
      };
      
      setStakingData(newStakingData);
      saveStakingData(newStakingData);
      setGoldBalance(prev => prev - amount);
      setStakeAmount('');
      
      alert('Successfully staked GOLD!');
    } catch (error) {
      console.error('Staking error:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!stakingData) return;
    
    setLoading(true);
    try {
      // Mock unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalReturn = stakingData.amount + stakingData.rewards;
      setGoldBalance(prev => prev + totalReturn);
      setStakingData(null);
      localStorage.removeItem(`staking_${publicKey?.toString()}`);
      
      alert(`Successfully unstaked! Received ${totalReturn.toFixed(4)} GOLD`);
    } catch (error) {
      console.error('Unstaking error:', error);
      alert('Unstaking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!stakingData || stakingData.rewards === 0) return;
    
    setLoading(true);
    try {
      // Mock claim transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGoldBalance(prev => prev + stakingData.rewards);
      const updatedData = { ...stakingData, rewards: 0 };
      setStakingData(updatedData);
      saveStakingData(updatedData);
      
      alert(`Successfully claimed ${stakingData.rewards.toFixed(4)} GOLD rewards!`);
    } catch (error) {
      console.error('Claim error:', error);
      alert('Claim failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold mb-2">Connect Wallet to Start</h3>
          <p className="text-gray-600">Connect your Phantom wallet to access Goldium Gamified Staking</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Goldium Gamified Staking
          </CardTitle>
          <p className="text-yellow-100">Stake GOLD and watch your dragon evolve!</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dragon Evolution Display */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Dragon Evolution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {stakingData ? (
              <div className="space-y-4">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${currentStage.color} flex items-center justify-center animate-pulse shadow-lg p-2`}>
                  <img 
                    src={currentStage.icon} 
                    alt={currentStage.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <Badge className={`bg-gradient-to-r ${currentStage.color} text-white`}>
                    {currentStage.name}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">{currentStage.description}</p>
                  <p className="text-xs text-gray-500">APY: {currentStage.apy}%</p>
                </div>
                
                {/* Progress to next stage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Days Staked: {stakingDays.toFixed(1)}</span>
                    <span>Next Stage: {STAKING_STAGES.find(s => s.minDays > stakingDays)?.name || 'Max Level'}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center p-4">
                  <div className="text-4xl text-gray-400">?</div>
                </div>
                <p className="text-gray-500">Start staking to begin your dragon journey!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staking Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Staking Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Balances */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="font-bold">{goldBalance.toFixed(4)} GOLD</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Staked Amount</p>
                <p className="font-bold">{stakingData?.amount.toFixed(4) || '0.0000'} GOLD</p>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Pending Rewards</p>
              <p className="font-bold text-yellow-600 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {stakingData?.rewards.toFixed(6) || '0.000000'} GOLD
              </p>
            </div>

            {/* Actions */}
            {!stakingData ? (
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Amount to stake"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  max={goldBalance}
                />
                <Button 
                  onClick={handleStake} 
                  disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                >
                  {loading ? 'Staking...' : 'Start Staking'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleClaimRewards} 
                    disabled={loading || !stakingData.rewards || stakingData.rewards === 0}
                    variant="outline"
                    size="sm"
                  >
                    {loading ? 'Claiming...' : 'Claim Rewards'}
                  </Button>
                  <Button 
                    onClick={handleUnstake} 
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    {loading ? 'Unstaking...' : 'Unstake All'}
                  </Button>
                </div>
                
                {/* Additional staking */}
                <div className="border-t pt-3 space-y-2">
                  <Input
                    type="number"
                    placeholder="Add more GOLD"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    max={goldBalance}
                    size="sm"
                  />
                  <Button 
                    onClick={handleStake} 
                    disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    {loading ? 'Adding...' : 'Add to Stake'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stages Info */}
      <Card>
        <CardHeader>
          <CardTitle>Evolution Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STAKING_STAGES.map((stage, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentStage.name === stage.name 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto">
                    <img 
                      src={stage.icon} 
                      alt={stage.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="font-bold text-sm">{stage.name}</h4>
                  <p className="text-xs text-gray-600">{stage.minDays}+ days</p>
                  <Badge variant="secondary" className="text-xs">
                    {stage.apy}% APY
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoldiumGamifiedStaking;