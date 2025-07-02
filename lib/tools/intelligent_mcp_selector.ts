import { Instance } from "../glama-types";

// TODO: Replace with a more sophisticated LLM-based embedding algorithm
export function selectBestMcps(
  query: string,
  instances: Instance[],
  limit: number = 1
): Instance[] {
  return instances.filter((instance) => {
    return instance.mcpServer.name === "Moatless MCP Server";
  });
}
