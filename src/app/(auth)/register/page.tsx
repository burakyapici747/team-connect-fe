"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { registerSchema } from "@/lib/validations/auth";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authAPI.register(registerData);
      setUser(response.data);
      router.push("/channels/me");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 px-6 pt-8">
        <CardTitle className="text-2xl font-bold text-white text-center">
          Create an Account
        </CardTitle>
        <CardDescription className="text-[#B5BAC1] text-center">
          Join Team Connect to start collaborating
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="cooluser123"
                      className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#FA777C]" />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                    Confirm Password
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
              {form.formState.isSubmitting ? "Creating account..." : "Register"}
            </Button>

            <div className="text-sm text-[#949BA4]">
              <span>Already have an account? </span>
              <Link href="/login" className="text-[#00A8FC] hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
