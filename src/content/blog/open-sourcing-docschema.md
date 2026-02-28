---
title: "Open-Sourcing DocSchema — Why I'm Giving Away the Knowledge Layer"
date: 2026-02-15
excerpt: "DocSchema is an open standard that defines what data lives inside business documents. Here's why I open-sourced it, and how agentic AI coding made it possible."
tags: ["open-source", "docschema", "ai", "piwi"]
---

For the past year, I've been building [Piwi.ai](https://piwi.ai) — an AI-powered document processing platform. The engine classifies documents, extracts structured data, and cross-verifies everything with multi-stage AI workflows. It's the core of the business.

So why am I open-sourcing a critical piece of it?

Because **agentic AI coding changed what's possible for a solo founder**. And because the world gets better when knowledge is shared.

---

## What Is DocSchema?

[DocSchema](https://github.com/piwi-ai/docSchema) is an open standard that defines **what data lives inside business documents** — and how to extract, validate, and connect it. You can explore the full documentation at [piwi-ai.github.io/docSchema](https://piwi-ai.github.io/docSchema/).

Every AI document processing system reinvents the same wheel: *"What fields should I extract from this invoice? What does a driver's license look like in Italy? How do I link a person across multiple documents?"*

DocSchema answers all of that in a universal, portable, LLM-agnostic format.

### The Four Primitives

DocSchema is built on four core concepts:

**1. Document Types** — A JSON Schema definition for each document category. An Italian invoice (`doc-fattura`) has fields for `numero`, `data`, `totale`. A US driver's license has `firstName`, `lastName`, `dateOfBirth`, `licenseNumber`. Each field has a type, description, and validation pattern.

```typescript
{
  id: 'doc-fattura',
  name: 'Fattura',
  description: 'Invoice — issuer, recipient, line items, VAT',
  jsonSchema: objectSchema({
    numero: text('Invoice number'),
    data: date('Issue date'),
    totale: num('Total amount in EUR'),
  }, ['numero', 'data', 'totale']),
}
```

**2. Entity Types** — Business objects (a buyer, a property, a vehicle) that aggregate data from multiple documents. A "Buyer" entity pulls `firstName` from a driver's license, `taxCode` from a tax document, and `address` from a utility bill. Fuzzy matching rules define when two documents refer to the same person.

**3. Conditional Requirements** — Business logic that says "if the buyer's marital status contains 'widowed', then a death certificate is required." This is the kind of institutional knowledge that usually lives in someone's head.

**4. Business Configurations** — The container that bundles everything together for a specific industry and country. `REAL-ESTATE-IT-DEFAULT` packages all the document types, entity types, and validation rules that an Italian real estate agency needs.

### Already Covering Five Verticals

DocSchema ships with pre-built configurations for real business scenarios:

| Configuration | Industry | Country |
|--------------|----------|---------|
| `REAL-ESTATE-IT-DEFAULT` | Real Estate | Italy |
| `REAL-ESTATE-US-DEFAULT` | Real Estate | United States |
| `ACCOUNTANT-IT-DEFAULT` | Accounting / Tax | Italy |
| `CAR-DEALERSHIP-IT-DEFAULT` | Car Dealership | Italy |
| `INSURANCE-IT-DEFAULT` | Insurance | Italy |

Each configuration is a complete package — document types with JSON Schemas, entity types with cross-document aggregation rules, and conditional requirements. Install it with `npm install @piwi.ai/docschema` and you have everything you need to build document processing for that industry.

---

## Why Open Source This?

### The Knowledge Shouldn't Be Proprietary

Here's the thing: knowing what fields exist on an Italian identity card isn't a competitive advantage. Knowing that a `codice fiscale` is 16 characters and follows a specific pattern — that's public knowledge. Knowing that a real estate transaction requires a property survey, a mortgage pre-approval, and a title report — every notary knows this.

What *is* a competitive advantage is the **engine that processes documents** — the multi-stage AI classification, extraction, cross-verification, and entity resolution pipeline. That's what Piwi does, and that stays proprietary.

But the configuration layer — *what to look for* — that should be community knowledge. Open. Shared. Improved by everyone.

### AI Agents Need Shared Standards

In the emerging agentic economy, AI agents from different vendors will process documents on behalf of their users. A procurement agent sends an invoice to a processing service. A compliance agent checks a contract. A tax agent handles receipts.

For this to work, agents need a **shared vocabulary**. When an agent says "extract the `totale` field from a `doc-fattura`," every system should understand what that means. DocSchema provides that shared vocabulary.

It's LLM-agnostic — the same schema works whether you're using Gemini, GPT, Claude, or Llama. It's the **what**, not the **how**.

### A Solo Founder Can Now Afford to Give Back

This is the part that means the most to me.

A year ago, I couldn't have done this. Building a full SaaS platform — frontend, backend, AI pipeline, offline edition, infrastructure — was already overwhelming for one person. The idea of *also* maintaining open-source standards, writing specifications, creating contribution guides, building meta-schemas for validation? That was a luxury for teams, not solo founders.

**Agentic AI coding changed that equation.**

I build Piwi.ai daily with AI agents that read my codebase, understand the architecture, plan multi-file changes, execute them, run tests, and iterate. The DocSchema specification, the JSON meta-schema, the contributing guide, the issue templates — all of these were created in focused sessions where I described what I wanted at a high level and the AI handled the implementation.

This isn't about replacing developers. It's about **compressing the time it takes to do important work** — so there's time left for the work that benefits everyone.

I can now allocate time to open source because the AI handles the repetitive, time-consuming parts of building software. The creative decisions, the architecture, the strategy — those are still mine. But the execution that used to consume entire weekends now takes hours.

---

## How It Works in Practice

Here's a concrete example. You want to build a document processing system for Italian real estate. Without DocSchema, you need to:

1. Research what document types Italian notaries handle (there are dozens)
2. Figure out what fields each document contains
3. Define validation patterns for Italian-specific formats (dates as DD.MM.YYYY, codice fiscale regex)
4. Design entity schemas for buyers, sellers, properties
5. Write cross-document validation rules

With DocSchema:

```typescript
import { realEstateItConfig } from '@piwi.ai/docschema';

// You now have:
// - All document types with extraction schemas
// - Entity types with cross-document aggregation
// - Conditional requirements (business logic)
// - Country-specific field helpers and patterns

console.log(realEstateItConfig.documentTypes.map(dt => dt.name));
// → ['Identity Card', 'Tax Code', 'Property Survey', ...]
```

Feed these schemas to any LLM as structured extraction instructions. The AI knows exactly what to look for because the schema tells it — field by field, with types, descriptions, and validation patterns.

---

## Contributing

The most valuable thing about DocSchema isn't the code — it's the **domain knowledge**. And that knowledge is distributed across industries and countries.

If you work in French accounting, you know what a `facture` looks like. If you handle US healthcare claims, you know the field structure of an EOB. If you're a German logistics company, you know what a `Frachtbrief` contains.

That knowledge should be in DocSchema.

We've made contributing straightforward:

- **Adding a new country**: Create locale-specific field helpers (date formats, ID patterns, field names)
- **Adding a new vertical**: Define document types and entity types in a new directory
- **Adding a document type**: Add a single TypeScript object with a JSON Schema

There are [issue templates](https://github.com/piwi-ai/docSchema/issues) for each scenario, a [contributing guide](https://github.com/piwi-ai/docSchema/blob/main/CONTRIBUTING.md), and a [formal specification](https://github.com/piwi-ai/docSchema/blob/main/SPECIFICATION.md) that makes the rules explicit.

Every contribution is validated by a JSON meta-schema and 147 automated tests. You can't accidentally break things.

---

## The Vision

I believe that in a few years, document processing will be commoditized. Every business will have AI agents handling their paperwork. The differentiator won't be *whether* you can extract data from a document — it will be *how accurately, how cheaply, and how quickly*.

But the foundational layer — the knowledge of what documents exist, what fields they contain, and how they relate to each other — that should be free. It should be a public good. Like HTTP, like JSON Schema, like OpenAPI.

That's what DocSchema is. A small step toward making document intelligence **accessible to everyone**, not just companies that can afford to build it from scratch.

**[Star the repo](https://github.com/piwi-ai/docSchema)**, open an issue, contribute a document type for your industry. Let's build the standard together.

---

*Questions, ideas, or want to contribute? Reach out on [LinkedIn](https://www.linkedin.com/in/adrian-besleaga/) or check out [Piwi.ai](https://piwi.ai).*
