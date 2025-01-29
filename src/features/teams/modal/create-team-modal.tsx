"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { teamAPI } from "@/services/api/team";
import { useTeamStore } from "@/store/features/team-store";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must be less than 50 characters"),
});

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTeamModal = ({ isOpen, onClose }: CreateTeamModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { teams, setTeams } = useTeamStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (!selectedFile) {
        toast.error("Please select a team image");
        return;
      }

      const response = await teamAPI.createTeam(values, selectedFile);

      if (response.success) {
        setTeams([...teams, response.data]);
        toast.success("Team created successfully!");
        form.reset();
        setImagePreview(null);
        setSelectedFile(null);
        onClose();
      }
    } catch (error) {
      console.error("Failed to create team:", error);
      toast.error("Failed to create team. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#313338] border-none text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize Your Team
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Give your team a personality with a name and an icon. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative group">
                  <input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                  />
                  <label
                    htmlFor="imageUpload"
                    className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full bg-[#1E1F22] cursor-pointer overflow-hidden group-hover:opacity-90 transition border-2 border-dashed border-zinc-500 hover:border-indigo-500"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8 text-zinc-500 mb-2" />
                        <span className="text-xs text-zinc-500">
                          Upload Image
                        </span>
                      </>
                    )}
                  </label>
                </div>
                <span className="text-xs text-zinc-400">
                  Recommended: 128x128 or larger (max 5MB)
                </span>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                      Team Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="New Team"
                        className="bg-[#1E1F22] border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-[#2B2D31] px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <div
                  onClick={onClose}
                  className="hover:underline hover:bg-transparent text-zinc-400 cursor-pointer"
                >
                  Back
                </div>
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
