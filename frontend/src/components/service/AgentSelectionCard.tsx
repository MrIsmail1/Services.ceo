"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Agent } from "@/types/Service";
import { Bot, Check } from "lucide-react";

interface AgentSelectionCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agent: Agent) => void;
}

export function AgentSelectionCard({
  agent,
  isSelected,
  onSelect,
}: AgentSelectionCardProps) {
  const handleClick = () => {
    if (agent.status === "active") {
      onSelect(agent);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${agent.status === "inactive" ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={agent.status === "active" ? "default" : "secondary"}
            >
              {agent.status}
            </Badge>
            {isSelected && <Check className="w-5 h-5 text-blue-600" />}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{agent.description}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Modèle: {agent.model}</span>
        </div>
      </CardContent>
    </Card>
  );
}
