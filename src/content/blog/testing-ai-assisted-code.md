---
title: "AI Generates 50 Tests. You Need 5."
date: 2026-04-08
excerpt: "AI coding agents write too many tests, most of them bad. They mock everything, test implementation instead of behavior, and break on every refactor. There's a better way — and it starts with treating tests as specifications."
tags: ["testing", "bdd", "ai", "agentic-coding", "spec-driven-development", "piwi"]
---

Here's a pattern I see constantly when working with AI coding agents.

You ask the AI to implement a feature. It writes the code — and then generates 15 unit tests to go with it. Sounds productive, right? But look closer at what it actually produced:

- Tests that mock every single dependency, then assert the mocks were called with the right arguments. You're not testing logic — you're testing *wiring*.
- Tests for trivial getters, setters, and constructors. Lines of test code that verify nothing meaningful.
- Tests so tightly coupled to the implementation that renaming a private method breaks half the suite.
- Tests that pass today and break tomorrow when you ask the AI to refactor — not because the feature broke, but because the *structure* changed.

**14 unit tests fail.** Not because anything is wrong. Because the AI refactored the service it wrote yesterday, and every test was testing *how* the code works instead of *what* it does.

This is the reality of testing in the agentic coding era: **AI generates too many tests, and most of them are low quality.** They give you a false sense of coverage while actually making your codebase harder to evolve.

The problem isn't the AI. The problem is that we haven't given AI a **testing strategy** — a framework for writing *the right kind* of tests.

![How to Write Tests in the Agentic Coding Era](/images/agentic-testing-infographic.png)

## How I Build: Spec-Driven Development + Agentic Coding

Before talking about testing, let me explain how I build software — because the testing approach follows directly from the development approach.

I use **Spec-Driven Development** with agentic AI coding. The idea was formalized by GitHub's [spec-kit](https://github.com/github/spec-kit) (86,000+ stars), and it's the opposite of vibe coding. Instead of throwing a vague prompt at an AI and hoping for the best, you write structured specifications first, then let the AI implement them.

The workflow is: `constitution → specify → plan → tasks → implement`. Each phase produces a markdown artifact that feeds the next. The AI has full context — project principles, feature requirements, technical constraints, and a task breakdown — before it writes a single line of code.

