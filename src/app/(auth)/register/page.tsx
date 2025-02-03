"use client";

import { useRouter } from "next/navigation";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/forms/auth-form";
import { RegisterFormData } from "@/features/auth/types";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state: any) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      setUser(response.data);
      router.push("/channels/me");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create an Account"
      description="Join Team Connect to start collaborating"
    >
      <AuthForm onSubmit={onSubmit} isRegister={true} isLoading={isLoading} />
    </AuthCard>
  );
}
