"use client";

import Auth from "@/components/auth/Auth";
import { Button } from "@/components/ui/button";
import type { UserTypeOption } from "@/types/Auth";
import { ArrowLeft, ChevronRight, Globe, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [clientSelected, setClientSelected] = useState<boolean>(false);
  const [professionalSelected, setProfessionalSelected] =
    useState<boolean>(false);
  const onClientSelect = () => {
    setClientSelected(true);
    setProfessionalSelected(false);
  };
  const onProfessionalSelect = () => {
    setProfessionalSelected(true);
    setClientSelected(false);
  };
  const userTypeOptions: UserTypeOption[] = [
    {
      title: "Services.ceo pour les clients",
      description:
        "Découvrez et profitez des services de qualité pour vos besoins",
      onClick: onClientSelect,
    },
    {
      title: "Services.ceo pour les professionnels",
      description:
        "Rejoignez notre réseau de professionnels pour offrir vos services",
      onClick: onProfessionalSelect,
    },
  ];
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <Button
          variant="ghost"
          size="icon"
          className="mb-6 sm:mb-8 hover:bg-gray-100"
          onClick={() => {
            if (clientSelected || professionalSelected) {
              setClientSelected(false);
              setProfessionalSelected(false);
            } else {
              router.back();
            }
          }}
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </Button>
      </div>

      <div className="flex flex-col h-full items-center justify-center">
        {!clientSelected && !professionalSelected && (
          <div className="flex-1 px-4 sm:px-6 max-w-lg mx-auto w-full">
            {/* Title */}
            <div className="mb-8 sm:mb-12 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                S'inscrire/se connecter
              </h1>
            </div>

            {/* User Type Options */}
            <div className="space-y-4 mb-8">
              {userTypeOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.onClick}
                  className="w-full p-6 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors ml-4 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {clientSelected && <Auth role="CLIENT" />}
        {professionalSelected && <Auth role="PRO" />}

        {/* Footer */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm border-t border-gray-200 mt-auto">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Globe className="h-4 w-4" />
            Français
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <HelpCircle className="h-4 w-4" />
            Aide et assistance
          </button>
        </div>
      </div>
    </div>
  );
}
