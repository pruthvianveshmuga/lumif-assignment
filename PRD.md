# 🧾 Product Requirements Document (PRD)

## 📌 Title:

**Intelligent Chat Application with MCP Server Recommendation (Model Context Protocol)**

---

## 📍 Objective

Create a web-based chat application that:

1. Allows users to chat with an LLM agent.
2. Detects the user’s goal/task.
3. Recommends the most appropriate **MCP server** (Model Context Protocol environment) based on the tools available (e.g., code interpreter, web search, pandas).
4. Binds the selected MCP environment to the user’s session for subsequent queries.
5. Uses officially supported SDKs and libraries for LLM agent orchestration, chat UI, and backend streaming.

---

## 🛠️ Tech Stack

| Layer                    | Technology                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**             | [@llamaindex/chat-ui](https://www.npmjs.com/package/@llamaindex/chat-ui) (React chat UI) https://ai-sdk.dev/docs/ai-sdk-ui |
| **Frontend**             | [@ai-sdk/react](https://ai-sdk.dev/docs/ai-sdk-ui) (React state management)                                                |
| **Framework**            | [**Next.js with Pages Router**](https://nextjs.org/docs)                                                                   |
| **Middleware/API Layer** | [@vercel/ai](https://www.npmjs.com/package/ai) (AI SDK for streaming chat)                                                 |
| **Agent Backend**        | [openai-agents-js](https://openai.github.io/openai-agents-js/) (JavaScript SDK for agent orchestration)                    |
| **MCP Source**           | `https://glama.ai/mcp/servers` (List of MCP server/toolchains)                                                             |

> 🧠 **NOTE TO LLM:** When implementing functionality (e.g. chat handler, streaming, tool execution), always prefer **official libraries/utilities** over custom implementations, unless explicitly required.

---

## 🧩 Features & Functional Requirements

### 1. **Chat Interface**

- Use `@llamaindex/chat-ui` to build a clean, responsive chat UI.
- Route all chat messages to the `/api/chat` API endpoint using Vercel AI SDK.

### 2. **MCP Server Recommendation**

- On user messages, analyze the task (e.g., code analysis, data processing, web search).

- Query the MCP server list from `https://glama.ai/mcp/servers`.

- Match user input to compatible tools.

- Recommend the most relevant MCP server using a scoring or filtering algorithm.

- Return a response like:

```
"I recommend MCP Server `alpha-tools-v2` which supports: code-interpreter, pandas. Location: US-East. Would you like to proceed with this?"
```

### 3. **MCP Session Binding**

- Upon user confirmation (e.g., "yes"), bind the selected MCP environment to the user session.
- Store in-memory or with cookie/session state (based on Next.js API request object).
- Future user queries should be routed within that MCP context.

### 4. **Agent Logic**

- Use the **OpenAI Agents SDK for JavaScript (`openai-agents-js`)**.
- Define tools:

  - `recommend_mcp`: fetch and rank MCP servers

- Initialize the agent with this tool.
- Use `agent.run()` to handle user messages, with history.

---

## 🔁 Request-Response Flow

1. `User types`: "I want to analyze a dataset and plot graphs"
2. Backend:

   - Matches `pandas`, `matplotlib`, `code-interpreter` from tool keywords.
   - Picks matching MCP server and returns description.

3. `User confirms`: "Yes"
4. MCP context is stored.
5. Future messages are routed via selected MCP (e.g., "Now analyze this CSV...").

---

## ⚠️ Constraints & Instructions for the LLM

- ✅ Use **official packages**:

  - `@vercel/ai` for streaming
  - `openai-agents-js` for agent execution
  - `@llamaindex/chat-ui` for frontend UI

- ❌ Avoid writing custom agent runners unless the SDK does not support it
- ✅ Use `Edge Runtime` in `/pages/api/chat.ts`
- ❌ Do not use App Router or React Server Components
- ✅ Session state can be managed in-memory (for POC), or persisted via a store if extended

---

## ✅ Success Criteria

| Requirement        | Met when...                                                   |
| ------------------ | ------------------------------------------------------------- |
| Chat works         | Messages stream between UI and backend                        |
| MCP recommendation | Agent suggests a compatible MCP server based on task          |
| User confirmation  | User accepts recommended MCP server                           |
| Context switching  | Future tasks are routed with selected MCP environment         |
| Official SDKs      | All functionality leverages official tools unless unavailable |
