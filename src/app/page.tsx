// src/app/page.tsx

'use client';

import { useState } from 'react';
import { FinalReport } from '@/types'; // <-- UPDATED IMPORT PATH

const Spinner = () => <div className="spinner mx-auto"></div>;

export default function HomePage() {
  const [signature, setSignature] = useState<string>('');
  const [report, setReport] = useState<FinalReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrace = async () => {
    setIsLoading(true);
    setReport(null);
    setError(null);

    try {
      const response = await fetch('/api/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'An error occurred.');
      }

      const data: FinalReport = await response.json();
      setReport(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="z-10 w-full max-w-3xl font-mono flex-grow">
        <h1 className="text-4xl font-bold mb-2 text-center text-cyan-400">
          JuliaTrace
        </h1>
        <p className="text-center text-gray-400 mb-8">
          AI-Powered On-Chain Forensics Agent
        </p>

        <div className="flex w-full items-center space-x-2">
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Enter Solana transaction signature..."
            className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            onClick={handleTrace}
            disabled={isLoading || !signature}
            className="p-3 bg-cyan-500 text-black font-bold rounded-md hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Tracing...' : 'Trace Transaction'}
          </button>
        </div>

        <div className="mt-8 w-full p-4 bg-gray-800 border border-gray-700 rounded-md min-h-[10rem] flex flex-col justify-center">
          {isLoading && <Spinner />}
          {error && ( <div className="text-center text-red-400"><p className="font-bold">Error:</p><p>{error}</p></div> )}
          
          {report && (
            <div>
              <h2 className="text-xl font-bold mb-2 text-cyan-300">AI Summary:</h2>
              <blockquote className="mb-4 p-3 bg-gray-700/50 border-l-4 border-cyan-400 italic">
                {report.summary}
              </blockquote>
              
              <h2 className="text-xl font-bold mb-2 text-gray-300">Trace Details:</h2>
              {report.trace.map((result, index) => (
                <div key={index} className="mb-2 p-2 text-sm border-b border-gray-700 last:border-b-0">
                  <p><span className="font-bold text-gray-400">Source:</span> {result.source}</p>
                  <p><span className="font-bold text-gray-400">Destination:</span> {result.destination}</p>
                  <p><span className="font-bold text-gray-400">Action:</span> {result.action}</p>
                </div>
              ))}
            </div>
          )}

           {!isLoading && !error && !report && (
            <p className="text-center text-gray-500">Results will appear here.</p>
          )}
        </div>
      </div>
       <footer className="w-full text-center text-gray-500 text-xs mt-8">
        <p>Built for the JuliaOS Bounty</p>
      </footer>
    </main>
  );
}