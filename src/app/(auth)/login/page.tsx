"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/forms/auth-form";
import { LoginFormData } from "@/features/auth/types";
import {login} from "@/features/auth/api";
import {ApiResponse} from "@/shared/api/response/response";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ApiResponse<[]> | null>(null);

  const onSubmit = async (loginFormData: LoginFormData) => {
    setIsLoading(true);
    try {
      router.push("/channels/me");
      const response = await login(loginFormData);
      setData(response);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back!"
      description="We're so excited to see you again!"
    >
      <AuthForm onSubmit={onSubmit} isRegister={false} isLoading={isLoading} />
    </AuthCard>
  );
}
