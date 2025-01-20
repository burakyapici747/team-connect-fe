import { UserPrivateOutput } from "../user";

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  status: string;
  message: string | null;
  data: UserPrivateOutput;
}
