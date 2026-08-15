---
title: "Building Focusly: A Working Demo of AI Atomic Feature Architecture"
date: 2026-08-15
excerpt: "Focusly is a working todo application with an AI assistant through MCP or local Ollama—and a practical proof of AI Atomic Feature Architecture."
tags: ["ai", "architecture", "agentic-coding", "typescript", "open-source"]
---

Architecture ideas are easy to describe. I wanted to prove that **AI Atomic Feature Architecture (AIFA)** could support a real full-stack application.

So I built **Focusly**: a working todo app with an AI assistant. It manages ordinary tasks through a Kanban workflow and can turn natural-language goals into reviewable task plans through an MCP-compatible AI client or a locally hosted Ollama model.

![Focusly task workspace](https://raw.githubusercontent.com/AdrianBesleaga/AIFA/main/demo/ai-todo-assistant/public/readme-workspace.jpg)

The app is the proof, but AIFA is the focus. Focusly shows how small feature contracts, governed capabilities, dynamic composition, and executable boundaries can make software safer for humans and AI coding agents to extend together.

The complete reference implementation is available in the [AIFA repository](https://github.com/AdrianBesleaga/AIFA).

---

## The business problem is bigger than task planning

For the end user, Focusly reduces planning overhead while preserving control:

- Goals can be expressed in natural language.
- Suggested work arrives with a category and priority.
- Suggestions remain reviewable before they become real tasks.
- Every accepted task is visible and editable through ordinary product operations.
- Users can run planning through a local Ollama model or connect an MCP-compatible AI client.

That last point matters. An AI assistant should not have a secret back door into the product. If it can create, update, or delete data, it should follow the same permissions and business rules as a person using the browser.

There is also a second customer for the architecture: the engineering organization.

AI coding agents can generate code quickly, but speed is not the same as safe delivery. In a conventional layered codebase, a “small” feature may require edits across controllers, services, repositories, dependency injection, frontend state, routes, and tests. The ticket may be short while the hidden context is enormous.

That creates familiar costs:

- onboarding requires a mental map of the whole system;
- parallel work converges on shared files and creates conflicts;
- reviews must discover undeclared dependencies;
- an AI agent can make a locally reasonable change that violates a distant rule;
- browser APIs and AI tools can drift into different implementations.

AIFA helps by turning those implicit assumptions into explicit, executable boundaries. It does not remove complexity. It makes complexity local, declared, and testable.

For a business, that translates into a practical goal: **shorten the path from intent to verified software without giving up governance**.

## What Focusly demonstrates

Focusly is deliberately small enough to understand and broad enough to exercise real architectural pressure.

The current application includes six product features across three bounded contexts:

- Create Task
- List Tasks
- Change Task Status
- Delete Task
- Generate Task Plan
- Manage AI Settings

The stack is TypeScript end to end: React 19 and Material UI in the browser, Node.js on the backend, MongoDB for persistence, Ollama behind a provider-neutral AI capability, and Model Context Protocol (MCP) for external AI clients.

The application also includes the less visible concerns that determine whether an architecture survives beyond a toy demo: tenant isolation, authorization scopes, idempotency, optimistic concurrency, audit records, transactional outbox events, runtime schema validation, dependency checks, and behavioral tests.

The point is not that every application should use this exact stack. The point is that the product features do not own the stack.

They own business behavior.

## One feature is one understandable change surface

In Focusly, each use case lives in its own vertical slice:

```text
contexts/task-management/features/create-task/
├── feature.definition.json
├── manifest.ts
├── contracts/
│   ├── input.schema.json
│   └── output.schema.json
├── backend/
│   └── feature.ts
├── frontend/
│   ├── contribution.tsx
│   └── use-create-task.ts
└── IMPLEMENTATION_PLAN.md
```

This folder contains the information needed to reason about Create Task across the full stack:

- why the feature exists;
- what input and output it accepts;
- which failures are part of its contract;
- which runtime capabilities it may use;
- which HTTP route and MCP tool expose it;
- where its frontend appears;
- which events it publishes or consumes;
- which security properties and tests are required.

The machine-readable definition makes the intent inspectable by people, tooling, and AI agents:

```json
{
  "name": "create-task",
  "boundedContext": "task-management",
  "businessNeed": "Capture a categorized commitment quickly and consistently, whether it originates from a person or an accepted AI suggestion.",
  "backend": {
    "route": "/api/tasks",
    "method": "POST",
    "capabilities": [
      "TaskCreate",
      "IdCreate",
      "ClockNow",
      "DomainEventEmit"
    ],
    "mcp": {
      "exposed": true,
      "toolName": "create_task"
    }
  },
  "frontend": {
    "slots": ["TaskComposer"]
  },
  "security": {
    "mutation": true,
    "actorRequired": true,
    "idempotent": true,
    "requiresConfirmation": false,
    "mcpScopes": ["TaskWrite"]
  }
}
```

This is more than documentation. The repository validates the definition against JSON Schema, checks that declared contracts exist, verifies the dependency graph, and compares the definition with the executable manifest.

The planning contract and the running code are separate artifacts, but they are not allowed to quietly disagree.

## Capabilities make permissions architectural

The Create Task backend does not import MongoDB, read environment variables, inspect an HTTP request, or call another feature. Its entire world arrives through the runtime context.

A simplified version of the real implementation looks like this:

```typescript
export const feature = {
  name: FeatureName.CreateTask,
  capabilities: [
    CapabilityName.TaskCreate,
    CapabilityName.IdCreate,
    CapabilityName.ClockNow,
    CapabilityName.DomainEventEmit,
  ],

  async execute(context) {
    const title = context.input.title.trim();

    if (!title) {
      return context.fail(ErrorCode.InvalidInput, "Task title is required");
    }

    const now = await context.capabilities.ClockNow();
    const created = await context.capabilities.TaskCreate({
      task: {
        id: await context.capabilities.IdCreate(),
        title,
        category: context.input.category,
        priority: context.input.priority,
        status: TaskStatus.Todo,
        version: 1,
        createdAt: now,
        updatedAt: now,
        completedAt: null,
      },
    });

    await context.capabilities.DomainEventEmit({
      eventType: DomainEventType.TaskCreatedV1,
      data: { taskId: created.id },
    });

    return context.ok({ task: toTaskView(created) });
  },
};
```

`TaskCreate` is not a general-purpose database connection. It is a narrow operation granted for this execution. The runtime binds it to tenant-aware infrastructure and denies access to capabilities the feature did not declare.

This changes the meaning of dependency injection. The feature does not receive a bag of powerful services and rely on developer discipline. It receives a least-authority interface shaped around the work it is allowed to perform.

That is useful for human review and especially useful for AI-generated code. The allowed side effects are visible before reading the implementation.

## The runtime owns the cross-cutting concerns

Real applications need authentication, validation, transactions, retries, audit trails, and infrastructure adapters. AIFA does not pretend those concerns disappear. It places them at a boundary where they can be applied consistently.

For an HTTP request or MCP tool call, the backend flow is:

```text
HTTP request or MCP tool
        ↓
discover the feature manifest
        ↓
resolve actor and check scopes
        ↓
validate input against JSON Schema
        ↓
apply idempotency and transaction policy
        ↓
grant declared capabilities
        ↓
execute feature behavior
        ↓
validate the typed result
        ↓
commit data, audit, and outbox records
```

The feature stays focused on the rule that makes it unique. The runtime handles policies that must not vary by transport or by whichever developer happened to implement the use case.

Task mutations use caller-supplied idempotency keys. Status changes and deletion use optimistic versions so a stale client cannot silently overwrite newer work. MongoDB adapters apply the tenant from the authenticated actor rather than trusting a tenant ID supplied by feature code. Successful mutations write the business change, audit record, and outbox event atomically.

These are not decorative enterprise patterns. They answer concrete failure modes: duplicate agent retries, concurrent browser sessions, cross-tenant data access, and events published for changes that never committed.

## The browser and AI use the same business path

Focusly exposes product operations through HTTP and MCP, but the adapters contain translation rather than duplicate business logic.

Both paths invoke the same discovered feature through the same AIFA runtime:

```text
Person → React UI → HTTP ┐
                         ├→ AIFA runtime → feature → capabilities
AI client → MCP ─────────┘
```

That means an MCP client calling `create_task` cannot skip title validation, tenant scope, `TaskWrite` authorization, idempotency, auditing, or event publication.

The same principle applies to destructive or state-changing operations. Delete Task declares confirmation requirements. Change Task Status requires an explicit instruction and an expected version. The transport cannot invent a more permissive path.

This is one of the most important business properties of the demo. As AI clients become another interface to software, “API parity” is not enough. They need **policy parity**.

## AI proposes; the user decides

The Generate Task Plan feature is intentionally separate from Create Task.

It accepts a natural-language goal, calls a provider-neutral `AssistantGenerateTaskPlan` capability, validates the provider response, stores a tenant-owned plan with provenance, and emits `TaskPlanGeneratedV1`.

It does **not** silently create tasks.

That boundary encodes the product’s trust model. A suggestion is not yet a commitment. The user can review the proposed title, category, and priority. Accepted suggestions enter the system through Create Task, where the ordinary validation and governance rules apply.

Ollama is the first planning adapter, but the feature does not import an Ollama SDK. Another local or cloud provider can implement the same capability without rewriting the product behavior. Provider output is untrusted data and must satisfy a versioned schema before feature logic accepts it.

This is how AIFA connects product policy to technical design: the distinction between “suggest” and “act” is not just a sentence in a requirements document. It is a boundary between features.

## The frontend is composed from features too

Backend modularity is only half a vertical architecture. If every frontend feature still edits one central application component, independent delivery quickly collapses.

Focusly’s React shell publishes typed slots such as `TaskComposer`, `TaskList`, `TaskRowActions`, `AssistantPanel`, and `SettingsPanel`. Feature manifests contribute UI to those named extension points, and Vite discovers the contributions automatically.

Create Task contributes its form to `TaskComposer`. Generate Task Plan contributes to `AssistantPanel`. Change Status and Delete Task contribute independent actions to `TaskRowActions`.

The shell owns layout, but it does not maintain a hand-written list of product features.

Features also do not import one another to coordinate refreshes. A successful task mutation invalidates a semantic `TaskCollection` cache tag. Any independently mounted list, board, summary, or count that depends on that tag can update through the generic query runtime. Domain events use the same semantic invalidation path for changes originating from MCP, another browser, or background work.

The result is loose coupling without stale UI.

## Bounded contexts prevent “atomic” from becoming “tiny monolith”

An atomic feature still needs business language. Focusly groups that language into bounded contexts:

- **Task Management** owns tasks, categories, priorities, statuses, and status-transition invariants.
- **AI Planning** owns generated plans, suggestion validation, provenance, and planning rules.
- **Workspace Settings** owns AI-provider configuration.

A feature may use its own context’s domain model, but contexts do not import one another’s internal code. They communicate through versioned contracts or domain events.

For example, AI Planning may consume Task Management’s published task taxonomy, but it cannot reach into the Task entity or call Create Task directly. This keeps “shared code” from becoming an invisible coupling mechanism.

The distinction is subtle but important: features are independent delivery units, while bounded contexts preserve coherent business language.

## Guardrails make the architecture real

Architecture diagrams are easy to admire and easy to ignore. AIFA relies on executable checks:

- JSON Schema validation for feature definitions and boundary data;
- generated TypeScript types for contracts;
- deterministic feature discovery with duplicate detection;
- dependency-cruiser rules that reject forbidden imports and cycles;
- runtime denial of undeclared capabilities;
- behavioral tests executed through the real AIFA runtime;
- HTTP and MCP boundary tests;
- authorization, tenancy, idempotency, concurrency, outbox, and MongoDB integration tests;
- frontend tests for slot composition, cache invalidation, and accessibility.

The repository’s main verification commands are deliberately boring:

```bash
npm run check
npm test
npm run build
```

That is a feature, not a limitation. A human or AI agent should be able to make one bounded change and receive clear evidence that the contracts and architecture still hold.

## What AIFA costs

AIFA is not free structure.

You have to design capabilities carefully. A capability that is too broad recreates a service locator; one that is too narrow creates noise. Contracts and manifests add files. Dynamic discovery needs deterministic ordering and good failure messages. Cross-context schemas require versioning discipline. Not every button deserves its own feature folder.

The useful unit is the smallest meaningful product behavior that can be specified, implemented, and verified independently.

For a tiny application maintained by one person, this may be more architecture than necessary. The value grows when the codebase has multiple entry points, non-trivial policy, parallel contributors, or frequent AI-assisted changes.

In other words, AIFA moves work forward. You spend more effort defining boundaries before implementation so that implementation, review, testing, and future replacement become safer.

## What the demo changed for me

My earlier AIFA proof of concept started with a simple idea: a feature should know its purpose, contract, and allowed capabilities—not the whole application.

Focusly forced that idea to meet a real full-stack system.

Could frontend features compose without a central registry? Could an MCP client and a browser share one policy boundary? Could AI planning remain provider-neutral? Could tenant scope, idempotency, concurrency, audit, and events stay outside feature business logic without becoming invisible magic? Could the architecture tell an AI coding agent not only where to write code, but what it was forbidden to touch?

Building the demo turned those questions into executable contracts and tests.

The result is not the final word on AI-native architecture. It is a working reference implementation and an invitation to challenge the model with harder features.

If you are experimenting with coding agents, I think the key question is shifting. It is no longer only:

> How capable is the model?

It is also:

> How well does the codebase communicate the boundaries of a correct change?

AIFA is my attempt to make that communication part of the software itself.

Explore the [AIFA repository and Focusly demo on GitHub](https://github.com/AdrianBesleaga/AIFA). The repository includes the application, architecture guide, diagrams, feature contracts, and local setup instructions.

---

*If you try the architecture, find a boundary that does not hold, or have a different approach to safe human–AI software delivery, I would love to hear from you on [LinkedIn](https://www.linkedin.com/in/adrian-besleaga/).*
