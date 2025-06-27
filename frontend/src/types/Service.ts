export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  status?: "active" | "inactive" | "testing";
  agent?: string;
  model?: string;
  lastUsed?: string;
  usageCount?: number;
  isPublic?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  model: string;
  status: "active" | "inactive";
  description: string;
}

export interface ServiceInput {
  name: string;
  type: "text" | "number" | "boolean" | "file";
  description?: string;
  required: boolean;
}

export interface ServiceOutput {
  name: string;
  type: "text" | "json" | "file";
  description?: string;
}

export interface CreateServicePayload {
  title: string;
  description?: string;
  category?: string;
  price: number;
  authorId?: string;
  agent?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  inputs?: ServiceInput[];
  outputs?: ServiceOutput[];
  uiConfig?: Record<string, any>;
  validationRules?: Record<string, any>;
}