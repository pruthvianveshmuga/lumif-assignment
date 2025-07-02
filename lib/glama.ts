import { GlamaResponse, Instance } from "./glama-types";
import glamaResponse from "./mocks/instances.json";
import { selectBestMcps } from "./tools/intelligent_mcp_selector";

export async function findBestMCPs(query: string): Promise<Instance[]> {
  try {
    // TODO: call "https://glama.ai/api/mcp/v1/instances" and get glamaResponse
    const allInstances = (glamaResponse as unknown as GlamaResponse).instances;
    const bestInstances = selectBestMcps(query, allInstances);
    return bestInstances;
  } catch (error) {
    console.error("Error fetching or processing MCP servers:", error);
    return [];
  }
}
