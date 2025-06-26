import { nestAPI } from "@/config/apiClient";
import {
  LoginPayload,
  LoginResponse,
  PreAuth,
  PreAuthPayload,
  RegisterPayload,
  RegisterResponse,
  User,
} from "@/types/Auth";

// ——— USER —————————————————————————————
export const getUser = async (): Promise<User> => {
  return await nestAPI.get<User, User>("/user/profile");
};

// ——— AUTHENTICATION ————————————————————————
export const preAuth = async ({
  email,
  role,
}: PreAuthPayload): Promise<PreAuth> => {
  return await nestAPI.post<PreAuthPayload, PreAuth>("/auth/pre-auth", {
    email,
    role,
  });
};

export const signIn = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  return await nestAPI.post<LoginPayload, LoginResponse>("/auth/login", {
    email,
    password,
  });
};

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: RegisterPayload): Promise<RegisterResponse> => {
  return await nestAPI.post<RegisterPayload, RegisterResponse>("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    role,
  });
};

// ——— AGENTIA ———————————————————————————————
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

export interface CreateAgentPayload extends Omit<Agent, "id" | "status"> {}

export const getAgents = async (): Promise<Agent[]> => {
  return await nestAPI.get<unknown, Agent[]>("/agentia");
};

export const createAgent = async (
  payload: CreateAgentPayload
): Promise<Agent> => {
  return await nestAPI.post<CreateAgentPayload, Agent>('/agentia/create', payload);
};

export const testAgentConnection = async ({
  apiKey,
  apiUrl,
  model,
}: {
  apiKey?: string;
  apiUrl: string;
  model: string;
}): Promise<{ success: boolean; message?: string }> => {
  return await nestAPI.post<
    { apiKey?: string; apiUrl: string; model: string },
    { success: boolean; message?: string }
  >("/agentia/test-connection", { apiKey, apiUrl, model });
};
