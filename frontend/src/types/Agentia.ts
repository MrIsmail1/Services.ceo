export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "ONLINE" | "OFFLINE";
  model: string;
  apiUrl: string;
  apiKey: string;
  userId: string;
}

export interface CreateAgentPayload {
  name: string;
  description: string;
  type: string;
  model: string;
  apiUrl: string;
  apiKey: string;
  userId: string;
}

export interface AgentTestResponse {
  success: boolean;
}
