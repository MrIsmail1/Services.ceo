"use client";

import { Label } from "@/components/ui/label";
import { CreateServiceData } from "@/schemas/serviceSchema";
import { Agent } from "@/types/Service";
import { useFormContext } from "react-hook-form";
import { AgentSelectionCard } from "./AgentSelectionCard";

const availableAgents: Agent[] = [
  {
    id: "1",
    name: "Assistant Client",
    type: "Chatbot",
    model: "gpt-4",
    status: "active",
    description: "Agent IA pour répondre aux questions des clients",
  },
  {
    id: "2",
    name: "Générateur de Contenu",
    type: "Analyseur de texte",
    model: "gpt-3.5-turbo",
    status: "active",
    description: "Création automatique de contenu marketing",
  },
  {
    id: "3",
    name: "Analyseur de Code",
    type: "Assistant de code",
    model: "claude-3",
    status: "inactive",
    description: "Révision et optimisation de code",
  },
];

export function ServiceAgentForm() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateServiceData>();
  const selectedAgent = watch("agent");

  const selectAgent = (agent: Agent) => {
    setValue("agent", agent.name);
    setValue("model", agent.model);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">
          Sélectionnez un agent IA
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          Choisissez l'agent qui exécutera votre service
        </p>
      </div>

      <div className="grid gap-3">
        {availableAgents.map((agent) => (
          <AgentSelectionCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent === agent.name}
            onSelect={selectAgent}
          />
        ))}
      </div>

      {errors.agent && (
        <p className="text-sm text-red-600">{errors.agent.message}</p>
      )}
    </div>
  );
}
