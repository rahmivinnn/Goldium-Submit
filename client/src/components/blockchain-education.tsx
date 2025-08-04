import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Coins, Shield, Zap, TrendingUp, Users, Globe } from 'lucide-react';

const educationModules = [
  {
    id: 'blockchain-basics',
    title: 'Blockchain Fundamentals',
    icon: <Globe className="w-6 h-6" />,
    level: 'Beginner',
    duration: '15 min',
    description: 'Understanding distributed ledger technology and consensus mechanisms',
    content: `
      <h3>What is Blockchain?</h3>
      <p>A blockchain is a distributed, immutable ledger that maintains a continuously growing list of records (blocks) linked and secured using cryptography.</p>
      
      <h4>Key Properties:</h4>
      <ul>
        <li><strong>Decentralization:</strong> No single point of control or failure</li>
        <li><strong>Immutability:</strong> Once data is recorded, it cannot be altered</li>
        <li><strong>Transparency:</strong> All transactions are publicly verifiable</li>
        <li><strong>Consensus:</strong> Network agreement validates new transactions</li>
      </ul>

      <h4>How Blocks Work:</h4>
      <p>Each block contains:</p>
      <ul>
        <li>Transaction data</li>
        <li>Timestamp</li>
        <li>Hash of previous block</li>
        <li>Its own unique hash</li>
      </ul>
    `
  },
  {
    id: 'solana-architecture',
    title: 'Solana Architecture',
    icon: <Zap className="w-6 h-6" />,
    level: 'Intermediate',
    duration: '20 min',
    description: 'Deep dive into Solana\'s high-performance blockchain design',
    content: `
      <h3>Solana's Innovation</h3>
      <p>Solana achieves 65,000+ TPS through innovative consensus mechanisms and parallel processing.</p>
      
      <h4>Core Technologies:</h4>
      <ul>
        <li><strong>Proof of History (PoH):</strong> Cryptographic clock for ordering events</li>
        <li><strong>Gulf Stream:</strong> Mempool-less transaction forwarding</li>
        <li><strong>Sealevel:</strong> Parallel smart contract runtime</li>
        <li><strong>Turbine:</strong> Block propagation protocol</li>
        <li><strong>Cloudbreak:</strong> Horizontally scaled accounts database</li>
      </ul>

      <h4>Transaction Lifecycle:</h4>
      <ol>
        <li>Transaction created and signed by wallet</li>
        <li>Forwarded to validators via Gulf Stream</li>
        <li>Processed in parallel by Sealevel runtime</li>
        <li>Consensus achieved through Tower BFT</li>
        <li>Block finalized and distributed via Turbine</li>
      </ol>
    `
  },
  {
    id: 'defi-concepts',
    title: 'DeFi Fundamentals',
    icon: <Coins className="w-6 h-6" />,
    level: 'Beginner',
    duration: '18 min',
    description: 'Decentralized Finance protocols and mechanisms',
    content: `
      <h3>Decentralized Finance (DeFi)</h3>
      <p>DeFi recreates traditional financial instruments using smart contracts, eliminating intermediaries.</p>
      
      <h4>Core DeFi Concepts:</h4>
      <ul>
        <li><strong>Liquidity Pools:</strong> Shared token reserves for trading</li>
        <li><strong>Automated Market Makers (AMM):</strong> Algorithmic trading without order books</li>
        <li><strong>Yield Farming:</strong> Earning rewards by providing liquidity</li>
        <li><strong>Staking:</strong> Locking tokens to secure networks and earn rewards</li>
        <li><strong>Lending/Borrowing:</strong> Collateralized lending protocols</li>
      </ul>

      <h4>Risk Factors:</h4>
      <ul>
        <li>Smart contract vulnerabilities</li>
        <li>Impermanent loss in liquidity provision</li>
        <li>Market volatility and liquidation risks</li>
        <li>Regulatory uncertainty</li>
      </ul>
    `
  },
  {
    id: 'wallet-security',
    title: 'Wallet Security',
    icon: <Shield className="w-6 h-6" />,
    level: 'Essential',
    duration: '12 min',
    description: 'Best practices for securing your digital assets',
    content: `
      <h3>Wallet Security Essentials</h3>
      <p>Your private keys are your digital identity. Proper security practices are crucial for asset protection.</p>
      
      <h4>Security Best Practices:</h4>
      <ul>
        <li><strong>Hardware Wallets:</strong> Use dedicated hardware for key storage</li>
        <li><strong>Seed Phrase:</strong> Store recovery phrases securely offline</li>
        <li><strong>Multi-Signature:</strong> Require multiple signatures for transactions</li>
        <li><strong>Cold Storage:</strong> Keep large amounts in offline wallets</li>
        <li><strong>Regular Updates:</strong> Keep wallet software current</li>
      </ul>

      <h4>Common Threats:</h4>
      <ul>
        <li>Phishing attacks targeting seed phrases</li>
        <li>Malicious smart contracts</li>
        <li>Man-in-the-middle attacks</li>
        <li>Social engineering attacks</li>
      </ul>
    `
  },
  {
    id: 'trading-strategies',
    title: 'Trading Strategies',
    icon: <TrendingUp className="w-6 h-6" />,
    level: 'Advanced',
    duration: '25 min',
    description: 'Advanced trading techniques and market analysis',
    content: `
      <h3>DeFi Trading Strategies</h3>
      <p>Sophisticated approaches to generating yield and managing risk in decentralized markets.</p>
      
      <h4>Strategy Types:</h4>
      <ul>
        <li><strong>Arbitrage:</strong> Profit from price differences across exchanges</li>
        <li><strong>Grid Trading:</strong> Systematic buy/sell orders at intervals</li>
        <li><strong>Dollar-Cost Averaging:</strong> Regular purchases regardless of price</li>
        <li><strong>Yield Optimization:</strong> Maximizing returns across protocols</li>
        <li><strong>Liquidity Mining:</strong> Earning tokens for providing liquidity</li>
      </ul>

      <h4>Risk Management:</h4>
      <ul>
        <li>Position sizing and diversification</li>
        <li>Stop-loss and take-profit levels</li>
        <li>Correlation analysis</li>
        <li>Impermanent loss calculation</li>
      </ul>
    `
  },
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    icon: <Users className="w-6 h-6" />,
    level: 'Intermediate',
    duration: '22 min',
    description: 'Decentralized Autonomous Organizations and governance tokens',
    content: `
      <h3>Decentralized Autonomous Organizations</h3>
      <p>DAOs enable community-driven decision making through token-based voting mechanisms.</p>
      
      <h4>DAO Components:</h4>
      <ul>
        <li><strong>Governance Tokens:</strong> Voting rights proportional to holdings</li>
        <li><strong>Proposals:</strong> Community-submitted improvement suggestions</li>
        <li><strong>Voting Mechanisms:</strong> Various systems for decision making</li>
        <li><strong>Treasury Management:</strong> Community-controlled funds</li>
        <li><strong>Execution:</strong> Automated implementation of passed proposals</li>
      </ul>

      <h4>Voting Systems:</h4>
      <ul>
        <li>Simple majority voting</li>
        <li>Quadratic voting</li>
        <li>Conviction voting</li>
        <li>Delegated voting</li>
      </ul>
    `
  }
];

