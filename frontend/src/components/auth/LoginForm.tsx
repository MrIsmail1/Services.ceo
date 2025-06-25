import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginInput, loginSchema } from "@/schemas/authSchema";
import { LoginFormProps } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

export function LoginForm({
  email,
  onBack,
  onSubmit,
  isLoading = false,
  isError = false,
  error,
}: LoginFormProps) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email, password: "" },
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-0 h-auto text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Changer d'email
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {error?.message ||
                  "Une erreur s'est produite lors de la connexion."}
              </AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Mot de passe"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
