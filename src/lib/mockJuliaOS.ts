// src/lib/mockJuliaOS.ts

import { Connection, ParsedTransactionWithMeta } from '@solana/web3.js'; // <-- FIXED: Removed unused 'SignatureResult'
import { TraceResult } from '../types'; // <-- NEW: Import our custom type

class OnChainInterface {
    private connection: Connection;

    constructor(chain: 'solana', rpcUrl: string) {
        if (chain !== 'solana') {
            throw new Error("Only 'solana' is supported in this mock.");
        }
        this.connection = new Connection(rpcUrl, 'confirmed');
        console.log("OnChainInterface connected to Solana.");
    }

    async getTransaction(signature: string): Promise<ParsedTransactionWithMeta | null> {
        console.log(`Fetching transaction: ${signature}`);
        const tx = await this.connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0,
        });
        return tx;
    }
}

export class JuliaOSAgent {
    private name: string;
    public onChain: OnChainInterface | null = null;
    private llmPrompt: string | null = null;

    constructor(options: { name: string }) {
        this.name = options.name;
        console.log(`Agent "${this.name}" initialized.`);
    }

    useOnChain(chain: 'solana', config: { rpcUrl: string }) {
        this.onChain = new OnChainInterface(chain, config.rpcUrl);
        return this;
    }

    useLLM(config: { provider: 'openai' | 'mock', prompt: string }) {
        this.llmPrompt = config.prompt;
        console.log(`Agent "${this.name}" is now using LLM with prompt.`);
        return this;
    }

    // FIXED: Changed 'data: any' to 'data: TraceResult[]'
    async processWithLLM(data: TraceResult[]): Promise<string> {
        if (!this.llmPrompt) {
            throw new Error("LLM not configured. Use useLLM() first.");
        }
        console.log("Processing data with LLM...");
        return `AI Analysis Result: ${JSON.stringify(data, null, 2)}`;
    }
}