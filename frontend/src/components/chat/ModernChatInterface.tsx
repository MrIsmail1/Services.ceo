"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ModernWorkflowTimeline } from "./ModernWorkflowTimeline";
import { MarkdownMessage } from "./MarkdownMessage";
import { TypewriterMessage } from "./TypewriterMessage";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  workflow?: any;
  requiresMoreInput?: boolean;
  missingInfo?: string[];
  questions?: string[];
}

interface ModernChatInterfaceProps {
  serviceId: string;
  serviceName: string;
  serviceDescription?: string;
  onBack: () => void;
}

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

export function ModernChatInterface({ 
  serviceId, 
  serviceName, 
  serviceDescription, 
  onBack 
}: ModernChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkflow, setCurrentWorkflow] = useState<any>(null);
  const [suggestedInputs, setSuggestedInputs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [provider, setProvider] = useState<'lama' | 'mistral' | 'openai'>('lama');

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentWorkflow, suggestedInputs]);

  // Message de bienvenue
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: `Bonjour ! Je suis votre assistant ${serviceName}. ${serviceDescription || 'Comment puis-je vous aider ?'}`,
      timestamp: new Date()
    }]);
  }, [serviceName, serviceDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || submitting) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setSubmitting(true);
    setError(null);
    setCurrentWorkflow(null);
    setSuggestedInputs([]);

    try {
      const res = await fetch(`http://localhost:4500/services/${serviceId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { text: inputValue }, provider }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Afficher le workflow si disponible
        if (data.workflow) {
          setCurrentWorkflow(data.workflow);
        }

        // Gérer les demandes d'informations supplémentaires
        if (data.requiresMoreInput) {
          setSuggestedInputs(data.questions || []);
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.data.result,
          timestamp: new Date(),
          workflow: data.workflow,
          requiresMoreInput: data.requiresMoreInput,
          missingInfo: data.missingInfo,
          questions: data.questions
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(data.message || "Erreur lors de l'exécution du service");
        // Ajouter un message d'erreur dans le chat
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      setError("Erreur réseau");
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Erreur de connexion. Vérifiez votre connexion internet.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestedInput = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header moderne */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{serviceName}</h1>
                <p className="text-sm text-gray-500">{serviceDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de provider IA */}
      <div className="p-3 border-b flex items-center gap-3 bg-gray-50">
        <span className="text-sm text-gray-700">Fournisseur IA :</span>
        <select
          value={provider}
          onChange={e => setProvider(e.target.value as 'lama' | 'mistral' | 'openai')}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="lama">Lama Studio</option>
          <option value="mistral">Mistral AI</option>
          <option value="openai">OpenAI GPT-4o</option>
        </select>
      </div>

      {/* Zone de messages avec hauteur limitée */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div key={message.id} className={`flex flex-col w-full mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[80%] transition-all duration-300 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow ${message.type === 'user' ? 'bg-blue-600 ml-2' : 'bg-gradient-to-r from-blue-500 to-purple-600 mr-2'}`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              {/* Bulle de chat */}
              <div className={`rounded-2xl px-4 py-3 shadow-md transition-all duration-300 ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'} ${message.type === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}
                style={{ minWidth: 80 }}>
                {/* Effet machine à écrire pour l'IA */}
                {message.type === 'assistant' ? (
                  <MarkdownMessage content={<TypewriterMessage content={message.content} />} isRawElement />
                ) : (
                  <span className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</span>
                )}
                <div className="text-xs mt-2 text-gray-400 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            {/* Afficher le workflow pour les messages de l'assistant */}
            {message.type === 'assistant' && message.workflow && (
              <div className="mt-4 w-full">
                <ModernWorkflowTimeline 
                  workflow={message.workflow} 
                  isVisible={true} 
                />
              </div>
            )}
          </div>
        ))}

        {/* Afficher le workflow en cours si pas encore dans les messages */}
        {submitting && currentWorkflow && (
          <div className="mt-4 w-full">
            <ModernWorkflowTimeline 
              workflow={currentWorkflow} 
              isVisible={true} 
            />
          </div>
        )}

        {/* Indicateur de chargement moderne */}
        {submitting && !currentWorkflow && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie moderne */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre message..."
              className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              disabled={submitting}
            />
          </div>
          <Button
            type="submit"
            disabled={submitting || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
} 