import { findBestMCPs } from "@/lib/glama";
import { updateSession } from "@/lib/session";
import { SESSION_ID } from "../../pages/api/chat";
import glamaResponse from "../mocks/instances.json";
import { z } from "zod";

const description = `This Tool Recommends from the below list of MCP servers if relevant to the user query:

${JSON.stringify(glamaResponse)}
`;

export const recommend_mcp_tool = {
  description,
  parameters: z.object({
    query: z.string().describe("The user query to analyze for tool matching."),
  }),
  execute: async ({ query }: { query: string }) => {
    console.log(`Recommending MCPs for query: ${query}`);
    const recommendedMCPs = await findBestMCPs(query);

    if (recommendedMCPs.length > 0) {
      updateSession(SESSION_ID, {
        recommendedMCPs,
      });
      return `The following MCP Servers are enabled: \`${recommendedMCPs
        .map((instance) => instance.mcpServer.name)
        .join(", ")}\` which supports: ${recommendedMCPs
        .flatMap((instance) => instance.mcpServer.tools.map((t) => t.name))
        .join(", ")}.`;
    }

    return "I couldn't find a suitable MCP server for your request.";
  },
};
