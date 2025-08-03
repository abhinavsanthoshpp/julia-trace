// src/app/api/trace/route.ts

import { NextResponse } from 'next/server';
import { runTrace } from '@/lib/tracerAgent'; // Note the '@/' alias for the src directory

export async function POST(request: Request) {
    // We use a try...catch block to handle any potential errors gracefully.
    try {
        // 1. Get the data that the frontend sent to us.
        const body = await request.json();
        const { signature } = body;

        // 2. Validate the input to make sure we have what we need.
        if (!signature || typeof signature !== 'string') {
            return NextResponse.json({ error: 'Signature is required and must be a string.' }, { status: 400 });
        }

        // A very basic check to see if the signature looks like a real one.
        if (signature.length < 80 || signature.length > 90) {
             return NextResponse.json({ error: 'Invalid signature format.' }, { status: 400 });
        }

        console.log(`API received request to trace signature: ${signature}`);
        
        // 3. Call our "brain" function from tracerAgent.ts and wait for the results.
        const traceResults = await runTrace(signature);

        // 4. Send the successful results back to the frontend.
        return NextResponse.json(traceResults, { status: 200 });

    } catch (error) {
        // If anything goes wrong in our `runTrace` function, this will catch it.
        console.error("API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        
        // Send a generic server error response back to the frontend.
        return NextResponse.json({ error: "Failed to run trace.", details: errorMessage }, { status: 500 });
    }
}