import { LoginInput, RegisterInput } from "@/schemas/authSchema";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface UserTypeOption {
  title: string;
  description: string;
  onClick: () => void;
}

export interface PreAuthPayload {
  email: string;
  role: string;
}

export interface PreAuth {
  exists: boolean;
  role: string;
  email: string;
}

export interface LoginFormProps {
  email: string;
  onBack: () => void;
  onSubmit: (data: LoginInput) => Promise<void>;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
}

export interface RegisterFormProps {
  email: string;
  onBack: () => void;
  onSubmit: (data: RegisterInput) => Promise<void>;
  isLoading?: boolean;
  role: string;
  isError?: boolean;
  error?: Error;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: User;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  user: User;
}

export interface AuthComponentProps {
  role?: string;
}
