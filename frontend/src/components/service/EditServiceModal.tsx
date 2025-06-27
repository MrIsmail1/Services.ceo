"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateServiceData, createServiceSchema } from "@/schemas/serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ServiceAgentForm } from "./ServiceAgentForm";
import { ServiceBasicInfoForm } from "./ServiceBasicInfoForm";
import { ServiceConfigForm } from "./ServiceConfigForm";
import { ServiceTestForm } from "./ServiceTestForm";
import useAuth from "@/hooks/useAuth";
import { Service } from "@/types/Service";
import { getServiceById } from "@/lib/api";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceId: string, data: CreateServiceData) => void;
  serviceId: string | null;
}

const steps = [
  { title: "Informations de base", component: ServiceBasicInfoForm },
  { title: "Sélection de l'agent", component: ServiceAgentForm },
  { title: "Configuration", component: ServiceConfigForm },
  { title: "Test et validation", component: ServiceTestForm },
];

export function EditServiceModal({ isOpen, onClose, onSubmit, serviceId }: EditServiceModalProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateServiceData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      authorId: user?.id || "",
      price: 0,
      isPublic: false,
      agent: "",
      model: "",
      inputs: [{ name: "", type: "text", description: "", required: false }],
      outputs: [{ name: "", type: "text", description: "" }],
      prompt: "",
      testData: "",
    },
  });

  const { handleSubmit, trigger, reset } = form;
  const totalSteps = steps.length;

  // Charger les données du service à modifier
  useEffect(() => {
    if (isOpen && serviceId) {
      setIsLoading(true);
      getServiceById(serviceId)
        .then((service) => {
          // Mapper les données du service vers le format du formulaire
          reset({
            name: service.name,
            description: service.description,
            category: service.category,
            authorId: user?.id || "",
            price: 0, // À adapter selon le modèle de données
            isPublic: service.isPublic || false,
            agent: service.agent || "",
            model: service.model || "",
            inputs: [{ name: "", type: "text", description: "", required: false }], // À adapter
            outputs: [{ name: "", type: "text", description: "" }], // À adapter
            prompt: "", // À adapter
            testData: "",
          });
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du service:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, serviceId, reset, user?.id]);

  const handleNext = async () => {
    const isStepValid = await trigger(getFieldsForStep(currentStep));
    if (isStepValid && currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (data: CreateServiceData) => {
    if (serviceId) {
      onSubmit(serviceId, { ...data, authorId: user?.id || "" });
    }
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    reset();
    onClose();
  };

  const getFieldsForStep = (step: number): (keyof CreateServiceData)[] => {
    switch (step) {
      case 0:
        return ["name", "description", "category", "authorId", "price", "isPublic"];
      case 1:
        return ["agent", "model"];
      case 2:
        return ["inputs", "outputs", "prompt"];
      case 3:
        return ["testData"];
      default:
        return [];
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le service</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Chargement des données du service...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le service</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-6">
            {steps.map((_, i) => (
                <div key={i} className="flex items-center">
                  <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          i <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${i < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
            ))}
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="min-h-[400px]">
                <CurrentStepComponent />
              </div>

              <div className="flex justify-between pt-4 border-t mt-6">
                <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>

                {currentStep === totalSteps - 1 ? (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Check className="w-4 h-4 mr-2" />
                      Mettre à jour le service
                    </Button>
                ) : (
                    <Button type="button" onClick={handleNext}>
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
} 