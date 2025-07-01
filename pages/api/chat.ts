import { CoreMessage, experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getSession, SessionState, updateSession } from "../../lib/session";
import { recommend_mcp_tool } from "@/lib/tools/recommend_mcp_tool";
import { Instance } from "@/lib/glama-types";

export const runtime = "edge";

export const SESSION_ID = "user-session-poc"; // Simple session identifier for POC

async function handleConfirmation(
  messages: CoreMessage[],
  userSession: SessionState
) {
  const mcpClients = await Promise.all(
    userSession.recommendedMCPs!.map((instance: Instance) => {
      return experimental_createMCPClient({
        transport: {
          type: "sse",
          url: instance.endpoints.sse,
        },
      });
    })
  );
  const toolsSet = await Promise.all(
    mcpClients.map(async (mcpClient) => {
      try {
        const x = await mcpClient.tools();
        return x;
      } catch (error) {
        debugger;
      }
    })
  );

  return streamText({
    model: openai("gpt-4.1-nano"),
    // @ts-ignore
    tools: { ...Object.assign({}, ...toolsSet) },
    messages,
    // messages: [
    //   ...messages,
    //   {
    //     role: "assistant",
    //     content: `Great! I've bound your session to ${confirmedServer.name}. Future requests will use this context.`,
    //   },
    // ],
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

  if (userSession?.recommendedMCPs) {
    const result = await handleConfirmation(messages, userSession!);
    return result.toDataStreamResponse();
  }

  // if (userSession?.boundServer) {
  //   const result = await handleBoundSession(messages, userSession);
  //   return result.toDataStreamResponse();
  // }

  const result = await handleRecommendation(messages);
  return result.toDataStreamResponse();
}
