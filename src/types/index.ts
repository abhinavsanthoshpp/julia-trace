// src/types/index.ts

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