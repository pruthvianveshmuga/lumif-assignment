import { CoreMessage, experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getSession, updateSession } from "../../lib/session";
import { recommend_mcp_tool } from "@/lib/tools/recommend_mcp_tool";

export const runtime = "edge";

export const SESSION_ID = "user-session-poc"; // Simple session identifier for POC

async function handleConfirmation(messages: CoreMessage[], userSession: any) {
  const confirmedServer = userSession.pendingRecommendation;
  updateSession(SESSION_ID, {
    boundServer: confirmedServer,
    pendingRecommendations: null,
  });

  // TODO: Add boundServer.endpoints.sse url below
  const mcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "https://glama.ai/mcp/instances/a5pjv7m4x2/sse?token=8a94c902-7f4c-4cae-9292-0ca21bbfee20",
    },
  });
  const mootlessToolsSet = await mcpClient.tools();

  return streamText({
    model: openai("gpt-4.1-nano"),
    tools: { recommend_mcp_tool, ...mootlessToolsSet },
    messages: [
      ...messages,
      {
        role: "assistant",
        content: `Great! I've bound your session to ${confirmedServer.name}. Future requests will use this context.`,
      },
    ],
  });
}

async function handleBoundSession(messages: CoreMessage[], userSession: any) {
  return streamText({
    model: openai("gpt-4.1-nano"),
    messages: [
      ...messages,
      {
        role: "assistant",
        content: `Your session is bound to ${userSession.boundServer.name}. I am ready for your next command.`,
      },
    ],
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

  const lastMessage = messages[messages.length - 1];
  const lastMessageContent =
    typeof lastMessage.content === "string" ? lastMessage.content : "";
  const userSession = getSession(SESSION_ID);

  if (
    userSession?.pendingRecommendations &&
    lastMessageContent.toLowerCase().includes("yes")
  ) {
    const result = await handleConfirmation(messages, userSession);
    return result.toDataStreamResponse();
  }

  if (userSession?.boundServer) {
    const result = await handleBoundSession(messages, userSession);
    return result.toDataStreamResponse();
  }

  const result = await handleRecommendation(messages);
  return result.toDataStreamResponse();
}
