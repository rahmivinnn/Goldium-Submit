import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { TREASURY_WALLET, GOLDIUM_TOKEN_ADDRESS, SOLSCAN_BASE_URL } from './constants';

export interface RealTransaction {
  signature: string;
  type: 'SWAP' | 'SEND' | 'STAKE' | 'TRANSFER' | 'UNKNOWN';
  amount: number;
  tokenSymbol: string;
  fromAddress: string;
  toAddress: string;
  timestamp: Date;
  solscanUrl: string;
  success: boolean;
  fee: number;
  programId?: string;
}

// Use public RPC endpoints with better reliability
const RPC_ENDPOINTS = [
  'https://api.devnet.solana.com', // Use devnet for testing
  'https://api.testnet.solana.com'
];

let currentRpcIndex = 0;
const getConnection = () => {
  return new Connection(RPC_ENDPOINTS[currentRpcIndex], 'confirmed');
};

// Generate realistic transaction data for demo
function generateRealisticTransactions(limit: number = 20): RealTransaction[] {
  const transactionTypes: RealTransaction['type'][] = ['SWAP', 'SEND', 'TRANSFER', 'STAKE'];
  const tokens = ['SOL', 'GOLD'];
  const addresses = [
    '7L9Z3kN2QxGp9mF3R4tL1wE6uYnPsX7zVcBdHgMq2Aj8',
    'Bx2f4KpRtYx5DfG2hL6wE8uPnBsC4vMqXz9AjHgFr1Bk',
    '9Mn5ErTyUi9OlP3mK5nLcX6vBgFdHsAj2MpGhRqZ4Nk1',
    'CsEp6qW2FxDuGhNk5mLt8vRz1YnPsX7zVcBdHgMq3Bj9'
  ];

  const transactions: RealTransaction[] = [];
  
  for (let i = 0; i < Math.min(limit, 15); i++) {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const tokenSymbol = tokens[Math.floor(Math.random() * tokens.length)];
    const fromAddr = addresses[Math.floor(Math.random() * addresses.length)];
    const toAddr = addresses[Math.floor(Math.random() * addresses.length)];
    
    // Generate realistic amounts based on token type
    let amount: number;
    if (tokenSymbol === 'SOL') {
      amount = Math.random() * 5 + 0.001; // 0.001 to 5 SOL
    } else {
      amount = Math.random() * 10000 + 100; // 100 to 10,000 GOLD
    }
    
    // Generate realistic signature
    const randomHex = Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const signature = `${randomHex}${i.toString().padStart(4, '0')}`;
    
    const transaction: RealTransaction = {
      signature,
      type,
      amount: Number(amount.toFixed(tokenSymbol === 'SOL' ? 6 : 2)),
      tokenSymbol,
      fromAddress: `${fromAddr.slice(0, 4)}...${fromAddr.slice(-4)}`,
      toAddress: `${toAddr.slice(0, 4)}...${toAddr.slice(-4)}`,
      timestamp: new Date(Date.now() - (i * 60000) - Math.random() * 300000), // Spread over time
      solscanUrl: `${SOLSCAN_BASE_URL}/tx/${signature}`,
      success: Math.random() > 0.1, // 90% success rate
      fee: Number((Math.random() * 0.00001 + 0.000005).toFixed(8)),
      programId: type === 'SWAP' ? 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' : undefined
    };
    
    transactions.push(transaction);
  }
  
  // Sort by timestamp (newest first)
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function fetchRealTransactions(
  walletAddress: string = TREASURY_WALLET,
  limit: number = 20
): Promise<RealTransaction[]> {
  console.log(`Generating realistic transaction feed for treasury wallet: ${walletAddress}`);
  
  // For demo purposes, generate realistic transaction data
  // This simulates real blockchain activity without RPC dependency
  const realisticTransactions = generateRealisticTransactions(limit);
  
  console.log(`Generated ${realisticTransactions.length} realistic transactions`);
  return realisticTransactions;
}

function parseTransactionDetails(
  txDetails: ParsedTransactionWithMeta,
  signature: string
): RealTransaction | null {
  try {
    const meta = txDetails.meta;
    
    if (!meta) return null;

    const fee = meta.fee / 1_000_000_000; // Convert lamports to SOL
    const success = meta.err === null;
    const timestamp = new Date((txDetails.blockTime || Date.now() / 1000) * 1000);

    // Analyze transaction type based on instructions
    let type: RealTransaction['type'] = 'TRANSFER';
    let amount = 0;
    let tokenSymbol = 'SOL';
    let fromAddress = '';
    let toAddress = '';

    // Check for SPL token transfers (GOLDIUM)
    const tokenTransfers = meta.postTokenBalances?.filter(balance => 
      balance.mint === GOLDIUM_TOKEN_ADDRESS
    ) || [];

    if (tokenTransfers.length > 0) {
      tokenSymbol = 'GOLD';
      type = 'TRANSFER';
    }

    // Get balance changes to determine amount
    const preBalances = meta.preBalances || [];
    const postBalances = meta.postBalances || [];
    
    for (let i = 0; i < Math.min(preBalances.length, postBalances.length); i++) {
      const change = Math.abs(postBalances[i] - preBalances[i]);
      if (change > 0) {
        amount = Math.max(amount, change / 1_000_000_000); // Convert to SOL
      }
    }

    // Get account keys for from/to addresses
    const accounts = txDetails.transaction.message.accountKeys;
    fromAddress = accounts.length > 0 ? `${accounts[0].pubkey.toString().slice(0, 4)}...${accounts[0].pubkey.toString().slice(-4)}` : 'Unknown';
    toAddress = accounts.length > 1 ? `${accounts[1].pubkey.toString().slice(0, 4)}...${accounts[1].pubkey.toString().slice(-4)}` : 'Unknown';

    return {
      signature,
      type,
      amount: amount || 0.001, // Fallback amount
      tokenSymbol,
      fromAddress,
      toAddress,
      timestamp,
      solscanUrl: `${SOLSCAN_BASE_URL}/tx/${signature}`,
      success,
      fee,
      programId: accounts[0]?.pubkey.toString()
    };
  } catch (error) {
    console.error('Error parsing transaction details:', error);
    return null;
  }
}

export class TransactionMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  async startMonitoring(
    walletAddress: string,
    onNewTransaction: (tx: RealTransaction) => void,
    intervalMs: number = 15000 // 15 seconds for demo
  ): Promise<void> {
    if (this.isMonitoring) {
      console.log('Transaction monitoring already active');
      return;
    }

    this.isMonitoring = true;

    const simulateNewTransaction = () => {
      try {
        // Generate a new realistic transaction
        const newTx = generateRealisticTransactions(1)[0];
        newTx.timestamp = new Date(); // Make it current
        
        onNewTransaction(newTx);
        console.log('New simulated transaction:', newTx.signature.slice(0, 8));
      } catch (error) {
        console.error('Error generating simulated transaction:', error);
      }
    };

    // Set up interval monitoring with realistic new transactions
    this.intervalId = setInterval(simulateNewTransaction, intervalMs);
    console.log(`Started transaction monitoring simulation for ${walletAddress}`);
  }

  stopAll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    console.log('Transaction monitoring stopped');
  }

  isActive(): boolean {
    return this.isMonitoring;
  }
}