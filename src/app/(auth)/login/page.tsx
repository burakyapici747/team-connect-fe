"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { loginSchema } from "@/features/auth/validations/auth";
import { authAPI } from "@/shared/api";
import { useAuthStore } from "@/shared/store";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const { fetchUserData } = useCurrentUser();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      // Login işlemi
      await authAPI.login(data.email, data.password);

      // User ve profile bilgilerini al ve store'a kaydet
      await fetchUserData();

      // Ana sayfaya yönlendir
      router.push("/channels/me");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 px-6 pt-8">
        <CardTitle className="text-2xl font-bold text-white text-center">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-[#B5BAC1] text-center">
          We&#39;re so excited to see you again!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#FA777C]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#FA777C]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-sm text-[#949BA4]">
          <span>Need an account? </span>
          <Link href="/register" className="text-[#00A8FC] hover:underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
