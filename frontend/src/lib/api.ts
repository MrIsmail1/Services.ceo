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
