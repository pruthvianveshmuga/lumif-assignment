import { CoreMessage, experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getSession, SessionState, updateSession } from "../../lib/session";
import { recommend_mcp_tool } from "@/lib/tools/recommend_mcp_tool";
import { Instance } from "@/lib/glama-types";
import { cookies, headers } from "next/headers";
import { parse, serialize } from "cookie";

export const runtime = "edge";

const handleUserMessage = async (
  messages: CoreMessage[],
  userSession: SessionState,
  sessionId: string
) => {
  let tools = { recommend_mcp_tool };
  if (userSession?.recommendedMCPs) {
    const toolsSet = await Promise.all(
      userSession.recommendedMCPs!.map(async (instance: Instance) => {
        const mcpClient = await experimental_createMCPClient({
          transport: {
            type: "sse",
            url: (instance as Instance).endpoints.sse,
          },
        });
        return await mcpClient.tools();
      })
    );
    tools = Object.assign(tools, ...toolsSet);
  }
  return streamText({
    model: openai("gpt-4.1-nano"),
    messages,
    tools,
    onFinish: async ({ toolResults }) => {
      if (!toolResults) return;

      const mcpRecommendationResult = toolResults.find(
        (r) => r.toolName === "recommend_mcp_tool"
      );

      if (mcpRecommendationResult) {
        const result = mcpRecommendationResult.result as {
          recommendedMCPs: Instance[];
          message: string;
        };
        const recommendedMCPs = result.recommendedMCPs;

        if (recommendedMCPs && recommendedMCPs.length > 0) {
          console.log("Updating session with recommended MCPs");
          updateSession(sessionId, {
            recommendedMCPs,
          });
        }
      }
    },
  });
};

export default async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();
    const cookies = parse(req.headers.get("cookie") || "");
    let sessionId = cookies.sessionId;
    let setCookie = false;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setCookie = true;
    }

    const userSession = getSession(sessionId);
    const result = await handleUserMessage(messages, userSession, sessionId);
    const response = result.toDataStreamResponse();

    if (setCookie) {
      const cookie = serialize("sessionId", sessionId, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/", // Cookie is valid throughout the site
        maxAge: 60 * 60 * 24, // 1 day
      });
      response.headers.set("Set-Cookie", cookie);
    }
    return response;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    if (error instanceof Error && error.name === "TimeoutError") {
      return new Response("The request timed out.", { status: 408 });
    }
    return new Response("An unexpected error occurred.", { status: 500 });
  }
}
