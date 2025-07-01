import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { GlamaResponse, Server } from "../../lib/glama-types";

export const runtime = "edge";

// In-memory store for session state (for POC)
const sessionStore = new Map<string, any>();

export default async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  // A simple session identifier (in a real app, use a secure session ID)
  const sessionId = "user-session-poc";

  const lastMessage = messages[messages.length - 1];
  const lastMessageContent =
    typeof lastMessage.content === "string" ? lastMessage.content : "";
  const userSession = sessionStore.get(sessionId);

  // 1. Check if user is confirming an MCP server recommendation
  if (
    userSession?.pendingRecommendation &&
    lastMessageContent.toLowerCase().includes("yes")
  ) {
    const confirmedServer = userSession.pendingRecommendation;
    sessionStore.set(sessionId, {
      ...userSession,
      boundServer: confirmedServer,
      pendingRecommendation: null,
    });

    const result = await streamText({
      model: openai("gpt-4.1-nano"),
      messages: [
        ...messages,
        {
          role: "assistant",
          content: `Great! I've bound your session to ${confirmedServer.name}. Future requests will use this context.`,
        },
      ],
    });
    return result.toDataStreamResponse();
  }

  // If a server is already bound, acknowledge it.
  if (userSession?.boundServer) {
    const result = await streamText({
      model: openai("gpt-4.1-nano"),
      messages: [
        ...messages,
        {
          role: "assistant",
          content: `Your session is bound to ${userSession.boundServer.name}. I am ready for your next command.`,
        },
      ],
    });
    return result.toDataStreamResponse();
  }

  const result = await streamText({
    model: openai("gpt-4.1-nano"),
    messages,
    tools: {
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

          try {
            const response = await fetch("https://glama.ai/api/mcp/v1/servers");
            if (!response.ok) {
              throw new Error("Failed to fetch MCP servers");
            }
            const glamaResponse: GlamaResponse = await response.json();
            const servers = glamaResponse.servers;

            const query_lowercase = query.toLowerCase();

            const bestServer = servers[3];

            if (bestServer) {
              sessionStore.set(sessionId, {
                pendingRecommendation: bestServer,
              });
              return `I recommend MCP Server \`${
                bestServer.name
              }\` which supports: ${bestServer.tools
                .map((t) => t.name)
                .join(", ")}. Would you like to proceed with this?`;
            }

            return "I couldn't find a suitable MCP server for your request.";
          } catch (error) {
            console.error("Error fetching or processing MCP servers:", error);
            return "Sorry, I encountered an error while trying to find an MCP server.";
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
