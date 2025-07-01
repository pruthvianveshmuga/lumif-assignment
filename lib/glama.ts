import { GlamaResponse, Server } from "./glama-types";

export async function findBestMCPServer(query: string): Promise<Server | null> {
  try {
    const response = await fetch("https://glama.ai/api/mcp/v1/servers");
    if (!response.ok) {
      throw new Error("Failed to fetch MCP servers");
    }
    const glamaResponse: GlamaResponse = await response.json();
    const servers = glamaResponse.servers;

    // TODO: Implement actual ranking logic instead of picking a hardcoded one
    const bestServer = servers[3];

    return bestServer || null;
  } catch (error) {
    console.error("Error fetching or processing MCP servers:", error);
    return null;
  }
}
