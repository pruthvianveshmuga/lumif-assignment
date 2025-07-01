export interface GlamaResponse {
  pageInfo: PageInfo;
  servers: Server[];
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}

export interface Server {
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
  CACHE_TTL?: CacheTtl;
  LOG_LEVEL?: LogLevel;
  PEGA_SCOPE?: PegaScope;
  PEGA_BASE_URL?: PegaBaseUrl;
  PEGA_CLIENT_ID?: PegaClientId;
  REQUEST_TIMEOUT?: RequestTimeout;
  PEGA_API_VERSION?: PegaApiVersion;
  PEGA_CLIENT_SECRET?: PegaClientSecret;
  MY_IP?: MyIp;
  MY_TOKEN?: MyToken;
  GOOGLE_API_KEY?: GoogleApiKey;
  TAVILY_API_KEY?: TavilyApiKey;
  AZURE_OPENAI_API_KEY?: AzureOpenaiApiKey;
  AZURE_OPENAI_ENDPOINT?: AzureOpenaiEndpoint;
  AZURE_OPENAI_DEPLOYMENT_NAME?: AzureOpenaiDeploymentName;
  SEMANTIC_SCHOLAR_API_KEY?: SemanticScholarApiKey;
  HALOSCAN_API_KEY?: HaloscanApiKey;
  BUILDABLE_API_KEY?: BuildableApiKey;
  BUILDABLE_API_URL?: BuildableApiUrl;
  BUILDABLE_PROJECT_ID?: BuildableProjectId;
  BUILDABLE_AI_ASSISTANT_ID?: BuildableAiAssistantId;
}

export interface CacheTtl {
  description: string;
  type: string;
  default: string;
}

export interface LogLevel {
  description: string;
  type: string;
  default: string;
}

export interface PegaScope {
  description: string;
  type: string;
  default: string;
}

export interface PegaBaseUrl {
  description: string;
  type: string;
}

export interface PegaClientId {
  description: string;
  type: string;
}

export interface RequestTimeout {
  description: string;
  type: string;
  default: string;
}

export interface PegaApiVersion {
  description: string;
  type: string;
  default: string;
}

export interface PegaClientSecret {
  description: string;
  type: string;
}

export interface MyIp {
  description: string;
  type: string;
}

export interface MyToken {
  description: string;
  type: string;
}

export interface GoogleApiKey {
  description: string;
  type: string;
}

export interface TavilyApiKey {
  description: string;
  type: string;
}

export interface AzureOpenaiApiKey {
  description: string;
  type: string;
}

export interface AzureOpenaiEndpoint {
  description: string;
  type: string;
}

export interface AzureOpenaiDeploymentName {
  description: string;
  type: string;
}

export interface SemanticScholarApiKey {
  description: string;
  type: string;
}

export interface HaloscanApiKey {
  description: string;
  type: string;
}

export interface BuildableApiKey {
  description: string;
  type: string;
}

export interface BuildableApiUrl {
  description: string;
  type: string;
  default: string;
}

export interface BuildableProjectId {
  description: string;
  type: string;
}

export interface BuildableAiAssistantId {
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
  description?: string;
  name: string;
  inputSchema: InputSchema;
}

export interface InputSchema {
  properties?: Properties2;
  required?: string[];
  type: string;
  $schema?: string;
  additionalProperties?: boolean;
}

