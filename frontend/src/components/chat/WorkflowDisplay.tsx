"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, Play, Loader2, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

interface WorkflowExecution {
  id: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_for_input';
  input: any;
  finalResult?: string;
  error?: string;
}

interface WorkflowDisplayProps {
  workflow?: WorkflowExecution;
  isVisible: boolean;
}

export function WorkflowDisplay({ workflow, isVisible }: WorkflowDisplayProps) {
  if (!isVisible || !workflow) return null;

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStepTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'running':
        return 'text-blue-700';
      case 'failed':
        return 'text-red-700';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getWorkflowStatusText = () => {
    switch (workflow.status) {
      case 'completed':
        return 'Traitement terminé avec succès';
      case 'failed':
        return 'Traitement échoué';
      case 'waiting_for_input':
        return 'En attente d\'informations supplémentaires';
      case 'running':
        return 'Traitement en cours...';
      default:
        return 'En attente...';
    }
  };

  const getWorkflowStatusColor = () => {
    switch (workflow.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'waiting_for_input':
        return 'border-orange-200 bg-orange-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="mb-6">
      <Card className={`border-2 ${getWorkflowStatusColor()}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {workflow.status === 'waiting_for_input' ? (
                <HelpCircle className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Workflow d'exécution
              </h3>
              <p className="text-sm text-gray-600">
                {getWorkflowStatusText()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {workflow.steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${getStepStatusColor(step.status)} ${index === workflow.steps.length - 1 && step.status !== 'completed' ? 'ring-2 ring-blue-300' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${getStepTextColor(step.status)}`}>
                        {step.name}
                      </h4>
                      {step.status === 'running' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          En cours...
                        </span>
                      )}
                      {step.status === 'completed' && workflow.status === 'waiting_for_input' && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          En attente
                        </span>
                      )}
                      {index === workflow.steps.length - 1 && step.status !== 'completed' && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full animate-pulse">Étape actuelle</span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${getStepTextColor(step.status)}`}>
                      {step.description}
                    </p>
                    
                    {step.result && (
                      <div className="mt-3 p-3 bg-white rounded border text-sm">
                        <div className="whitespace-pre-wrap text-gray-700">
                          {step.result}
                        </div>
                      </div>
                    )}
                    
                    {step.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                        <div className="text-red-700 font-medium mb-1">Erreur :</div>
                        <div className="text-red-600">
                          {step.error}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workflow.finalResult && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">
                {workflow.status === 'waiting_for_input' ? 'Demande d\'informations :' : 'Résultat final :'}
              </h4>
              <div className="text-gray-700 whitespace-pre-wrap">
                {workflow.finalResult}
              </div>
            </div>
          )}

          {workflow.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Erreur du workflow :</h4>
              <div className="text-red-600">
                {workflow.error}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 