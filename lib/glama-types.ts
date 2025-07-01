export interface GlamaResponse {
  instances: Instance[];
}

export interface Instance {
  endpoints: Endpoints;
  id: string;
  mcpServer: McpServer;
}

export interface Endpoints {
  sse: string;
}

export interface McpServer {
  attributes: string[];
  description: string;
  environmentVariablesJsonSchema: EnvironmentVariablesJsonSchema;
  id: string;
  name: string;
  namespace: string;
  repository: Repository;
  slug: string;
  spdxLicense?: SpdxLicense;
  tools: Tool[];
  url: string;
}

export interface EnvironmentVariablesJsonSchema {
  properties: Properties;
  type: string;
  required: string[];
}

export interface Properties {
  SERP_API_KEY?: SerpApiKey;
}

export interface SerpApiKey {
  description: string;
  type: string;
}

export interface Repository {
  url: string;
}

export interface SpdxLicense {
  name: string;
  url: string;
}

export interface Tool {
  description: string;
  name: string;
  inputSchema: InputSchema;
}

export interface InputSchema {
  properties: Properties2;
  required?: string[];
  type: string;
}

export interface Properties2 {
  end_line?: EndLine;
  file_path?: FilePath;
  start_line?: StartLine;
  content?: Content;
  directory?: Directory;
  max_results?: MaxResults;
  recursive?: Recursive;
  new_str?: NewStr;
  occurrence?: Occurrence;
  old_str?: OldStr;
  file_pattern?: FilePattern;
  pattern?: Pattern;
  class_name?: ClassName;
  function_name?: FunctionName;
  span_ids?: SpanIds;
  api_key?: ApiKey;
  filter_type?: FilterType;
  query?: Query;
  args?: Args;
  detect_only?: DetectOnly;
  framework?: Framework;
  test_path?: TestPath;
  file_patterns?: FilePatterns;
  force_rebuild?: ForceRebuild;
  model?: Model;
  confirm?: Confirm;
  gl?: Gl;
  hl?: Hl;
  publication_token?: PublicationToken;
  q?: Q;
  section_token?: SectionToken;
  story_token?: StoryToken;
  topic_token?: TopicToken;
}

export interface EndLine {
  description: string;
  type: string;
  minimum?: number;
}

export interface FilePath {
  description: string;
  type: string;
}

export interface StartLine {
  description: string;
  type: string;
  minimum?: number;
}

export interface Content {
  description: string;
  type: string;
}

export interface Directory {
  default: string;
  description: string;
  type: string;
}

export interface MaxResults {
  default: number;
  description: string;
  type: string;
  maximum?: number;
  minimum?: number;
}

export interface Recursive {
  default: boolean;
  description: string;
  type: string;
}

export interface NewStr {
  description: string;
  type: string;
}

export interface Occurrence {
  default: number;
  description: string;
  minimum: number;
  type: string;
}

export interface OldStr {
  description: string;
  type: string;
}

export interface FilePattern {
  description: string;
  type: string;
  default?: string;
}

export interface Pattern {
  description: string;
  type: string;
}

export interface ClassName {
  description: string;
  type: string;
}

export interface FunctionName {
  description: string;
  type: string;
}

export interface SpanIds {
  description: string;
  items: Items;
  type: string;
}

export interface Items {
  type: string;
}

export interface ApiKey {
  description: string;
  type: string;
}

export interface FilterType {
  description: string;
  enum: string[];
  type: string;
}

export interface Query {
  description: string;
  type: string;
}

export interface Args {
  description: string;
  items: Items2;
  type: string;
}

export interface Items2 {
  type: string;
}

export interface DetectOnly {
  default: boolean;
  description: string;
  type: string;
}

export interface Framework {
  description: string;
  type: string;
}

export interface TestPath {
  description: string;
  type: string;
}

export interface FilePatterns {
  description: string;
  items: Items3;
  type: string;
}

export interface Items3 {
  type: string;
}

export interface ForceRebuild {
  default: boolean;
  description: string;
  type: string;
}

export interface Model {
  default: string;
  description: string;
  type: string;
}

export interface Confirm {
  default: boolean;
  description: string;
  type: string;
}

export interface Gl {
  default: string;
  description: string;
  type: string;
}

export interface Hl {
  default: string;
  description: string;
  type: string;
}

export interface PublicationToken {
  description: string;
  type: string;
}

export interface Q {
  description: string;
  type: string;
}

export interface SectionToken {
  description: string;
  type: string;
}

export interface StoryToken {
  description: string;
  type: string;
}

export interface TopicToken {
  description: string;
  type: string;
}
