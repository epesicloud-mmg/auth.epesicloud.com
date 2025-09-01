import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Client } from "@shared/schema";

const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  scope: z.enum(["initiate_transaction", "execute_transaction"]),
  isActive: z.boolean().default(true),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  client?: Client | null;
  onSuccess: (newClient?: Client) => void;
}

export default function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      scope: (client?.scope as "initiate_transaction" | "execute_transaction") || "initiate_transaction",
      isActive: client?.isActive ?? true,
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const response = await apiRequest("POST", "/api/admin/clients", data);
      return response.json();
    },
    onSuccess: (newClient: Client) => {
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      onSuccess(newClient);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const response = await apiRequest("PATCH", `/api/admin/clients/${client!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      if (client) {
        await updateClientMutation.mutateAsync(data);
      } else {
        await createClientMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Client Name</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Enter client name"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope">Scope</Label>
        <Select
          value={form.watch("scope")}
          onValueChange={(value) => form.setValue("scope", value as "initiate_transaction" | "execute_transaction")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="initiate_transaction">initiate_transaction</SelectItem>
            <SelectItem value="execute_transaction">execute_transaction</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.scope && (
          <p className="text-sm text-red-600">{form.formState.errors.scope.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={form.watch("isActive")}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : client ? "Update Client" : "Create Client"}
        </Button>
      </div>
    </form>
  );
}