export interface Properties2 {
  approach?: Approach;
  estimated_duration?: EstimatedDuration;
  notes?: Notes;
  task_id?: TaskId;
  challenges?: Challenges;
  completed_steps?: CompletedSteps;
  current_step?: CurrentStep;
  files_modified?: FilesModified;
  progress?: Progress;
  status_update?: StatusUpdate;
  time_spent?: TimeSpent;
  completion_notes?: CompletionNotes;
  documentation_updated?: DocumentationUpdated;
  testing_completed?: TestingCompleted;
  content?: Content;
  tags?: Tags;
  title?: Title;
  urgency?: Urgency;
  full_data?: FullData;
  keyword?: Keyword;
  max_results?: MaxResults;
  period?: Period;
  summarize?: Summarize;
  location?: Location;
  topic?: Topic;
  geo?: Geo;
  input?: Input;
  root_domain_keys?: RootDomainKeys;
  competitors?: Competitors;
  inputs?: Inputs;
  keywords?: Keywords;
  date_from?: DateFrom;
  date_to?: DateTo;
  requested_data?: RequestedData;
  first_date?: FirstDate;
  second_date?: SecondDate;
  url?: Url;
  keywords_sources?: KeywordsSources;
  apiKey?: ApiKey;
}

export interface Approach {
  description: string;
  type: string;
}

export interface EstimatedDuration {
  description: string;
  type: string;
}

export interface Notes {
  description: string;
  type: string;
}

export interface TaskId {
  description: string;
  type: string;
}

export interface Challenges {
  description: string;
  items: Items;
  type: string;
}

export interface Items {
  type: string;
}

export interface CompletedSteps {
  description: string;
  items: Items2;
  type: string;
}

export interface Items2 {
  type: string;
}

export interface CurrentStep {
  description: string;
  type: string;
}

export interface FilesModified {
  description: string;
  items: Items3;
  type: string;
}

export interface Items3 {
  type: string;
}

export interface Progress {
  description: string;
  maximum: number;
  minimum: number;
  type: string;
}

export interface StatusUpdate {
  description: string;
  type: string;
}

export interface TimeSpent {
  description: string;
  type: string;
}

export interface CompletionNotes {
  description: string;
  type: string;
}

export interface DocumentationUpdated {
  description: string;
  type: string;
}

export interface TestingCompleted {
  description: string;
  type: string;
}

export interface Content {
  description: string;
  type: string;
}

export interface Tags {
  description: string;
  items: Items4;
  type: string;
}

export interface Items4 {
  type: string;
}

export interface Title {
  description: string;
  type: string;
}

export interface Urgency {
  description: string;
  enum: string[];
  type: string;
}

export interface FullData {
  default: boolean;
  description: string;
  title: string;
  type: string;
}

export interface Keyword {
  description: string;
  type: string;
  title?: string;
}

export interface MaxResults {
  default: number;
  description: string;
  minimum: number;
  title: string;
  type: string;
}

export interface Period {
  description: string;
  type: string;
  default?: number;
  minimum?: number;
  title?: string;
}

export interface Summarize {
  default: boolean;
  description: string;
  title: string;
  type: string;
}

export interface Location {
  description: string;
  title: string;
  type: string;
}

export interface Topic {
  description: string;
  title: string;
  type: string;
}

export interface Geo {
  default: string;
  description: string;
  title: string;
  type: string;
}

export interface Input {
  description: string;
  type: string;
  items?: Items5;
}

export interface Items5 {
  type: string;
}

export interface RootDomainKeys {
  description: string;
  items: Items6;
  type: string;
}

export interface Items6 {
  type: string;
}

export interface Competitors {
  description: string;
  items: Items7;
  type: string;
}

export interface Items7 {
  type: string;
}

export interface Inputs {
  description: string;
  items: Items8;
  type: string;
}

export interface Items8 {
  type: string;
}

export interface Keywords {
  description: string;
  items: Items9;
  type: string;
}

export interface Items9 {
  type: string;
}

export interface DateFrom {
  description: string;
  type: string;
}

export interface DateTo {
  description: string;
  type: string;
}

export interface RequestedData {
  description: string;
  items: Items10;
  type: string;
}

export interface Items10 {
  type: string;
}

export interface FirstDate {
  description: string;
  type: string;
}

export interface SecondDate {
  description: string;
  type: string;
}

export interface Url {
  description: string;
  type: string;
}

export interface KeywordsSources {
  description: string;
  items: Items11;
  type: string;
}

export interface Items11 {
  type: string;
}

export interface ApiKey {
  description: string;
  type: string;
}
