import { useMutation } from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {login} from "@/features/auth/api";

export const useAuth = () => {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: login,
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
    };
};