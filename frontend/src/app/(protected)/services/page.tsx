"use client";

import { CreateServiceModal } from "@/components/service/CreateServiceModal";
import { ServiceCard } from "@/components/service/ServiceCard";
import { StatsCard } from "@/components/service/StatsCard";
import { Button } from "@/components/ui/button";
import { createService, fetchServices, updateServiceStatus } from "@/lib/api";
import { CreateServiceData } from "@/schemas/serviceSchema";
import { Service } from "@/types/Service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Plus, Settings, Users } from "lucide-react";
import { useState } from "react";
const mockServices: Service[] = [
  {
    id: "1",
    name: "Générateur de Résumés",
    description: "Service de résumé automatique de documents",
    category: "Traitement de texte",
    status: "active",
    agent: "Assistant Client",
    model: "gpt-4",
    lastUsed: "Il y a 30 minutes",
    usageCount: 156,
    isPublic: true,
  },
  {
    id: "2",
    name: "Analyseur de Sentiment",
    description: "Analyse des sentiments dans les commentaires clients",
    category: "Analyse",
    status: "active",
    agent: "Générateur de Contenu",
    model: "gpt-3.5-turbo",
    lastUsed: "Il y a 2 heures",
    usageCount: 89,
    isPublic: false,
  },
  {
    id: "3",
    name: "Correcteur Orthographique",
    description: "Correction automatique de textes",
    category: "Traitement de texte",
    status: "testing",
    agent: "Analyseur de Code",
    model: "claude-3",
    lastUsed: "Il y a 1 jour",
    usageCount: 23,
    isPublic: false,
  },
  {
    id: "4",
    name: "Traducteur Multilingue",
    description: "Service de traduction automatique",
    category: "Traduction",
    status: "inactive",
    agent: "Assistant Client",
    model: "gpt-4",
    lastUsed: "Il y a 3 jours",
    usageCount: 67,
    isPublic: true,
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: ServicesFromDb } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { mutate: newService } = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      setIsCreateModalOpen(false);
    },
  });

  const { mutateAsync: serviceStatusChange } = useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
  });

  const activeServices = services.filter((s) => s.status === "active").length;
  const testingServices = services.filter((s) => s.status === "testing").length;
  const inactiveServices = services.filter(
    (s) => s.status === "inactive"
  ).length;
  const publicServices = services.filter((s) => s.isPublic).length;

  const handleCreateService = (serviceData: CreateServiceData) => {
    newService(serviceData);
  };

  const handleStatusChange = (serviceId: string, status: Service["status"]) => {
    serviceStatusChange({ serviceId, status });
  };

  const handleEdit = (serviceId: string) => {
    console.log("Edit service:", serviceId);
  };

  const handleDelete = (serviceId: string) => {
    setServices(services.filter((service) => service.id !== serviceId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            </div>
            <p className="text-gray-600">
              Gérez vos services IA et leurs configurations
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un service
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Services"
            value={services.length}
            icon={Settings}
            color="text-gray-400"
          />
          <StatsCard
            title="Actifs"
            value={activeServices}
            icon={CheckCircle}
            color="text-green-500"
          />
          <StatsCard
            title="En test"
            value={testingServices}
            icon={Settings}
            color="text-yellow-500"
          />
          <StatsCard
            title="Publics"
            value={publicServices}
            icon={Users}
            color="text-blue-500"
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Create Service Modal */}
        <CreateServiceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateService}
        />
      </div>
    </div>
  );
}
