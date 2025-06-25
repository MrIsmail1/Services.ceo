"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { preAuth, signIn, signUp } from "@/lib/api";
import { PreauthInput, preauthSchema } from "@/schemas/authSchema";
import { AuthComponentProps } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Auth({ role }: AuthComponentProps) {
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreauthInput>({
    resolver: zodResolver(preauthSchema),
  });

  const {
    mutate: preAuthMutate,
    isPending,
    isError: isPreAuthError,
    error: preAuthError,
  } = useMutation({
    mutationFn: preAuth,
    onSuccess: (data) => {
      setUserExists(data.exists);
      setEmailSubmitted(true);
      setSubmittedEmail(data.email);
    },
  });

  const {
    mutate: handleLogin,
    isPending: isLoggingIn,
    isError: isLoginError,
    error: loginError,
  } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      if (data.user) {
        router.replace("/");
      }
    },
  });

  const {
    mutate: handleRegister,
    isPending: isRegistering,
    isError: isRegisterError,
    error: registerError,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data.user && role == "PRO") {
        router.replace("/dashboard");
      } else if (data.user && role == "CLIENT") {
        router.replace("/");
      }
    },
  });

  const onSubmit = (data: PreauthInput) => {
    preAuthMutate({ ...data, role });
  };
  const handleBackToEmail = () => {
    setUserExists(null);
    setEmailSubmitted(false);
    setSubmittedEmail("");
  };

  return (
    <div className="flex-1 px-4 sm:px-6 max-w-lg mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-4xl font-semibold text-gray-900 mb-3">
          {role == "CLIENT"
            ? "Services pour les clients"
            : "Services pour les professionnels"}
        </h1>
        {!emailSubmitted ? (
          <p className="text-gray-600 text-xs sm:text-lg leading-relaxed">
            {role == "CLIENT"
              ? "Connectez-vous ou créez un compte pour accéder à nos services."
              : "Connectez-vous ou créez un compte pour proposer vos services."}
          </p>
        ) : userExists ? (
          <p className="text-gray-600 text-xs sm:text-lg leading-relaxed">
            Saisissez votre mot de passe et connectez-vous avec l'adresse
            <span className="font-semibold">{" " + submittedEmail}</span>
          </p>
        ) : (
          <p className="text-gray-600 text-xs sm:text-lg leading-relaxed">
            C'est presque fini ! Créez votre nouveau compte pour l'adresse
            <span className="font-semibold">{" " + submittedEmail}</span> en
            remplissant les renseignements demandés
          </p>
        )}
      </div>

      {!emailSubmitted && (
        <>
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 text-gray-700 border-gray-300"
            >
              <FaFacebook className="w-12 h-12 text-blue-600" />
              <span className="text-xs sm:text-base font-bold">
                Continuer avec Facebook
              </span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 text-gray-700 border-gray-300"
            >
              <FcGoogle className="w-12 h-12" />
              <span className="text-xs sm:text-base font-bold">
                Continuer avec Google
              </span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OU</span>
            </div>
          </div>
        </>
      )}

      {/* Email Input + Form */}
      {!emailSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-2">
          {isPreAuthError && preAuthError.message == "USER_TYPE_MISMATCH" && (
            <p className="text-sm text-red-600 mb-2">
              {role === "CLIENT"
                ? "Un compte professionnel existe déjà avec cette adresse e-mail. Veuillez utiliser une adresse e-mail différente ou vous connecter avec votre compte professionnel."
                : "Un compte client existe déjà avec cette adresse e-mail. Veuillez utiliser une adresse e-mail différente ou vous connecter avec votre compte client."}
            </p>
          )}
          <Input
            type="email"
            placeholder="Adresse e-mail"
            className="h-12 border-gray-300 text-gray-900 placeholder:text-gray-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isPending ? "Chargement..." : "Continuer"}
          </Button>
        </form>
      ) : userExists && !isPreAuthError ? (
        <LoginForm
          email={submittedEmail}
          onBack={handleBackToEmail}
          onSubmit={async (data) => {
            handleLogin(data);
          }}
          isLoading={isLoggingIn}
          isError={isLoginError}
          error={loginError as Error}
        />
      ) : (
        <RegisterForm
          email={submittedEmail}
          onBack={handleBackToEmail}
          onSubmit={async (data) => {
            handleRegister(data);
          }}
          isLoading={isRegistering}
          role={role}
          isError={isRegisterError}
          error={registerError as Error}
        />
      )}

      {/* Different Account Link */}
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-sm text-gray-700 mb-1">
          {role === "CLIENT"
            ? "Vous êtes un professionnel ?"
            : "Vous êtes un client ?"}
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          {role === "CLIENT"
            ? "Se connecter en tant que professionnel"
            : "Se connecter en tant que client"}
        </button>
      </div>
    </div>
  );
}
