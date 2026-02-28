---
name: "WebMCP"
tagline: "The browser-native protocol that lets AI agents interact with web apps — no servers, no API keys"
category: ["ai", "developer-tools", "browser", "protocol"]
website: "https://webmcp.dev"
rating: 5
pricing:
  hasFree: true
  startsAt: 0
  currency: "USD"
verdict:
  bestFor: "Teams building AI-powered web apps who want zero-config, browser-native tool calling with built-in auth"
  notFor: "Headless automation pipelines, CI/CD, or server-to-server integrations — use MCP for those"
pros:
  - "Authentication is built-in — piggybacks on the user's browser session"
  - "Full URL context and navigation — AI knows what page you're on"
  - "Complete JavaScript support — call any client-side function"
  - "Zero infrastructure — no backend, no API keys, no separate auth layer"
  - "Works with existing web apps — add tools without changing your backend"
  - "User's permissions apply automatically — no privilege escalation risk"
cons:
  - "Early stage — Chrome 146 early preview, formal browser support mid-to-late 2026"
  - "Client-side only — can't run headless or in CI/CD pipelines"
  - "Requires browser extension or native browser support"
  - "Not suitable for server-to-server automation"
openSource: true
date: 2026-02-28
lastVerified: 2026-02-28
---

<div style="display: flex; justify-content: center; margin: 2rem 0;">
<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7432124471127351297?collapsed=1" height="550" width="504" frameborder="0" allowfullscreen="" title="WebMCP for Nuxeo Demo"></iframe>
</div>

## What Is WebMCP?

WebMCP (Web Model Context Protocol) is an emerging web standard — developed by Microsoft and Google — that lets AI agents interact with websites through structured, callable tools. Instead of scraping HTML or guessing at UI elements, AI agents can call defined JavaScript functions exposed by the web app.

Think of it this way: **MCP lets AI talk to servers. WebMCP lets AI talk to websites.**

It's the browser-native counterpart to Anthropic's MCP protocol. Where MCP connects AI to backend tools and APIs, WebMCP connects AI to the web apps your users already have open in their browser.

## MCP vs WebMCP — When to Use What

This is the most important distinction to understand. They're **complementary**, not competing:

| | **MCP** | **WebMCP** |
|---|---|---|
| **Runs where** | Server-side | Client-side (browser) |
| **Authentication** | Needs API keys, OAuth, tokens | User's browser session IS the auth |
| **Context** | No awareness of user's UI | Knows the current URL, page state |
| **Infrastructure** | Requires backend, deployment | Zero infrastructure |
| **Best for** | Automation, CI/CD, pipelines | Interactive web apps, browser-based AI |
| **JavaScript** | Server-side only | Full client-side JS support |
| **Analogy** | USB — plug any device in | The web page itself becomes the tool |

**Use MCP when:** You need headless automation, server-to-server communication, or pipeline integrations. MCP is the right choice for CI/CD, background processing, scheduled jobs, and systems without a UI.

**Use WebMCP when:** Your users are already in a web app and you want AI to assist them right there. The AI operates with the same permissions as the logged-in user — no separate auth, no privilege escalation, no API keys to manage.

## The Three Superpowers of WebMCP

### 1. Authentication Is Built Into the Browser

This is the killer feature. With traditional MCP, you need to set up OAuth flows, manage API keys, handle token refresh, and build a separate authentication layer for the AI agent. That's real engineering work.

With WebMCP, **the user's browser session IS the authentication layer**. The AI agent operates with exactly the same permissions as the logged-in user. If the user can see a document, the AI can see it. If the user can edit a record, the AI can edit it.

No API keys. No OAuth. No token management. No privilege escalation risk.

This is a fundamental shift in how AI tools handle auth. For enterprise apps where authentication is complex (SSO, SAML, multi-factor), WebMCP sidesteps the entire problem.

### 2. URL Context and Navigation

WebMCP gives the AI **awareness of what the user is looking at**. It knows the current URL, the page state, and the document being viewed. This context is incredibly powerful.

Imagine you're viewing a document in a content management system. With MCP, you'd need to explicitly tell the AI which document you're working with — pass an ID, a path, a reference. With WebMCP, the AI already knows. It sees what you see.

Even better, WebMCP can **navigate the UI** — open documents, browse folders, switch views. The AI doesn't just read data; it can move through the application the same way a user would.

### 3. Full JavaScript Support

WebMCP exposes JavaScript functions as callable tools. This means the AI can interact with any client-side logic — form validation, state management, computed values, DOM manipulation, API calls through the app's existing HTTP client.

This isn't limited to reading data. The AI can trigger actions, update state, and interact with the full richness of a modern web application.

## Real-World Example: WebMCP for Nuxeo

I built a WebMCP addon for [Nuxeo](https://www.nuxeo.com/) — a leading enterprise content management platform — with **24 AI-powered tools** that let an agent search, create, update, navigate, and manage documents. All running in the browser.

Here's what that looks like in practice:

A user is viewing a document in Nuxeo. They ask the AI:

> *"Find all contracts from last quarter and update their status to reviewed."*

The AI, through WebMCP:
1. **Knows** the user is in Nuxeo (URL context)
2. **Searches** for contracts using Nuxeo's search API (via exposed JavaScript tools)
3. **Updates** each document's status (with the user's existing permissions)
4. **Navigates** to each document to confirm the change

No backend integration. No API keys. No separate MCP server. The addon just exposes the right JavaScript functions, and the AI calls them.

## Managing Your Tools at Scale

Once you start building WebMCP tools, you'll quickly run into the next challenge: **how do you manage, monitor, and iterate on them without redeploying?**

That's exactly why I built [WebMCP Tools](https://web-mcp.tools) — a SaaS dashboard where you can register, A/B test, and monitor all your MCP tools from one place. Change a tool's description, test two versions side by side, and see which one the AI uses more accurately — all without touching code.

👉 **[Read the full WebMCP Tools deep-dive →](/tech/webmcp-tools)**

## When to Choose WebMCP Over MCP

The decision is straightforward:

**Your users are already in a web app?** → WebMCP. Meet them where they are.

**You need server-side automation?** → MCP. It's built for headless pipelines.

**You need both?** → Use both. They're complementary. MCP for your backend automation and CI/CD. WebMCP for the interactive browser experience.

The agentic economy needs both protocols. MCP is the backbone for machine-to-machine communication. WebMCP is the interface for human-AI collaboration in the browser.

The web is where your users already are. WebMCP makes it the place where AI meets them.

---

*Building with WebMCP? I'd love to see what you're creating. Reach out on [LinkedIn](https://www.linkedin.com/in/adrian-besleaga/).*
