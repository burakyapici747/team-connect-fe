import { z } from "zod";
import React from "react";
import { loginSchema, registerSchema } from "../validations/auth";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export interface BaseAuthFormProps {
  isLoading?: boolean;
}

export interface LoginAuthFormProps extends BaseAuthFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isRegister?: false;
}

export interface RegisterAuthFormProps extends BaseAuthFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isRegister: true;
}

export type AuthFormProps = LoginAuthFormProps | RegisterAuthFormProps;

export type LoginInput = {
  email: string,
  password: string,
}