export function BlockchainEducation() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => new Set([...prev, moduleId]));
  };

  const selectedModuleData = educationModules.find(m => m.id === selectedModule);

  if (selectedModule && selectedModuleData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedModule(null)}
            className="mb-4"
          >
            ← Back to Modules
          </Button>
        </div>
        
        <Card className="bg-galaxy-card border-galaxy-purple/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              {selectedModuleData.icon}
              <div>
                <CardTitle className="text-2xl text-galaxy-text">{selectedModuleData.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{selectedModuleData.level}</Badge>
                  <Badge variant="outline">{selectedModuleData.duration}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedModuleData.content }}
            />
            
            <div className="flex justify-between items-center pt-6 border-t border-galaxy-purple/20">
              <div className="text-sm text-galaxy-muted">
                Progress: Reading {selectedModuleData.title}
              </div>
              <Button 
                onClick={() => handleModuleComplete(selectedModuleData.id)}
                disabled={completedModules.has(selectedModuleData.id)}
                className="bg-galaxy-purple hover:bg-galaxy-blue"
              >
                {completedModules.has(selectedModuleData.id) ? 'Completed ✓' : 'Mark Complete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-galaxy-text">Blockchain Education Hub</h2>
        <p className="text-galaxy-muted max-w-2xl mx-auto">
          Master blockchain technology, Solana architecture, and DeFi protocols through comprehensive educational modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationModules.map((module) => (
          <Card 
            key={module.id}
            className="bg-galaxy-card border-galaxy-purple/30 hover:border-galaxy-blue/50 transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedModule(module.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-galaxy-purple/20 group-hover:bg-galaxy-blue/20 transition-colors">
                    {module.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-galaxy-text group-hover:text-galaxy-blue transition-colors">
                      {module.title}
                    </CardTitle>
                  </div>
                </div>
                {completedModules.has(module.id) && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✓
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-galaxy-muted text-sm leading-relaxed">
                {module.description}
              </p>
              
              <div className="flex gap-2">
                <Badge 
                  variant={module.level === 'Essential' ? 'default' : 'secondary'}
                  className={module.level === 'Essential' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                >
                  {module.level}
                </Badge>
                <Badge variant="outline" className="text-galaxy-muted">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {module.duration}
                </Badge>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full group-hover:bg-galaxy-purple/20 transition-colors"
              >
                Start Learning →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 text-sm text-galaxy-muted">
          <Code className="w-4 h-4" />
          <span>Completed: {completedModules.size} / {educationModules.length} modules</span>
        </div>
      </div>
    </div>
  );
}