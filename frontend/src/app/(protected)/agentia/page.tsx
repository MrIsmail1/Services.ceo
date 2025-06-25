"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Plus,
  Bot,
  Play,
  Pause,
  Trash2,
  Edit,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  Brain,
  MessageSquare,
  ImageIcon,
  FileText,
  Code,
} from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  type: string
  status: "active" | "inactive" | "error"
  lastUsed: string
  apiKey: string
  model: string
  icon: string
}

const agentTypes = [
  { value: "chatbot", label: "Chatbot", icon: MessageSquare },
  { value: "image-generator", label: "Générateur d'images", icon: ImageIcon },
  { value: "text-analyzer", label: "Analyseur de texte", icon: FileText },
  { value: "code-assistant", label: "Assistant de code", icon: Code },
  { value: "general-ai", label: "IA générale", icon: Brain },
]

const models = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3", label: "Claude 3" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "llama-2", label: "Llama 2" },
]

export default function AgentiaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    type: "",
    model: "",
    apiKey: "",
  })

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Assistant Client",
      description: "Agent IA pour répondre aux questions des clients",
      type: "chatbot",
      status: "active",
      lastUsed: "Il y a 2 heures",
      apiKey: "sk-***************",
      model: "gpt-4",
      icon: "💬",
    },
    {
      id: "2",
      name: "Générateur de Contenu",
      description: "Création automatique de contenu marketing",
      type: "text-analyzer",
      status: "active",
      lastUsed: "Il y a 1 jour",
      apiKey: "sk-***************",
      model: "gpt-3.5-turbo",
      icon: "✍️",
    },
    {
      id: "3",
      name: "Analyseur de Code",
      description: "Révision et optimisation de code",
      type: "code-assistant",
      status: "inactive",
      lastUsed: "Il y a 3 jours",
      apiKey: "sk-***************",
      model: "claude-3",
      icon: "🔍",
    },
  ])

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    // Simulation d'un test de connexion
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const isSuccess = Math.random() > 0.3 // 70% de chance de succès
    setConnectionStatus(isSuccess ? "success" : "error")
    setIsTestingConnection(false)

    if (isSuccess) {
      toast.success("Connexion réussie", {
        description: "L'agent IA est prêt à être utilisé",
      })
    } else {
      toast.error("Échec de la connexion", {
        description: "Vérifiez votre clé API et réessayez",
      })
    }
  }

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.type || !newAgent.model || !newAgent.apiKey) {
      toast.error("Champs manquants", {
        description: "Veuillez remplir tous les champs obligatoires",
      })
      return
    }

    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      type: newAgent.type,
      status: "active",
      lastUsed: "Jamais utilisé",
      apiKey: newAgent.apiKey,
      model: newAgent.model,
      icon: agentTypes.find((t) => t.value === newAgent.type)?.icon.name || "🤖",
    }

    setAgents([...agents, agent])
    setNewAgent({ name: "", description: "", type: "", model: "", apiKey: "" })
    setIsModalOpen(false)
    setConnectionStatus("idle")

    toast.success("Agent créé", {
      description: `L'agent "${agent.name}" a été créé avec succès`,
    })
  }

  const toggleAgentStatus = (id: string) => {
    setAgents(
      agents.map((agent) =>
        agent.id === id ? { ...agent, status: agent.status === "active" ? "inactive" : ("active" as const) } : agent,
      ),
    )
  }

  const deleteAgent = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
    toast.success("Agent supprimé", {
      description: "L'agent a été supprimé avec succès",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "inactive":
        return <Pause className="w-4 h-4" />
      case "error":
        return <XCircle className="w-4 h-4" />
      default:
        return <Pause className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600" />
              Agentia
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos agents IA et leurs configurations</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Créer un agent IA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouvel agent IA</DialogTitle>
                <DialogDescription>Configurez votre agent IA avec les paramètres appropriés</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'agent *</Label>
                  <Input
                    id="name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    placeholder="Ex: Assistant Client"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                    placeholder="Décrivez le rôle de cet agent..."
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type d'agent *</Label>
                  <Select value={newAgent.type} onValueChange={(value) => setNewAgent({ ...newAgent, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modèle IA *</Label>
                  <Select value={newAgent.model} onValueChange={(value) => setNewAgent({ ...newAgent, model: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">Clé API *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={newAgent.apiKey}
                    onChange={(e) => setNewAgent({ ...newAgent, apiKey: e.target.value })}
                    placeholder="sk-..."
                  />
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={!newAgent.apiKey || isTestingConnection}
                    className="flex-1"
                  >
                    {isTestingConnection ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    Tester la connexion
                  </Button>

                  {connectionStatus === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {connectionStatus === "error" && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateAgent}>Créer l'agent</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Agents</p>
                  <p className="text-2xl font-bold">{agents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold">{agents.filter((a) => a.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Pause className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Inactifs</p>
                  <p className="text-2xl font-bold">{agents.filter((a) => a.status === "inactive").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Erreurs</p>
                  <p className="text-2xl font-bold">{agents.filter((a) => a.status === "error").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">{agent.icon}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {agentTypes.find((t) => t.value === agent.type)?.label}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(agent.status)} flex items-center gap-1`}>
                    {getStatusIcon(agent.status)}
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{agent.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modèle:</span>
                    <span className="font-medium">{agent.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dernière utilisation:</span>
                    <span className="font-medium">{agent.lastUsed}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleAgentStatus(agent.id)} className="flex-1">
                    {agent.status === "active" ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Activer
                      </>
                    )}
                  </Button>

                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteAgent(agent.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent IA</h3>
            <p className="text-gray-600 mb-4">Commencez par créer votre premier agent IA</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un agent IA
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
