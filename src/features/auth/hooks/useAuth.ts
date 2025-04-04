import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, register } from "@/features/auth/api"; // register fonksiyonunu da import edin
import { LoginFormData, RegisterFormData } from "@/features/auth/types";

export const useAuth = () => {
    const router = useRouter();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            router.push("/channels/me");
        },
        onError: (error) => {
            console.error(error);
        }
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: (data: Omit<RegisterFormData, "confirmPassword">) => register(data),
        onSuccess: () => {
            router.push("/channels/me");
        },
        onError: (error) => {
            console.error(error);
        }
    });

    return {
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,

        // Register işlevlerini ekleyin
        register: registerMutation.mutate,
        isRegisterLoading: registerMutation.isPending,
        registerError: registerMutation.error
    };
};