import { generateObject } from "ai";
import { GlamaResponse, Instance } from "../glama-types";
import { z } from "zod";
import glamaResponse from "../mocks/instances.json";
import { openai } from "@ai-sdk/openai";

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

export async function selectBestMcps(
  query: string,
  instances: Instance[],
  limit: number = 1
): Promise<Instance[]> {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      bestMCP: z.object({
        namespace: z.string(),
        slug: z.string(),
      }),
    }),
    prompt: `Return one best MCP servers for the query: ${query}
    from the following list of MCP servers:
    ${JSON.stringify(mcpSummary)}
    `,
  });
  const bestMCP = object.bestMCP;
  return instances.filter((instance) => {
    return (
      instance.mcpServer.namespace === bestMCP.namespace &&
      instance.mcpServer.slug === bestMCP.slug
    );
  });
}