This is how I build [Piwi.ai](https://piwi.ai) daily. I don't just prompt an AI to "add a feature." I specify what the feature should do, how it fits into the architecture, and what constraints it must respect. Then I let the AI agent handle the implementation — writing code, running tests, fixing issues, iterating until everything passes.

Spec-Driven Development solves a massive problem: it gives AI the **context** it needs to generate coherent, architecturally consistent code instead of disconnected fragments. There's a [growing community](https://www.reddit.com/r/AskProgramming/comments/1ogndg8/has_anyone_tried_specificationdriven_development/) of developers adopting this approach.

But here's the gap I noticed: **SDD focuses on how to build features. It doesn't prescribe how to test them.** And when you leave testing to the AI's defaults, you get the test-quality problem I described above.

If structured specs drive the code, shouldn't structured specs drive the tests too?

## Write Behavioral Tests, Not Implementation Tests

The principle that changed everything for me comes from **Behavior-Driven Development** (BDD) — but not the way most people think about it.

I'm not talking about Cucumber or Gherkin feature files. The BDD framework ecosystem adds its own overhead — step definitions, translation layers, `.feature` files that nobody outside engineering actually reads. That's ceremony, not substance.

What matters is the **principle**: test *what* the system does, not *how* it does it. Describe behaviors. Make the test data visible. Write tests that read like specifications.

Look at the difference between what AI typically generates vs. what you actually want:

```javascript
// What AI generates — tests implementation details
test('should call classifyDocument with correct params', () => {
  const mockAi = jest.fn().mockResolvedValue({ type: 'Invoice' });
  const service = new ClassificationService(mockAi);
  await service.classify(doc);
  expect(mockAi).toHaveBeenCalledWith({
    prompt: expect.stringContaining('classify'),
    schema: expect.any(Object)
  });
});
// AI will generate 10 more like this: testing constructors, mocking
// repositories, asserting on internal method calls...
// None of them test actual business behavior.
```

vs.

```typescript
// What you actually need — tests behavior, data as context
describe('Document Classification', () => {
  it('should classify an Italian identity card', async () => {
    const doc = await uploadDocument('carta_identita_mario.pdf');

    const result = await classificationPipeline.process(doc);

    expect(result.type).toBe('IdentityCard');
    expect(result.confidence).toBeGreaterThan(0.85);
  });

  it('should not attempt extraction for unknown documents', async () => {
    const doc = await uploadDocument('random_flyer.pdf');

    const result = await classificationPipeline.process(doc);

    expect(result.type).toBe('Unknown');
    expect(result.extractionAttempted).toBe(false);
  });
});
```

The first test breaks if you rename the method, change the AI service interface, or restructure how the prompt is built — which AI agents do *all the time*. The second test doesn't care about any of that. It tests what the system *does*, not how it does it. No mocks, no spies, no implementation coupling.

For agentic coding workflows, this distinction is everything:

- **Human-readable**: Both developers and AI agents immediately understand what's being tested
- **Declarative**: Describes *what* should happen, not *how* — survives constant refactoring
- **Context-rich**: The test data and scenario names are documentation that AI can use as context for future work
- **Quality over quantity**: One behavioral integration test replaces 5-10 brittle mock-heavy unit tests
- **No extra framework**: Plain Vitest/Jest — no Gherkin, no step definitions, no translation layer

## Integration Over Unit: The Antirez Perspective

Salvatore Sanfilippo — [antirez](https://www.youtube.com/@antirez), the creator of Redis — has been vocal about a related idea that reinforces this approach: **focus on integration testing more than unit testing**.

His argument resonated deeply with what I was experiencing with agentic coding. Integration tests verify **logic and behavior** — they exercise your system the way a user would. Unit tests verify *implementation details* — they're coupled to the internal structure of your code.

When an AI agent refactors your code (and it does this *constantly* — every improvement, every cleanup, every extraction), integration tests survive. They don't care that you renamed a private method or extracted a helper class. They care that when a document is uploaded, it comes out classified correctly on the other end.

Antirez has noted that having a robust test suite is a "massive unlock" for working with coding agents. And he's right — but the key word is *robust*. Fifty auto-generated unit tests that mock everything aren't robust. They're fragile scaffolding that collapses the moment the AI touches the implementation.

Five well-crafted integration tests that verify business behavior? Those are indestructible. They become the contract between you and the AI: "I don't care how you build it — just make these pass."

The insight is this: in the agentic coding era, your test suite isn't just a safety net. **It's the interface between you and the AI.** Write tests that describe behavior, and the AI can verify its own work. Write tests that verify implementation, and you'll spend half your time fixing tests instead of shipping features.

## Real-World Example: Testing the Piwi.ai Pipeline

I experienced this firsthand while building [Piwi.ai](https://piwi.ai) — an AI-powered document processing platform. The pipeline classifies documents, extracts data, verifies accuracy, and links entities across documents. I use Spec-Driven Development to spec each feature, then let an AI agent implement it.

Early on, I let the AI generate unit tests. Hundreds of tests that mocked everything — and tested nothing meaningful. Every refactor broke dozens of them.

The pattern that changed everything was **table-driven behavioral tests** — the BDD principle without the Gherkin overhead:

```typescript
/**
 * Entity Merging — Scenario Table
 * Rules defined in docs/entity_test_cases.md
 *
 * Rule 1: Matching identifiers → MERGE
 * Rule 2: Conflicting identifiers → SPLIT
 * Rule 3: No identifiers → SPLIT
 */
describe('Entity Resolution', () => {
  it.each([
    ['Same SSN',        { ssn: '123-45-6789' }, { ssn: '123-45-6789' }, true],
    ['Different SSN',   { ssn: '123-45-6789' }, { ssn: '987-65-4321' }, false],
    ['No identifiers',  {},                      {},                     false],
    ['Partial overlap',
      { name: 'John', ssn: '123-45-6789' },
      { ssn: '123-45-6789' },                                           true],
    ['Name match only',
      { name: 'John Doe' },
      { name: 'John Doe' },                                             true],
  ])('%s → merge: %s', (scenario, entityA, entityB, shouldMerge) => {
    const result = matcher.canMerge(
      createEntity(entityA),
      createEntity(entityB)
    );
    expect(result).toBe(shouldMerge);
  });
});
```

![Why Test Context Matters](/images/test-context-infographic.png)

Look at what this test does right:

1. **The comment block is the spec.** The business rules are documented right above the test. Both the developer and the AI agent understand *why* these scenarios exist.

2. **The data IS the documentation.** Same SSN → merge. Different SSN → split. You don't need Gherkin prose — the table tells the story.

3. **Scenario IDs link to external specs.** Each row maps to documented test cases. The spec drives the tests.

4. **It survived three rewrites.** The matching algorithm changed from a naive loop to a graph-based approach to a weighted scoring system. These tests didn't change once.

When I ask an AI agent to modify this logic, I include this test file as context. The agent reads the scenario table and immediately understands the rules, the edge cases, and the expected outcomes. **The test is the spec, and the spec is the test.**

Compare this to what AI generates by default: 15 unit tests that mock internals, assert on method call arguments, and break the moment you rename anything.

### The Same Pattern Works Everywhere

Classification, extraction, validation — same approach:

```typescript
describe('Document Classification', () => {
  it.each([
    ['invoice.pdf',     'Invoice',     0.85],
    ['contract.pdf',    'Contract',    0.80],
    ['id_card.pdf',     'IdentityDoc', 0.90],
    ['random_flyer.pdf', 'Unknown',    0],
  ])('classifies %s as %s', async (file, expectedType, minConfidence) => {
    const doc = await uploadDocument(file);
    const result = await pipeline.classify(doc);

    expect(result.type).toBe(expectedType);
    if (minConfidence > 0) {
      expect(result.confidence).toBeGreaterThan(minConfidence);
    }
  });
});
```

Four lines of test data. Four documents classified. No mocks. No Gherkin. The data table is the specification.

## The Testing Pyramid, Reimagined

The traditional testing pyramid says: write lots of unit tests, fewer integration tests, even fewer E2E tests. In AI-assisted development, I think we need to **flip the emphasis**:

```
          ╭───────────────────╮
          │  E2E (Playwright)     │  Full user journeys
          ├───────────────────────┤
          │ Behavioral / Integration  │  THE SWEET SPOT
          │ Table-driven, no mocks    │  ← Most of your tests here
          ├───────────────────────────┤
          │ Unit Tests (targeted)         │  Pure functions only
          ╰───────────────────────────────╯
```

Unit tests still make sense for **pure functions** — validators, formatters, calculators, shared utilities. Things with no dependencies, no side effects, no AI. The Italian fiscal code checksum validator? Unit test it. A date parser? Unit test it.

But for **business logic, workflows, API contracts, and AI pipelines** — behavioral integration tests are the right tool. Data-driven, spec-referenced, describing what the system does rather than how. They survive the constant evolution that agentic development brings.

## The Playbook: From Spec to Test

If you're building with agentic coding and want to adopt this approach, here's what worked for me:

1. **Write the spec first** — use spec-kit, a SPEC.md file, or even just a structured markdown document. Don't let the AI start coding from a vague prompt
2. **Define test scenarios in your spec** — a table of inputs and expected outputs, scenario IDs, business rules. This becomes both the spec *and* the test data
3. **Write table-driven integration tests** — `it.each` with scenario tables directly in your test framework. No Gherkin, no step definitions, no extra layer
4. **Document the rules above the test** — a comment block explaining the business rules gives AI agents full context. The why matters as much as the what
5. **Stop the AI from generating unit tests for everything** — be explicit in your specs or agent instructions: "behavioral integration tests only, no mocking of business logic"
6. **Run integration tests as your primary CI gate** — your pipeline should verify that behavior works, not that internal implementations haven't changed
7. **Feed test files back to AI as context** — when prompting AI to implement or fix a feature, include the test file. The scenario table IS the contract
8. **Reserve unit tests for pure functions** — validators, formatters, math. If it has no dependencies, unit test it. If it has dependencies, integration test it

## Tests Are the New Spec

The way we test code is changing because the way we write code is changing.

In the agentic coding era, the biggest risk isn't having too few tests — it's having **too many bad ones**. AI agents will happily generate 50 unit tests that mock everything and verify nothing. They'll give you 95% coverage and zero confidence.

The fix isn't writing more tests. It's writing **the right kind** of tests. Tests where the data is visible, the rules are documented, and the scenarios map to your specification. Tests that an AI agent can read and immediately understand the contract it needs to fulfill.

Spec-Driven Development gave us structured specs to guide code generation. Behavioral integration tests close the loop — the spec drives the test, and the test verifies the behavior.

**Spec → Code → Behavioral Test → Verification.** The loop closes.

The AI builds the system. The tests verify the behavior. The human stays in control of *what* the system should do. And the test file? It's the single source of truth that everyone — developer, AI agent, and future maintainer — can read.

That's how testing works in the agentic coding era.

---

*Building with AI agents? I'd love to hear how you're handling the testing problem. Reach out on [LinkedIn](https://www.linkedin.com/in/adrian-besleaga/) or try [Piwi.ai](https://piwi.ai) — where we practice what we preach.*
