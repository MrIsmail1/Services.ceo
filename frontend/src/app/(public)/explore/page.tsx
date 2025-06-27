"use client";
import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/api";
import { Service } from "@/types/Service";
import { ServiceCard } from "@/components/service/ServiceCard";
import { useRouter } from "next/navigation";

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchServices()
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des services");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Catalogue des services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} onClick={() => router.push(`/explore/${service.id}`)} style={{ cursor: 'pointer' }}>
            <ServiceCard service={service} readOnly href={`/explore/${service.id}`} />
          </div>
        ))}
      </div>
      {services.length === 0 && (
        <div className="text-center text-gray-500 mt-8">Aucun service disponible pour le moment.</div>
      )}
    </div>
  );
} 