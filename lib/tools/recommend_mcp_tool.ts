import { findBestMCPs } from "@/lib/glama";
import glamaResponse from "../mocks/instances.json";
import { GlamaResponse, Instance } from "../glama-types";
import { z } from "zod";
import { updateSession } from "../session";

const mcpSummary = (glamaResponse as unknown as GlamaResponse).instances.map(
  (i) => ({
    name: i.mcpServer.name,
    description: i.mcpServer.description,
    tools: i.mcpServer.tools.map((t) => ({
      name: t.name,
      description: t.description,
    })),
  })
);

const description = `This Tool Recommends relevant MCP Servers from the below list:

${JSON.stringify(mcpSummary)}
`;

export const recommend_mcp_tool = (sessionId: string) => ({
  description,
  parameters: z.object({
    query: z.string().describe("The user query to analyze for tool matching."),
  }),
  execute: async ({ query }: { query: string }) => {
    console.log(`Recommending MCPs for query: ${query}`);
    const recommendedMCPs: Instance[] = await findBestMCPs(query);
    if (recommendedMCPs.length > 0) {
      updateSession(sessionId, {
        recommendedMCPs,
      });
      return `The following MCP Servers are enabled: \`${recommendedMCPs
        .map((instance) => instance.mcpServer.name)
        .join(", ")}\` which supports: ${recommendedMCPs
        .flatMap((instance) => instance.mcpServer.tools.map((t) => t.name))
        .join(", ")}. Please repeat the query to use the selected MCPs.`;
    }
    return "I couldn't find a suitable MCP server for your request.";
  },
});
