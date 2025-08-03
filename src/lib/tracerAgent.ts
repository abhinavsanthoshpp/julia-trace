// src/lib/tracerAgent.ts

import { JuliaOSAgent } from './mockJuliaOS';

// We update our type definitions to include the new AI summary
export interface TraceResult {
    hop: number;
    signature: string;
    source: string;
    destination: string;
    action: string;
}

export interface FinalReport {
    trace: TraceResult[];
    summary: string;
}

export async function runTrace(startSignature: string): Promise<FinalReport> {
    const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

    // 1. Initialize the agent and define the prompt for our AI.
    const agent = new JuliaOSAgent({ name: 'TracerAgent' })
        .useOnChain('solana', { rpcUrl: SOLANA_RPC_URL })
        .useLLM({
            provider: 'mock',
            prompt: 'Analyze the following transaction trace and provide a brief, one-sentence summary.'
        });
    
    if (!agent.onChain) {
        throw new Error("On-chain interface failed to initialize.");
    }

    const results: TraceResult[] = [];
    const tx = await agent.onChain.getTransaction(startSignature);

    if (tx && tx.meta && !tx.meta.err) {
        const instructions = tx.transaction.message.instructions;
        const transferInstruction = instructions.find(ix => 'parsed' in ix && ix.parsed.type === 'transfer');

        if (transferInstruction && 'parsed' in transferInstruction) {
            const { source, destination, lamports } = transferInstruction.parsed.info;
            results.push({
                hop: 1,
                signature: startSignature,
                source,
                destination,
                action: `Transferred ${lamports / 1e9} SOL`,
            });
        } else {
             results.push({
                hop: 1,
                signature: startSignature,
                source: "N/A",
                destination: "N/A",
                action: "Complex transaction (e.g., smart contract interaction, token swap).",
            });
        }
    } else {
        throw new Error(`Failed to fetch transaction, or the transaction itself failed. Signature: ${startSignature}`);
    }

    // 2. NEW STEP: Use the agent's LLM capability to process the results.
    const aiSummary = await agent.processWithLLM(results);
    
    console.log("AI Summary Generated:", aiSummary);

    // 3. Return both the raw trace and the AI summary.
    return { trace: results, summary: aiSummary };
}