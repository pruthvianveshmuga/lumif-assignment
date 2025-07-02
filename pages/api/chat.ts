import { CoreMessage, experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getSession, SessionState } from "../../lib/session";
import { recommend_mcp_tool } from "@/lib/tools/recommend_mcp_tool";
import { Instance } from "@/lib/glama-types";

export const runtime = "edge";

export const SESSION_ID = "user-session-poc"; // Simple session identifier for POC

async function handleMCPChat(
  messages: CoreMessage[],
  userSession: SessionState
) {
  const toolsSet = await Promise.all(
    userSession.recommendedMCPs!.map(async (instance: Instance) => {
      const mcpClient = await experimental_createMCPClient({
        transport: {
          type: "sse",
          url: instance.endpoints.sse,
        },
      });
      return await mcpClient.tools();
    })
  );

  return streamText({
    model: openai("gpt-4.1-nano"),
    tools: { ...Object.assign({}, ...toolsSet) },
    messages,
  });
}

async function handleRecommendation(messages: CoreMessage[]) {
  return streamText({
    model: openai("gpt-4.1-nano"),
    messages,
    tools: {
      recommend_mcp_tool,
    },
  });
}

export default async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();
  const userSession = getSession(SESSION_ID);

  if (userSession?.recommendedMCPs) {
    const result = await handleMCPChat(messages, userSession!);
    return result.toDataStreamResponse();
  }

  const result = await handleRecommendation(messages);
  return result.toDataStreamResponse();
}
