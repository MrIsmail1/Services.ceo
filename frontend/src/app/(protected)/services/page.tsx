"use client";

import { CreateServiceModal } from "@/components/service/CreateServiceModal";
import { EditServiceModal } from "@/components/service/EditServiceModal";
import { ServiceCard } from "@/components/service/ServiceCard";
import { StatsCard } from "@/components/service/StatsCard";
import { Button } from "@/components/ui/button";
import { createService, fetchServices, updateServiceStatus, updateService } from "@/lib/api";
import { CreateServiceData } from "@/schemas/serviceSchema";
import { Service, CreateServicePayload } from "@/types/Service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Plus, Settings, Users, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function ProtectedServicesPage() {
  const { user, isLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: ServicesFromDb } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  useEffect(() => {
    if (ServicesFromDb) {
      const mapped = ServicesFromDb.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description || "",
        category: s.category || "",
        status: s.status || "inactive",
        agent: s.agent || "",
        model: s.model || "",
        lastUsed: s.lastUsed || "",
        usageCount: s.usageCount || 0,
        isPublic: s.isPublic || false,
      }));
      setServices(mapped);
    }
  }, [ServicesFromDb]);

  const { mutate: newService } = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const { mutate: editService } = useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: CreateServiceData }) => 
      updateService(serviceId, data),
    onSuccess: () => {
      setIsEditModalOpen(false);
      setEditingServiceId(null);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const { mutateAsync: serviceStatusChange } = useMutation({
    mutationFn: ({ serviceId, status }: { serviceId: string; status: Service["status"] }) => 
      updateServiceStatus(serviceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const { mutate: fixConfigs } = useMutation({
    mutationFn: async () => {
      const response = await fetch('http://localhost:4500/services/fix-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Configurations corrigées:', data);
      alert(`Configurations corrigées ! ${data.servicesWithoutConfig} services sans config, ${data.servicesWithConfig} avec config.`);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => {
      console.error('Erreur lors de la correction des configurations:', error);
      alert('Erreur lors de la correction des configurations');
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!user || user.role !== "PRO") {
    return <div className="text-center py-8 text-red-600 font-bold">Accès réservé aux prestataires PRO.</div>;
  }

  const activeServices = services.filter((s) => s.status === "active").length;
  const testingServices = services.filter((s) => s.status === "testing").length;
  const inactiveServices = services.filter((s) => s.status === "inactive").length;
  const publicServices = services.filter((s) => s.isPublic).length;

  const handleCreateService = (serviceData: CreateServiceData) => {
    const payload: CreateServicePayload = {
      title: serviceData.name,
      description: serviceData.description,
      category: serviceData.category,
      authorId: serviceData.authorId,
      price: serviceData.price,
      agent: serviceData.agent,
      model: serviceData.model,
      systemPrompt: serviceData.systemPrompt,
      userPrompt: serviceData.userPrompt,
      inputs: serviceData.inputs,
      outputs: serviceData.outputs,
      uiConfig: serviceData.uiConfig,
      validationRules: serviceData.validationRules,
    };
    newService(payload);
  };

  const handleEditService = (serviceId: string, serviceData: CreateServiceData) => {
    editService({ serviceId, data: serviceData });
  };

  const handleStatusChange = (serviceId: string, status: Service["status"]) => {
    serviceStatusChange({ serviceId, status });
  };

  const handleEdit = (serviceId: string) => {
    setEditingServiceId(serviceId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    setServices(services.filter((service) => service.id !== serviceId));
  };

  const handleFixConfigs = () => {
    if (confirm('Voulez-vous corriger les configurations des services existants ?')) {
      fixConfigs();
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
              </div>
              <p className="text-gray-600">Gérez vos services IA et leurs configurations</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFixConfigs} variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                <Wrench className="w-4 h-4 mr-2" />
                Corriger Configs
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Créer un service
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Services" value={services.length} icon={Settings} color="text-gray-400" />
            <StatsCard title="Actifs" value={activeServices} icon={CheckCircle} color="text-green-500" />
            <StatsCard title="En test" value={testingServices} icon={Settings} color="text-yellow-500" />
            <StatsCard title="Publics" value={publicServices} icon={Users} color="text-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showChatButton={true}
                />
            ))}
          </div>

          <CreateServiceModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateService}
          />

          <EditServiceModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingServiceId(null);
              }}
              onSubmit={handleEditService}
              serviceId={editingServiceId}
          />
        </div>
      </div>
  );
}
