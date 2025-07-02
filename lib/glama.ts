import { generateObject } from "ai";
import { GlamaResponse, Instance } from "./glama-types";
import glamaResponse from "./mocks/instances.json";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const mcpSummary = (glamaResponse as unknown as GlamaResponse).instances.map(
  (i) => ({
    name: i.mcpServer.name,
    description: i.mcpServer.description,
    namespace: i.mcpServer.namespace,
    slug: i.mcpServer.slug,
    tools: i.mcpServer.tools.map((t) => ({
      name: t.name,
      description: t.description,
    })),
  })
);

export async function findBestMCPs(query: string): Promise<Instance[]> {
  try {
    // TODO: call "https://glama.ai/api/mcp/v1/instances" and get glamaResponse
    const allInstances = (glamaResponse as unknown as GlamaResponse).instances;
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        bestMCPs: z.array(
          z.object({
            namespace: z.string(),
            slug: z.string(),
          })
        ),
      }),
      prompt: `Return relevant MCP servers for the query: ${query}
    from the following list of MCP servers:
    ${JSON.stringify(mcpSummary)}
    `,
    });
    const bestMCPs = object.bestMCPs;
    const bestInstances = allInstances.filter((instance) => {
      return (
        bestMCPs
          .map((mcp) => mcp.namespace)
          .includes(instance.mcpServer.namespace) &&
        bestMCPs.map((mcp) => mcp.slug).includes(instance.mcpServer.slug)
      );
    });
    return bestInstances;
  } catch (error) {
    console.error("Error fetching or processing MCP servers:", error);
    return [];
  }
}
