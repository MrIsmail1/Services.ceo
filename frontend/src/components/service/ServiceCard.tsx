"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Service } from "@/types/Service";
import {
  CheckCircle,
  Edit,
  Pause,
  Play,
  Settings,
  Trash2,
  XCircle,
} from "lucide-react";

interface ServiceCardProps {
  service: Service;
  onStatusChange?: (serviceId: string, status: Service["status"]) => void;
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
}

export function ServiceCard({
  service,
  onStatusChange,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "testing":
        return "text-yellow-600 bg-yellow-50";
      case "inactive":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "testing":
        return <Settings className="w-3 h-3" />;
      case "inactive":
        return <XCircle className="w-3 h-3" />;
      default:
        return <XCircle className="w-3 h-3" />;
    }
  };

  const handleStatusToggle = () => {
    if (onStatusChange) {
      const newStatus = service.status === "active" ? "inactive" : "active";
      onStatusChange(service.id, newStatus);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.category}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(service.status)} border-0`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(service.status)}
              {service.status}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{service.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Agent:</span>
            <span className="font-medium">{service.agent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Modèle:</span>
            <span className="font-medium">{service.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Dernière utilisation:</span>
            <span className="font-medium">{service.lastUsed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Utilisations:</span>
            <span className="font-medium">{service.usageCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Visibilité:</span>
            <span className="font-medium">
              {service.isPublic ? "Public" : "Privé"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleStatusToggle}
          >
            {service.status === "active" ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Activer
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(service.id)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete?.(service.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
