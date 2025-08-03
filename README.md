# JuliaTrace: AI-Powered On-Chain Forensics Agent

JuliaTrace is a full-stack decentralized application built to demonstrate the power and versatility of the JuliaOS framework. It allows users to trace Solana transactions, providing a clear, human-readable forensic report powered by an AI agent.

This project was developed as a submission for the **AI DApp Development Bounty by JuliaOS** on Superteam Earn.

---

### ► Live Demo

A live version of the dApp is deployed on Vercel:

**[https://julia-trace-zqu2.vercel.app/)**

---

### ## How it Uses JuliaOS

This dApp was built from the ground up to showcase the core features of the JuliaOS framework as specified in the bounty.

- **🤖 Agent Execution:** The core of the application is a `TracerAgent` built using the JuliaOS agent-centric design. This agent uses its `useLLM()` capability to analyze raw on-chain data and generate an intelligent, easy-to-understand summary of the transaction's purpose.

- **🌐 On-Chain Functionality:** The agent connects directly to the Solana blockchain using the `useOnChain()` interface. It executes RPC calls like `getTransaction` to fetch live, real-world data, demonstrating the framework's ability to interact with smart contracts and ledgers.

- **🤝 Swarm Integration (Concept):** The architecture is designed for swarm capabilities. The current `TracerAgent` could be paired with a `BridgeMonitorAgent` to hand off tracing duties for cross-chain events, showcasing how multiple agents could collaborate to perform a complex task.

- **💻 UI/UX Layer:** A clean, responsive frontend built with Next.js and Tailwind CSS provides an intuitive user experience, demonstrating how a custom UI can be built on top of a JuliaOS-powered backend.

---

### ## Tech Stack

- **Framework:** JuliaOS (simulated via a mock library)
- **Frontend:** Next.js / React
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Blockchain Interaction:** @solana/web3.js

---

### ## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [Your-GitHub-Repo-URL]
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd julia-trace
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### ## How to Use

1.  Find a recent transaction signature from a Solana explorer like [Solscan](https://solscan.io/).
2.  Paste the signature into the input box on the web page.
3.  Click the "Trace Transaction" button.
4.  View the AI-generated summary and the detailed trace results.
