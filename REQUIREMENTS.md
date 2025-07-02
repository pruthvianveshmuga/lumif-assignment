- Create a simple web based chat application that can find and recommend MCP servers for
  users depending on their requirement and add that to their chat session. The user can then
  proceed to use the MCP tools for any query.
- You can use the following resources to set up your chat application and backend
  1. https://sdk.vercel.ai/docs/ai-sdk-ui/overview - You can use this to help setup the API
     connector logic between your UI and the LLM API
  2. https://openai.github.io/openai-agents-python/ - To set up the agent framework. The
     Agents SDK supports MCP inherently. You can also explore other frameworks like BeeAI
     or any of your choice
  3. @llamaindex/chat-ui - For prebuilt UI components for chat interface (React based)
  4. https://glama.ai/mcp/servers - Use this as your dataset for MCP servers to choose and
     recommend from
- The above resources should help you rapidly set up a chat application connected to a backend
  API to run the agent. You may use any other resources you like, these are recommendations to
  help you create the POC task.

Open the above links and use the fundamental building blocks within it instead of implementing from scratch.
