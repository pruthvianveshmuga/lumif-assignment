import { CoreMessage, experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getSession, updateSession } from "../../lib/session";
import { findBestMCPServer } from "../../lib/glama";
import { Server } from "../../lib/glama-types";

export const runtime = "edge";

const SESSION_ID = "user-session-poc"; // Simple session identifier for POC

async function handleConfirmation(messages: CoreMessage[], userSession: any) {
  const confirmedServer = userSession.pendingRecommendation;
  updateSession(SESSION_ID, {
    boundServer: confirmedServer,
    pendingRecommendation: null,
  });

  return streamText({
    model: openai("gpt-4.1-nano"),
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
  const clientTwo = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "https://glama.ai/mcp/instances/a5pjv7m4x2/sse?token=8a94c902-7f4c-4cae-9292-0ca21bbfee20",
    },
  });
  const toolSetTwo = await clientTwo.tools();

  return streamText({
    model: openai("gpt-4.1-nano"),
    messages,
    tools: {
      ...toolSetTwo,
      recommend_mcp: {
        description:
          "Recommends the best MCP server based on the user query by fetching and ranking MCP servers.",
        parameters: z.object({
          query: z
            .string()
            .describe("The user query to analyze for tool matching."),
        }),
        execute: async ({ query }) => {
          console.log(`Recommending MCP for query: ${query}`);
          const bestServer = await findBestMCPServer(query);

          if (bestServer) {
            updateSession(SESSION_ID, {
              pendingRecommendation: bestServer,
            });
            return `I recommend MCP Server \`${
              bestServer.name
            }\` which supports: ${bestServer.tools
              .map((t) => t.name)
              .join(", ")}. Would you like to proceed with this?`;
          }

          return "I couldn't find a suitable MCP server for your request.";
        },
      },
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
    userSession?.pendingRecommendation &&
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
