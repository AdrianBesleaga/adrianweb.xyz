---
title: "AI Atomic Feature Architecture"
date: 2026-08-05
excerpt: "What if software projects were designed so an AI agent could implement one small feature without understanding the whole codebase? That's the idea behind AI Atomic Feature Architecture."
tags: ["ai", "architecture", "agentic-coding", "software-engineering", "open-source"]
---

I keep coming back to the same frustration when building software with AI agents:

The agent is often smart enough to implement the feature.

But the codebase is not shaped in a way that lets it.

You ask for one small change, and suddenly the agent needs to understand routing, dependency injection, ORM conventions, auth rules, service naming, test patterns, folder structure, logging, transactions, and five historical decisions that live only in someone's head.

The task is small.

The context is not.

That mismatch is where AI-assisted development breaks down.

So I started thinking about a different question:

> What if we designed software so each feature could be implemented in isolation?

Not isolation as in "one file forever." Not isolation as in "no architecture." The opposite, actually.

I mean an architecture where each implementation unit is small, explicit, bounded, testable, and described well enough that a human developer or AI agent can implement it without reading the whole project first.

I'm calling this idea **AI Atomic Feature Architecture**, or **AIFA**.

The first proof of concept is here: [github.com/AdrianBesleaga/AIFA](https://github.com/AdrianBesleaga/AIFA).

---

## The Problem: Small Tickets Still Hide Big Context

Most engineering teams already say they want small tickets.

That's not new.

"Keep stories small."

"Split the work."

"One ticket should do one thing."

Good advice. But in practice, many "small" tickets are small only in wording.

Take this ticket:

> Allow users to archive a project.

It sounds simple. But to implement it safely, a developer may need to know:

- Where project logic lives
- How permissions are checked
- Whether archived projects are soft-deleted
- Which repository or ORM pattern the app uses
- Whether audit events are required
- Which tests matter
- What API response shape is expected
- Whether project ownership is scoped by organization

The ticket is small. The hidden context is huge.

This is even harder for AI agents. They do not just need the task. They need the relevant part of the system, the conventions, the constraints, and the acceptance criteria. If those are scattered across the repository, the agent has to explore. Exploration is where mistakes happen.

The agent reads too much, infers too much, edits too much, and sometimes solves the wrong problem with great confidence.

AIFA is an attempt to reduce that surface area.

---

## The Idea: Make The Feature Atomic

In AIFA, the feature is the main unit of implementation.

An atomic feature has:

1. One responsibility
2. Explicit input
3. Explicit output
4. Declared capabilities
5. Clear failure cases
6. Behavioral acceptance tests

The feature receives one `context` object. Everything it is allowed to know or do comes through that context.

Conceptually:

```txt
Ticket Contract
      |
      v
Feature(input, capabilities)
      |
      v
Runtime-owned infrastructure
```

The feature does not import a database client.

It does not instantiate services.

It does not reach into global config.

It does not need to know if persistence is SQL, Redis, an API call, a queue, or something else.

It receives capabilities from the runtime:

```typescript
export const archiveProject = defineFeature({
  name: "archive-project",
  description: "Archive one project when the actor has permission.",
  input: {
    projectId: "string",
  },
  output: {
    projectId: "string",
    archived: "boolean",
  },
  capabilities: [
    "project.load",
    "project.save",
    "permission.check",
    "audit.record",
  ],

  async execute(context) {
    const project = await context.capabilities["project.load"]({
      projectId: context.input.projectId,
    });

    if (!project) {
      return context.fail("not_found", "Project was not found");
    }

    const allowed = await context.capabilities["permission.check"]({
      actor: context.actor,
      permission: "project.archive",
      resource: project,
    });

    if (!allowed) {
      return context.fail("not_allowed", "Actor cannot archive this project");
    }

    await context.capabilities["project.save"]({
      project: {
        ...project,
        archived: true,
      },
    });

    await context.capabilities["audit.record"]({
      type: "project.archived",
      actorId: context.actor.id,
      projectId: project.id,
    });

    return context.ok({
      projectId: project.id,
      archived: true,
    });
  },
});
```

This is not about the syntax. The syntax is just the proof of concept.

The architectural rule is the interesting part:

> A feature should only depend on its declared contract.

---

## The Runtime Owns The Mess

Software is messy because real systems are messy.

Databases exist. Auth exists. Transactions exist. Caches exist. Queues exist. Observability exists. Multi-tenant scoping exists. Legacy code exists.

AIFA does not pretend those things disappear.

It says they should belong to the runtime, not the feature.

Traditional dependency shape:

```txt
Feature -> Service -> Repository -> Database
```

AIFA dependency shape:

```txt
Feature -> Context Capability -> Runtime -> Infrastructure
```

The feature knows it can ask for `project.load`.

It does not know how projects are loaded.

The feature knows it can ask for `permission.check`.

It does not know the full permission system.

The feature knows it can ask for `audit.record`.

It does not know where audit events are stored.

That separation matters because it makes the feature easier to delegate. The person or agent implementing the feature can focus on business behavior instead of reconstructing the application from clues.

---

## Tickets Become Contracts

The other half of AIFA is the ticket.

If the feature is atomic in code, the ticket should be atomic in planning.

An AIFA ticket should look more like a contract than a vague task:

```md
# Feature: Archive Project

## Goal

Allow an authorized actor to archive one project.

## Input

- projectId: string - The project to archive.

## Output

- projectId: string - The archived project id.
- archived: boolean - Always true on success.

## Allowed Capabilities

- project.load - Load the project by id.
- project.save - Persist the archived project.
- permission.check - Confirm the actor can archive the project.
- audit.record - Record the archival action.

## Rules

- The project must exist.
- The actor must have project.archive.
- The actor must belong to the same organization as the project.
- Archiving an already archived project succeeds.

## Failure Cases

- not_found - The project does not exist.
- not_allowed - The actor cannot archive the project.

## Acceptance Tests

- Archives an active project.
- Returns success for an already archived project.
- Rejects an actor without archive permission.
- Returns not_found for a missing project.
```

This is the part I care about most.

The ticket should contain enough information for implementation. Not every detail in the universe. Just the relevant contract: goal, input, output, capabilities, rules, failures, and tests.

The more I work with AI agents, the more I think the ticket is becoming a programming interface.

The human writes intent.

The architecture defines boundaries.

The agent implements inside those boundaries.

---

## Why This Is AI-Native

AI coding agents are powerful, but they are very sensitive to context quality.

Give an agent a vague task and a large repo, and it has to guess what matters.

Give it a small feature contract, a constrained runtime, and behavioral tests, and the problem becomes much easier.

AIFA tries to make the agent's job look like this:

```txt
Read ticket contract
Read feature runtime contract
Implement one feature
Run acceptance tests
Stop
```

That's a very different workflow from:

```txt
Explore entire repo
Infer architecture
Guess dependencies
Patch several files
Generate too many tests
Hope the behavior matches
```

This does not remove engineering judgment. In fact, it moves more judgment into architecture.

Someone still has to design good capabilities.

Someone still has to define useful boundaries.

Someone still has to decide what belongs in the runtime and what belongs in the feature.

But once that architecture exists, small pieces of work become much more delegatable.

That's the point.

---

## How This Relates To Existing Ideas

AIFA is not coming from nowhere. It borrows from several ideas I already like:

- **Vertical Slice Architecture**: organize around features, not layers
- **Hexagonal Architecture**: keep infrastructure behind ports
- **Clean Architecture**: protect business logic from framework details
- **CQRS**: model commands and queries explicitly
- **Capability-based systems**: grant only the operations something is allowed to use
- **Functional core, imperative shell**: keep behavior explicit and testable
- **Spec-driven development**: write structured intent before implementation

But I think AIFA has a different center of gravity.

Most architectures ask:

> How do we keep the codebase understandable?

AIFA asks:

> How do we make one feature implementable without full project context?

That is a subtle shift, but it changes the design pressure.

The goal is not just clean code. The goal is context-isolated implementation.

---

## The Proof Of Concept

The first repo is intentionally tiny.

It contains:

- A `defineFeature` helper
- A memory runtime
- Runtime-provided capabilities
- One `archive-project` feature
- One ticket contract
- Behavioral tests

You can run it with:

```sh
npm test
npm run demo
```

The demo returns:

```json
{
  "ok": true,
  "value": {
    "projectId": "project-1",
    "archived": true
  }
}
```

The point is not that archiving a project is impressive.

The point is that the feature can be understood from its contract.

It does not need a real database. It does not need a web framework. It does not need a service layer. It does not need the whole application.

It needs input, capabilities, rules, and tests.

That is the architectural seed.

---

## What I Want To Explore Next

The obvious next step is to push this beyond a toy example.

I want to test whether AIFA works across:

- CRUD features
- background jobs
- event handlers
- API endpoints
- permission-heavy workflows
- AI workflows
- frontend actions

The questions I care about:

- Can an AI agent implement a feature from only the ticket contract and runtime docs?
- How many files does it need to touch?
- How often does it need to inspect unrelated code?
- Are the tests stable across refactors?
- Does the capability model stay clean, or does it become a service locator in disguise?
- Where does this architecture break down?

That last question matters. Every architecture sounds elegant when the example is small.

The real test is whether it survives contact with an actual product.

---

## The Bigger Idea

I think AI changes how we should think about software architecture.

For years, we optimized codebases for human teams: readability, maintainability, ownership, deployment, review.

Those things still matter.

But now there is a new actor in the system: the AI agent.

And AI agents are not just autocomplete. They are becoming implementation workers. They can read tickets, modify files, run tests, and iterate.

So the architecture should answer a new question:

> What shape should software have when some of the implementation is delegated to agents?

My current answer is:

Make features atomic.

Make context explicit.

Make capabilities narrow.

Make tickets contractual.

Make tests behavioral.

Then the agent does not need to understand everything.

It only needs to understand the piece.

That feels like the right direction.

Small pieces. Clear contracts. Less hidden context. Better delegation.

That's AI Atomic Feature Architecture.

The repo is open here: [github.com/AdrianBesleaga/AIFA](https://github.com/AdrianBesleaga/AIFA).

