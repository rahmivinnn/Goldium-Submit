import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Wallet, Copy, ExternalLink, Check } from 'lucide-react';
import { useExternalWallets, SupportedWallet } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { SOLSCAN_BASE_URL } from '@/lib/constants';

interface WalletOption {
  type: SupportedWallet;
  name: string;
  icon: string;
  description: string;
}

const walletOptions: WalletOption[] = [
  {
    type: 'phantom',
    name: 'Phantom',
    icon: '🟣',
    description: 'Most popular Solana wallet',
  },
  {
    type: 'solflare',
    name: 'Solflare',
    icon: '🔥',
    description: 'Feature-rich Solana wallet',
  },
  {
    type: 'backpack',
    name: 'Backpack',
    icon: '🎒',
    description: 'Modern crypto wallet',
  },
  {
    type: 'trust',
    name: 'Trust Wallet',
    icon: '🔷',
    description: 'Secure multi-coin wallet',
  },
];

export function ExternalWalletSelector() {
  const wallet = useExternalWallets();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const availableWallets = wallet.getAvailableWallets();
  const currentWallet = walletOptions.find(w => w.type === wallet.selectedWallet);

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (!wallet.address) return;
    
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // View wallet on Solscan
  const viewOnSolscan = () => {
    if (!wallet.address) return;
    window.open(`${SOLSCAN_BASE_URL}/account/${wallet.address}`, '_blank');
  };

  // Handle wallet selection with forced popup
  const handleWalletSelect = async (walletType: SupportedWallet) => {
    if (wallet.selectedWallet === walletType) {
      setIsOpen(false);
      return;
    }

    // Show connecting state immediately
    setIsOpen(false);
    
    try {
      // Show switching message if already connected to another wallet
      if (wallet.connected && wallet.selectedWallet) {
        toast({
          title: "Switching Wallets",
          description: `Switching from ${walletOptions.find(w => w.type === wallet.selectedWallet)?.name} to ${walletOptions.find(w => w.type === walletType)?.name}`,
        });
      }
      
      // Direct wallet connection through our hook only - avoid double connection
      await wallet.connectWallet(walletType);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletOptions.find(w => w.type === walletType)?.name}`,
      });
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || `Please approve the connection in your ${walletOptions.find(w => w.type === walletType)?.name} extension popup`,
        variant: "destructive",
      });
    }
  };

  // Show connect button if not connected
  if (!wallet.connected) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            disabled={wallet.connecting}
            className="bg-galaxy-button border-galaxy-purple/30 text-white hover:border-galaxy-blue/50"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-80 bg-galaxy-card border-galaxy-purple/30 z-50"
        >
          <DropdownMenuLabel className="text-galaxy-bright px-4">Connect Your Wallet</DropdownMenuLabel>
          
          <div className="p-2 space-y-1">
            {walletOptions.map((walletOption) => {
              const isAvailable = availableWallets.includes(walletOption.type);
              
              return (
                <DropdownMenuItem
                  key={walletOption.type}
                  onClick={() => isAvailable && handleWalletSelect(walletOption.type)}
                  className={`
                    text-galaxy-bright hover:bg-galaxy-purple/20 cursor-pointer p-3 rounded-md
                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-galaxy-blue/20'}
                  `}
                  disabled={!isAvailable}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{walletOption.icon}</span>
                      <div>
                        <div className="font-medium">{walletOption.name}</div>
                        <div className="text-xs text-galaxy-accent">{walletOption.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isAvailable ? (
                        <span className="text-xs text-green-400 px-2 py-1 bg-green-500/20 rounded">
                          Detected
                        </span>
                      ) : (
                        <span className="text-xs text-galaxy-accent px-2 py-1 bg-galaxy-accent/20 rounded">
                          Not Found
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>

          {availableWallets.length === 0 && (
            <div className="p-4 text-center text-sm text-galaxy-accent border-t border-galaxy-purple/30 mt-2">
              <p className="mb-2">No wallet extensions found.</p>
              <p className="text-xs">Please install and refresh the page:</p>
              <div className="text-xs mt-1 space-y-1">
                <div>• Phantom Wallet</div>
                <div>• Solflare Wallet</div>
                <div>• Backpack Wallet</div>
                <div>• Trust Wallet</div>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show connected wallet info
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="bg-galaxy-card border-galaxy-purple/30 hover:border-galaxy-blue/50 text-galaxy-bright"
        >
          <span className="mr-2">{currentWallet?.icon}</span>
          <span className="hidden sm:inline">
            {wallet.address ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}` : 'Wallet'}
          </span>
          <span className="sm:hidden">{currentWallet?.name}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-galaxy-card border-galaxy-purple/30"
      >
        {/* Connected Wallet Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-galaxy-bright">Connected Wallet</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-galaxy-accent">Wallet:</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs">{currentWallet?.icon}</span>
                <span className="text-xs text-galaxy-bright">{currentWallet?.name}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-galaxy-accent">Address:</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-galaxy-bright">
                  {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}` : 'N/A'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 hover:bg-galaxy-purple/20"
                  disabled={!wallet.address}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-galaxy-accent">Balance:</span>
              <span className="text-xs font-medium text-galaxy-bright">
                {wallet.balance.toFixed(4)} SOL
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-galaxy-purple/30" />

        {/* Switch Wallet */}
        <DropdownMenuLabel className="text-galaxy-bright px-4">Switch Wallet</DropdownMenuLabel>
        
        <div className="p-2 space-y-1">
          {walletOptions.map((walletOption) => {
            const isAvailable = availableWallets.includes(walletOption.type);
            const isSelected = wallet.selectedWallet === walletOption.type;
            
            return (
              <DropdownMenuItem
                key={walletOption.type}
                onClick={() => isAvailable && !isSelected && handleWalletSelect(walletOption.type)}
                className={`
                  text-galaxy-bright hover:bg-galaxy-purple/20 cursor-pointer p-3 rounded-md
                  ${isSelected ? 'bg-galaxy-purple/30' : ''}
                  ${!isAvailable ? 'opacity-50' : ''}
                `}
                disabled={!isAvailable || isSelected}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{walletOption.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{walletOption.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-green-400" />}
                      </div>
                      <span className="text-xs text-galaxy-accent">{walletOption.description}</span>
                    </div>
                  </div>
                  {!isAvailable && (
                    <span className="text-xs text-galaxy-accent">Not Detected</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="bg-galaxy-purple/30" />

        {/* Wallet Actions */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-galaxy-bright hover:bg-galaxy-purple/20 cursor-pointer"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={viewOnSolscan}
            className="text-galaxy-bright hover:bg-galaxy-purple/20 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Solscan
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={wallet.disconnectWallet}
            className="text-red-400 hover:bg-red-500/20 cursor-pointer"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </div>

        {/* Network Info */}
        <DropdownMenuSeparator className="bg-galaxy-purple/30" />
        <div className="p-4">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-xs font-medium text-green-400">Solana Mainnet</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}