import { z } from "zod";

export const preauthSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
});

export type PreauthInput = z.infer<typeof preauthSchema>;

export const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email("Veuillez entrer une adresse e-mail valide"),
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    role: z.string(),
    acceptTerms: z.boolean().refine((val: boolean) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    }
  );

export type RegisterInput = z.infer<typeof registerSchema>;
