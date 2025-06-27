"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModernChatInterface } from "@/components/chat/ModernChatInterface";
import useAuth from "@/hooks/useAuth";

interface ServiceData {
  id: string;
  name: string;
  description?: string;
}

export default function ServiceChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const serviceId = params?.serviceId as string;
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "PRO") {
      router.push('/auth');
      return;
    }

    fetch(`http://localhost:4500/services/${serviceId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setServiceData({
          id: data.id,
          name: data.name,
          description: data.description
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du service:", err);
        setError("Erreur lors du chargement du service");
        setLoading(false);
      });
  }, [serviceId, user, authLoading, router]);

  const handleBack = () => {
    router.push('/services');
  };

  if (authLoading || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "PRO") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Accès réservé aux prestataires PRO</p>
          <button
            onClick={() => router.push('/auth')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Service introuvable"}</p>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Retour aux services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ModernChatInterface
        serviceId={serviceData.id}
        serviceName={serviceData.name}
        serviceDescription={serviceData.description}
        onBack={handleBack}
      />
    </div>
  );
} 