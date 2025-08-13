import { GOLD_CONTRACT_ADDRESS } from '@/services/gold-token-service';

export interface TransactionInfo {
  signature: string;
  type: 'swap' | 'send' | 'stake' | 'unstake' | 'mint';
  token: 'SOL' | 'GOLD';
  amount: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  contractAddress?: string;
}

export class SolscanTracker {
  private static instance: SolscanTracker;
  private transactions: TransactionInfo[] = [];
  private readonly STORAGE_KEY = 'goldium_wallet_history';

  static getInstance(): SolscanTracker {
    if (!SolscanTracker.instance) {
      SolscanTracker.instance = new SolscanTracker();
    }
    return SolscanTracker.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  // Load transaction history from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.transactions = data.map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        }));
        console.log(`📋 Loaded ${this.transactions.length} transactions from wallet history`);
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
      this.transactions = [];
    }
  }

  // Save transaction history to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactions));
      console.log(`💾 Auto-saved ${this.transactions.length} transactions to wallet history`);
    } catch (error) {
      console.error('Error saving transaction history:', error);
    }
  }

  // Track transaction with proper contract address - ALL DeFi transactions use the same CA
  trackTransaction(txInfo: Omit<TransactionInfo, 'timestamp' | 'status'>): TransactionInfo {
    const transaction: TransactionInfo = {
      ...txInfo,
      timestamp: new Date(),
      status: 'pending',
      contractAddress: 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump' // All DeFi operations track to this CA
    };

    this.transactions.unshift(transaction);
    
    // Keep only last 50 transactions
    if (this.transactions.length > 50) {
      this.transactions = this.transactions.slice(0, 50);
    }

    // AUTO-SAVE to wallet history
    this.saveToStorage();

    console.log('🔍 Transaction tracked for Solscan:', {
      signature: transaction.signature,
      type: transaction.type,
      token: transaction.token,
      amount: transaction.amount,
      contractAddress: transaction.contractAddress,
      solscanUrl: this.getSolscanUrl(transaction.signature)
    });

    return transaction;
  }

  // Update transaction status
  updateTransactionStatus(signature: string, status: 'confirmed' | 'failed'): void {
    const tx = this.transactions.find(t => t.signature === signature);
    if (tx) {
      tx.status = status;
      
      // AUTO-SAVE status updates to wallet history
      this.saveToStorage();
      
      console.log(`✅ Transaction ${signature} status updated to: ${status}`);
      
      if (status === 'confirmed') {
        console.log(`🔗 View on Solscan: ${this.getSolscanUrl(signature)}`);
      }
    }
  }

  // Get Solscan URL for transaction
  getSolscanUrl(signature: string): string {
    return `https://solscan.io/tx/${signature}`;
  }

  // Get Solscan URL for contract address
  getContractUrl(contractAddress: string): string {
    return `https://solscan.io/token/${contractAddress}`;
  }

  // Get recent transactions
  getRecentTransactions(limit: number = 10): TransactionInfo[] {
    return this.transactions.slice(0, limit);
  }

  // Get transactions by type
  getTransactionsByType(type: TransactionInfo['type']): TransactionInfo[] {
    return this.transactions.filter(tx => tx.type === type);
  }

  // Generate mock transaction signature for demo
  generateMockSignature(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Show contract address info - All DeFi operations use the same tracking CA
  showContractInfo(token: 'SOL' | 'GOLD'): void {
    const MAIN_TRACKING_CA = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
    console.log(`🏦 Main DeFi Tracking CA (starts with "AP"): ${MAIN_TRACKING_CA}`);
    console.log('🔗 View All DeFi Transactions on Solscan:', this.getContractUrl(MAIN_TRACKING_CA));
    console.log('📊 All Swap, Send, and Staking operations are tracked to this address');
  }
}

// Export singleton instance
export const solscanTracker = SolscanTracker.getInstance();