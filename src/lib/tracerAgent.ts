// src/lib/tracerAgent.ts

import { JuliaOSAgent } from './mockJuliaOS';
import { TraceResult, FinalReport } from '../types'; // <-- UPDATED IMPORT

export async function runTrace(startSignature: string): Promise<FinalReport> {
    const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

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

    const aiSummary = await agent.processWithLLM(results);
    
    console.log("AI Summary Generated:", aiSummary);
    return { trace: results, summary: aiSummary };
}