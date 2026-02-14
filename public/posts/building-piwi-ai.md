# Building Piwi.ai

Piwi.ai didn't start as one of those "developer side project" ideas — you know the type, one of a hundred ideas scribbled in a notebook, a weekend prototype that never ships. I have plenty of those.

This one was different. This one started from watching **real people struggle with real problems**.

## How It Started

People around me — accountants, office managers, small business owners — kept complaining about the same thing: **hours spent copy-pasting data from one document into another**, then double-checking everything is correct. An invoice comes in, and someone manually types the vendor name, the amounts, the line items into a spreadsheet or an ERP. A contract arrives, and someone reads through 20 pages to pull out the key dates and parties. Then they do it again for the next one. And the next.

The worst part? The **verification**. After all that manual work, they still had to go back and check if what they typed actually matched what was on the document. Typos, missed fields, wrong numbers — the errors add up, and they cost real money.

After 10+ years building enterprise backends in Java and Spring — microservices, DDD, Elasticsearch, the whole JVM ecosystem — I knew I could build something better. Not another enterprise tool with a six-figure price tag, but something **small businesses could actually afford and use**.

That's how [Piwi.ai](https://piwi.ai) was born — a privacy-first Intelligent Document Processing (IDP) platform built for small and medium businesses.

## What Piwi.ai Does

Piwi.ai takes your documents and **automatically classifies, extracts, and validates** the data inside them — powered by AI.

Upload an invoice, and Piwi.ai pulls out the vendor, amounts, line items, and dates. Upload a contract, and it identifies the parties, key clauses, and deadlines. No templates, no rules to configure — the AI understands the document.

### See It in Action

<div style="display: flex; justify-content: center; margin: 2rem 0;">
<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7422656529608376323" height="946" width="504" frameborder="0" allowfullscreen="" title="Piwi.ai Demo"></iframe>
</div>

### Two Editions

1. **Online SaaS** — cloud-hosted, scalable, pay-as-you-go. Uses Google Gemini for AI processing.
2. **Offline / Browser Edition** — runs 100% locally. No server, no cloud, no data leaving your machine. Uses **WebGPU** and local AI models to process documents directly in your browser.

### Privacy First

This isn't just a marketing tagline. The offline edition literally cannot leak your data because:

- All processing happens in-browser using **WebGPU-accelerated AI models**
- No network requests for document processing
- Your files never leave your device
- Business configuration (document types, entities, extraction logic) is being **open-sourced**

For businesses handling sensitive documents — legal firms, healthcare, financial services — this matters. A lot.

### Starting With Real Estate & Notary in Italy

We're launching by focusing on **real estate and notary workflows in Italy** — an industry drowning in paper-heavy processes. Identity documents, property contracts, cadastral certificates, mortgage documents — Italian notaries handle dozens of document types per transaction, all requiring precise data extraction and cross-verification.

It's the perfect testing ground: high document volume, strict accuracy requirements, and a market that still relies heavily on manual processing.

---

## The Technical Journey

Now for the nerdy part — how I'm building it, and why I made the choices I did.

### Adding TypeScript to My Arsenal

Java is a powerhouse — I spent a decade building high-throughput enterprise systems with it, and I still think it's the best choice for large-scale backend services. But when you're a solo founder building a full product from scratch — frontend, backend, offline edition, AI pipeline — **having one language everywhere changes everything**.

TypeScript + Node.js gave me:

- **One language, full stack** — React frontend, Node.js backend, shared types, shared validation. No context-switching.
- **Speed of iteration** — hot-reload, instant feedback, deploy in seconds.
- **AI-friendly** — TypeScript is the most well-represented language in LLM training data. AI assistants write better TypeScript than almost anything else.
- **Smaller footprint** — perfect for containerized deployments and serverless.

The real win? **Shared code across runtimes.**

### One Codebase, Two Runtimes

