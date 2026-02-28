---
title: "Piwi and the Agentic Economy"
date: 2026-02-15
excerpt: "The next wave of AI isn't chatbots — it's agents. Here's how Piwi.ai is building with MCP, A2A, and open standards to become a native participant in the $6 trillion agentic economy."
tags: ["piwi", "ai", "mcp", "a2a", "agentic"]
---

The next wave of AI isn't chatbots. It's **agents** — autonomous systems that plan, execute, and coordinate across tools and services to get real work done. And the economy they're creating is coming faster than most people realize.

Salesforce estimates the agentic economy could be worth **$6 trillion**. Gartner predicts that **40% of enterprise applications** will integrate AI agents by the end of 2026 — up from less than 5% in 2025. This isn't a future prediction. It's happening now.

At [Piwi.ai](https://piwi.ai), we've been building for this world from day one. Here's how.

---

## What Is the Agentic Economy?

The agentic economy is a world where **AI agents are first-class participants** in how work gets done. Not just assistants sitting in a chat window — but autonomous programs that:

- Receive a goal ("process all invoices from this supplier")
- Break it into steps
- Call the right tools and services
- Coordinate with other agents
- Deliver verified results

Think of it this way: today you open five tabs, log in to three platforms, and copy data between them. In the agentic economy, you describe what you need, and a network of specialized agents handles the rest.

But for this to work, agents need **something critical**: a way to discover, communicate with, and trust the services they use. That's where protocols come in.

---

## The Two Protocols That Make It Work

Two open standards are emerging as the foundation of the agentic economy. Think of them as the **HTTP of the AI world** — the plumbing that makes everything interoperate.

### MCP — Model Context Protocol

Developed by Anthropic and now governed by the Linux Foundation, MCP defines how **agents connect to tools**. It's the vertical integration layer — how an AI finds out what a service can do, what inputs it needs, and how to call it safely.

If you've used Claude Desktop, Cursor, or VS Code with AI extensions, you've already used MCP. When an AI assistant reads your codebase, queries a database, or calls an API — that's MCP at work.

### A2A — Agent-to-Agent Protocol

Launched by Google and also under the Linux Foundation, A2A defines how **agents communicate with each other**. It's the horizontal coordination layer — routing, messaging, authentication, and task handoff between agents from different vendors.

These two protocols are **complementary**, not competing:

| Protocol | What It Does | Analogy |
|----------|-------------|---------|
| **MCP** | Agent ↔ Tool | USB — plug any device in |
| **A2A** | Agent ↔ Agent | Email — any server talks to any server |

Together, they create a world where any agent can discover any tool, and any agent can collaborate with any other agent. That's the agentic economy.

---

## How Piwi Is Building for This

We're not waiting for the agentic economy to arrive. We're building **three pillars** right now to make Piwi a native participant in it.

### 1. MCP Server — Making Piwi a Tool That Any Agent Can Use

Piwi already runs a **production MCP server**. Any MCP-compatible AI agent — whether it's running inside Claude, Gemini, Cursor, or a custom enterprise system — can discover Piwi's capabilities and call them programmatically.

What can agents do through MCP today?

- **Upload documents** to Piwi projects
- **Classify documents** — identify the type automatically (invoice, contract, ID document)
- **Extract structured data** — pull names, amounts, dates, addresses from any document
- **Search and retrieve** results across projects
- **Manage folders and projects** — organize document workflows

No UI. No browser. No human in the loop (unless you want one). An AI agent sends a document to Piwi, and gets back structured, verified data.

This is what makes Piwi different from "yet another AI wrapper." We're not just calling an LLM and returning raw text. We run a **multi-stage extraction and verification pipeline** — classify, extract, cross-verify, resolve entities — and expose it as a clean, callable service to any agent.

### 2. A2A Bridge — Appearing in Gemini Enterprise

We've built an **A2A bridge** that makes Piwi discoverable in Google's Gemini Enterprise platform. Here's what that means in practice:

A company's IT admin registers Piwi's **Agent Card** — a JSON document describing who we are, what we can do, and how to authenticate. Once registered, every employee in that organization sees **"PIWI Document Intelligence"** in their Gemini sidebar.

From there, a user can type natural language:

> *"Upload the contracts from the Smith property deal and extract all the key dates and parties."*

Gemini's agent routes the request to Piwi via A2A. Piwi processes the documents through our full extraction pipeline. The results come back as structured artifacts in the Gemini conversation.

The architecture is clean:

```
User (Gemini) → A2A Protocol → Piwi A2A Bridge → Piwi MCP Server → AI Pipeline
```

The A2A bridge is lightweight — it translates between A2A's JSON-RPC format and our existing MCP tools. The heavy lifting (document classification, extraction, verification) is the same battle-tested engine we run for all customers.

### 3. DocSchema — An Open Standard for Document Intelligence

For agents to process documents intelligently, they need **shared knowledge** — what fields exist on an Italian identity card, what clauses matter in a rental agreement, what line items an invoice should have.

We've open-sourced this knowledge layer as **[DocSchema](https://github.com/piwi-ai/docSchema)** — a standardized, LLM-agnostic format for defining document types, entity schemas, extraction rules, and cross-document validation logic. It ships with pre-built configurations for five business verticals across Italy and the US.

Why does this matter for the agentic economy? Because if a procurement agent in Company A sends an invoice to Piwi, and a compliance agent in Company B sends the same kind of document, they should get the same schema, the same field definitions, the same validation rules. DocSchema is that shared standard.

I wrote a [dedicated post about why I open-sourced DocSchema](/blog/open-sourcing-docschema) and how agentic AI coding made it possible.

---

## Why This Matters for Small Businesses

You might be thinking: "Protocols, agent cards, A2A bridges — this sounds like enterprise stuff." Fair point. But here's why it matters for everyone.

**The agentic economy levels the playing field.**

Today, a large enterprise can hire a team to build custom integrations between their document processing, their ERP, their CRM, and their accounting software. A small business can't.

In the agentic economy, that integration happens automatically. A small business owner's AI assistant can:

1. Receive an invoice via email
2. Send it to Piwi for processing (via MCP)
3. Get back structured data (vendor, amounts, line items)
4. Push that data into their accounting software (via another MCP tool)
5. Flag any discrepancies for human review

No custom development. No integration team. No six-figure software license. Just agents talking to agents, using open protocols.

That's the small business superpower we're building toward.

---

## What's Next

We're working on several things to deepen Piwi's role in the agentic world:

1. **Streaming results via A2A** — real-time progress as documents flow through the extraction pipeline, so agents don't have to poll for completion.

2. **Expanding DocSchema** — adding more countries, more verticals (healthcare, logistics, legal), and inviting the community to contribute document type definitions.

3. **Agent Payments Protocol** — Google announced AP2 in September 2025, enabling secure agent-led payments. When this stabilizes, Piwi could be a pay-per-document service that agents consume autonomously, no human billing negotiation required.

4. **Scaling the engine** — our architecture is designed to scale from the current thousands of documents per day to **300 million per month** through a tiered approach: in-process optimization → queue-based horizontal scaling → fully serverless with AWS Lambda and Gemini Batch API. The unit cost at scale? Less than $0.005 per document.

---

## The Bigger Picture

The agentic economy isn't just about making existing workflows faster. It's about creating workflows that **couldn't exist before**.

Imagine a real estate transaction where:
- A document agent collects all required papers from buyer, seller, and bank
- An extraction agent pulls structured data from every document
- A compliance agent cross-references extracted entities (people, addresses, property details) across all documents
- A verification agent flags inconsistencies before a human notary sees them

Each agent is specialized. Each uses open protocols.

That's the agentic economy. That's what we're building for. And if you're building a product today — whether it's document processing, accounting, HR, or anything else — **you should be preparing for it too**.

The protocols are here. The standards are forming. The only question is whether your product is ready to be discovered, called, and coordinated by agents — or whether you're still building for humans clicking buttons.

---

*Building for the agentic economy? I'd love to hear how you're thinking about it. Reach out on [LinkedIn](https://www.linkedin.com/in/adrian-besleaga/) or try [Piwi.ai](https://piwi.ai) yourself.*
