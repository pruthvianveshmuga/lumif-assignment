import { GlamaResponse, Instance } from "./glama-types";
import glamaResponse from "./mocks/instances.json";

export async function findBestMCPs(query: string): Promise<Instance[]> {
  try {
    // TODO: call "https://glama.ai/api/mcp/v1/instances" and get glamaResponse
    // TODO: Call LLM. Input: user query, glamaResponse.json. Structured Output: array of `namespace/slug`
    const mock_LLM_Response = [
      {
        namespace: "TwT23333",
        slug: "mcp",
      },
    ];
    return mock_LLM_Response.map((mcp) => {
      return (glamaResponse as unknown as GlamaResponse).instances.find(
        (i) =>
          i.mcpServer.slug === mcp.slug &&
          i.mcpServer.namespace === mcp.namespace
      )!;
    });
  } catch (error) {
    console.error("Error fetching or processing MCP servers:", error);
    return [];
  }
}