Because both the frontend and backend are TypeScript, I can share types, validation logic, and business rules across both through a shared package. The document type definitions, entity schemas, extraction rules, and validation logic all live in one place.

Why does this matter? Because it's what makes the **offline browser edition possible**. The entire document processing pipeline — classification, extraction, validation — runs the same shared logic whether it's on a Node.js server or inside a Web Worker in your browser. There's no "lite" version. It's the same engine.

With Java on the backend and JavaScript on the frontend, this would have been two separate implementations of the same logic, hoping they stay in sync. With TypeScript everywhere, it's just one import.

### The Extract-Verify Pattern

Here's something I'm particularly proud of. Most AI document processing tools make a single API call and hope for the best. Piwi uses a **multi-stage extract-verify pattern** built on **LangGraph** — a framework for stateful, multi-step AI workflows.

Each document goes through a graph of AI-powered nodes:

1. **Classification** — What type of document is this? Uses a nullable schema so the AI can say "I don't know" instead of forcing a wrong answer.
2. **Extraction** — Pull structured data according to the document type's schema.
3. **Verification** — A separate AI call cross-checks the extracted data against the original document. Field-by-field confidence scoring, not just a single pass.
4. **Entity Resolution** — Link extracted entities (people, companies, addresses) across documents using graph-based identity merging.

This isn't a single AI call — it's a chain of decisions with conditional routing, retries, and weighted confidence scoring. The result? **Significantly higher accuracy** than single-call approaches, because the verification step catches exactly the kind of errors a human reviewer would.

### Transformers.js — AI in the Browser

For the offline edition, Piwi.ai uses **Transformers.js** — Hugging Face's library for running transformer models directly in the browser via **WebGPU** and ONNX Runtime.

No API calls, no cloud, no data leaving your device. The AI models are downloaded once and cached locally. The same LangGraph workflow that runs on the server with Google Gemini can run in the browser with Transformers.js — swap the AI provider, keep everything else.

### The Agentic Coding Revolution

Here's the part that changed everything: **agentic AI coding**.

I'm not talking about autocomplete or suggestion-based copilots. I mean full agentic workflows where the AI reads your codebase, understands your architecture, plans multi-file changes, executes them, runs tests, and iterates on failures.

This is how I build Piwi.ai daily. I describe what I want at a high level, and the AI handles the implementation — from writing code to fixing lint errors to running verifications.

A solo developer with agentic AI can now build what used to require a small team:

- A **full SaaS platform** — React + TypeScript frontend, Node.js backend, AWS infrastructure
- An **offline-first edition** — runs entirely in the browser with local AI
- **AI-powered document processing** — classification, data extraction, multi-stage verification
- **Open-sourcing the business layer** — document types, entities, validation & extraction logic

All of this, as one person.

### The Tech Stack

| Layer | Technology |
|-------|-----------:|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express |
| AI (Cloud) | Google Gemini API |
| AI (Local) | WebGPU, ONNX Runtime, local models |
| Database | MongoDB |
| Search | Elasticsearch |
| Storage | AWS S3 |
| Infrastructure | AWS, Docker |
| CI/CD | GitHub Actions |

## What's Next

I'm working on three things right now:

1. **Open-sourcing the business configuration layer** — document types, entity definitions, validation rules, and extraction logic. The core engine stays proprietary, but the configuration that defines *what* to extract and *how* to validate it will be free and open.

2. **Closing the gap between cloud and local AI** — making the browser-based offline edition fast enough to rival cloud processing. WebGPU is getting better every month.

3. **Growing the platform** — onboarding early users, gathering feedback, and building the features small businesses actually need.

If you're a solo developer or a small team — **embrace agentic AI coding**. It's not about replacing developers. It's about amplifying what one person can build.

The era of the solo AI-powered founder is here. And it's just getting started.

---

*I'd love to hear your thoughts. Reach out on [LinkedIn](https://www.linkedin.com/in/adrian-besleaga/) or try [Piwi.ai](https://piwi.ai) yourself.*
