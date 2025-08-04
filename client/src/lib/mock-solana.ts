// Mock Solana Web3.js classes and constants
export class PublicKey {
  private key: string;
  
  constructor(key: string | Uint8Array) {
    if (typeof key === 'string') {
      this.key = key;
    } else {
      this.key = 'MockedFromUint8Array';
    }
  }
  
  toString(): string {
    return this.key;
  }
  
  toBase58(): string {
    return this.key;
  }
  
  equals(other: PublicKey): boolean {
    return this.key === other.key;
  }
}

export class Transaction {
  instructions: any[] = [];
  feePayer?: PublicKey;
  recentBlockhash?: string;
  
  add(instruction: any): this {
    this.instructions.push(instruction);
    return this;
  }
  
  serialize(): Uint8Array {
    return new Uint8Array([1, 2, 3, 4]); // Mock serialized transaction
  }
}

export class Connection {
  constructor(private endpoint: string, private commitment?: string) {}
  
  async getBalance(publicKey: PublicKey): Promise<number> {
    // Mock balance - 2.5 SOL in lamports
    return 2500000000;
  }
  
  async getLatestBlockhash(): Promise<{ blockhash: string }> {
    return { blockhash: 'mock-blockhash-' + Date.now() };
  }
  
  async sendRawTransaction(serializedTransaction: Uint8Array): Promise<string> {
    // Mock transaction signature
    return 'mock-signature-' + Date.now() + '-' + Math.random().toString(36).substring(7);
  }
  
  async confirmTransaction(signature: string, commitment?: string): Promise<any> {
    // Mock confirmation
    return { value: { err: null } };
  }
  
  async getTransaction(signature: string, options?: any): Promise<any> {
    return {
      slot: 123456,
      meta: { err: null },
      transaction: { message: {} }
    };
  }
}

export const LAMPORTS_PER_SOL = 1000000000;

export const SystemProgram = {
  transfer: (params: {
    fromPubkey: PublicKey;
    toPubkey: PublicKey;
    lamports: number;
  }) => ({
    programId: new PublicKey('11111111111111111111111111111112'),
    keys: [
      { pubkey: params.fromPubkey, isSigner: true, isWritable: true },
      { pubkey: params.toPubkey, isSigner: false, isWritable: true },
    ],
    data: new Uint8Array([2, 0, 0, 0, ...new Array(8).fill(0)]), // Mock transfer instruction
  }),
};

// Mock SPL Token functions
export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  return new PublicKey(`${mint.toString().slice(0, 20)}${owner.toString().slice(0, 20)}`);
}

export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId: PublicKey,
  associatedTokenProgramId: PublicKey
) {
  return {
    programId: associatedTokenProgramId,
    keys: [],
    data: new Uint8Array([1]),
  };
}

export function createTransferInstruction(
  source: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: number,
  multiSigners: any[],
  programId: PublicKey
) {
  return {
    programId,
    keys: [
      { pubkey: source, isSigner: false, isWritable: true },
      { pubkey: destination, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: true, isWritable: false },
    ],
    data: new Uint8Array([3, ...new Array(8).fill(0)]),
  };
}

export async function getAccount(
  connection: Connection,
  address: PublicKey
): Promise<{ amount: bigint; mint: PublicKey }> {
  // Mock token account with some GOLD balance
  return {
    amount: BigInt(500 * Math.pow(10, 9)), // 500 GOLD tokens
    mint: new PublicKey('GoldMintAddress1234567890123456789012345'),
  };
}

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export class Keypair {
  static generate(): Keypair {
    return new Keypair();
  }
  
  get publicKey(): PublicKey {
    return new PublicKey('MockedKeypair1234567890123456789012345678');
  }
}

export async function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  signers: Keypair[]
): Promise<string> {
  return 'mock-confirmed-signature-' + Date.now();
}