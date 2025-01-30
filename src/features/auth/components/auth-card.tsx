import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AuthCardProps } from "../types";

export const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 px-6 pt-8">
        <CardTitle className="text-2xl font-bold text-white text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-[#B5BAC1] text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
};
