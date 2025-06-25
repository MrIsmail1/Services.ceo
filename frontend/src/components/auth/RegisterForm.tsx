import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterInput, registerSchema } from "@/schemas/authSchema";
import { RegisterFormProps } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

export function RegisterForm({
  email,
  onBack,
  onSubmit,
  isLoading = false,
  role,
  isError = false,
  error,
}: RegisterFormProps) {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email,
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: role || "CLIENT", // Default to CLIENT if not provided
      acceptTerms: false,
    },
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {error?.message ||
                  "Une erreur s'est produite lors de la connexion."}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Prénom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirmer le mot de passe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    J'accepte les{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Conditions générales
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isLoading ? "Création..." : "Créer un compte"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
