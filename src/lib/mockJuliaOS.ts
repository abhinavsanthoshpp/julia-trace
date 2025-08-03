// src/lib/mockJuliaOS.ts

import { Connection, ParsedTransactionWithMeta, SignatureResult } from '@solana/web3.js';

// This is a MOCK implementation to simulate what the JuliaOS framework might provide.
// In a real scenario, you would `npm install @juliaos/framework` and import from it.

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
        // The `maxSupportedTransactionVersion: 0` is important for compatibility with new transaction types
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

    // This is a mock function for Day 2.
    // It pretends to send data to an AI and get a result.
    async processWithLLM(data: any): Promise<string> {
        if (!this.llmPrompt) {
            throw new Error("LLM not configured. Use useLLM() first.");
        }
        console.log("Processing data with LLM...");
        // In a real scenario, this would make an API call to an LLM.
        // For now, we just return a formatted string.
        return `AI Analysis Result: ${JSON.stringify(data, null, 2)}`;
    }
}