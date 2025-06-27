"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAgents,
  createAgent,
  testAgentConnection,
} from "@/lib/api";
import { type Agent, type CreateAgentPayload } from "@/types/Agentia";

import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Plus,
  Bot,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProtectedAgentiaPage() {
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  const [newAgent, setNewAgent] = useState<CreateAgentPayload>({
    name: "",
    description: "",
    type: "",
    model: "",
    apiKey: "",
    apiUrl: "",
    userId: "",
  });

  useEffect(() => {
    if (user?.id) {
      setNewAgent((prev) => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  const createAgentMutation = useMutation({
    mutationFn: async () => {
      return await createAgent({ ...newAgent });
    },
    onSuccess: (data) => {
      toast.success("Agent créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setIsModalOpen(false);
      setConnectionStatus("idle");
      setNewAgent({
        name: "",
        description: "",
        type: "",
        model: "",
        apiKey: "",
        apiUrl: "",
        userId: user?.id || "",
      });
    },
    onError: (error) => {
      console.error("❌ Erreur lors de la création :", error);
      toast.error("Erreur lors de la création");
    },
  });

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    try {
      const result = await testAgentConnection({
        apiKey: newAgent.apiKey,
        apiUrl: newAgent.apiUrl,
        model: newAgent.model,
      });

      setConnectionStatus(result.success ? "success" : "error");
      toast[result.success ? "success" : "error"](
        result.message || (result.success ? "Connexion réussie" : "Connexion échouée")
      );
    } catch (err) {
      console.error("❌ Erreur test connexion :", err);
      setConnectionStatus("error");
      toast.error("Erreur de connexion");
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (!user || user.role !== "PRO") {
    return <div className="text-center py-8 text-red-600 font-bold">Accès réservé aux prestataires PRO.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot /> Agentia
        </h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel agent IA</DialogTitle>
              <DialogDescription>
                Complétez les champs ci-dessous
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Label>Nom</Label>
              <Input value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} />

              <Label>Description</Label>
              <Textarea value={newAgent.description} onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })} />

              <Label>Type</Label>
              <Input value={newAgent.type} onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })} />

              <Label>Modèle</Label>
              <Input value={newAgent.model} onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })} />

              <Label>API Key</Label>
              <Input type="password" value={newAgent.apiKey} onChange={(e) => setNewAgent({ ...newAgent, apiKey: e.target.value })} />

              <Label>API URL</Label>
              <Input value={newAgent.apiUrl} onChange={(e) => setNewAgent({ ...newAgent, apiUrl: e.target.value })} />

              <div className="flex items-center gap-2 mt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={!newAgent.apiUrl || !newAgent.model || isTestingConnection}
                  >
                  {isTestingConnection ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Tester la connexion
                </Button>
                {connectionStatus === "success" && <CheckCircle className="text-green-600" />}
                {connectionStatus === "error" && <XCircle className="text-red-600" />}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => createAgentMutation.mutate()}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-semibold">{agent.name}</h2>
                <p className="text-sm text-gray-600">{agent.type}</p>
              </div>
              <Badge variant="outline" className={agent.status === "ONLINE" ? "text-green-600 border-green-600" : "text-gray-600"}>
                {agent.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{agent.description}</p>
            <p className="text-xs mt-2 text-gray-500">Modèle : {agent.model}</p>
            <p className="text-xs text-gray-500">API : {agent.apiUrl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}