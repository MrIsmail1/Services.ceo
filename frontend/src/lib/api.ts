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
import { Service } from "@/types/Service";

// ——— USER —————————————————————————————
export const getUser = async (): Promise<User> =>
  await nestAPI.get<User, User>("/user/profile");

// ——— AUTHENTICATION ————————————————————————
export const preAuth = async ({
  email,
  role,
}: PreAuthPayload): Promise<PreAuth> =>
  await nestAPI.post<PreAuthPayload, PreAuth>("/auth/pre-auth", {
    email,
    role,
  });

export const signIn = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> =>
  await nestAPI.post<LoginPayload, LoginResponse>("/auth/login", {
    email,
    password,
  });

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: RegisterPayload): Promise<RegisterResponse> =>
  await nestAPI.post<RegisterPayload, RegisterResponse>("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    role,
  });

// ——— SERVICES ————————————————————————

export const fetchServices = async (): Promise<Service[]> =>
  await nestAPI.get<Service[], Service[]>("/services");

export const createService = async (serviceData: Service): Promise<Service> =>
  await nestAPI.post<Service, Service>("/services", serviceData);

export const updateServiceStatus = async (
  serviceId: string,
  status: Service["status"]
): Promise<Service> =>
  await nestAPI.patch<Service, Service>(`/services/${serviceId}/status`, {
    status,
  });
