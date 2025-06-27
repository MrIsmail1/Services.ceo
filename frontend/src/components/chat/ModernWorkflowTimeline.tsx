import { CheckCircle, Loader2, AlertCircle, Clock, Play } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

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

interface ModernWorkflowTimelineProps {
  workflow?: WorkflowExecution;
  isVisible: boolean;
}

const statusIcon = {
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  running: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
  failed: <AlertCircle className="w-5 h-5 text-red-500" />,
  pending: <Clock className="w-5 h-5 text-gray-400" />,
};

const statusColor = {
  completed: 'border-green-300 bg-green-50',
  running: 'border-blue-300 bg-blue-50',
  failed: 'border-red-300 bg-red-50',
  pending: 'border-gray-200 bg-gray-50',
};

const statusBadge = {
  completed: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700 animate-pulse',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-500',
};

export function ModernWorkflowTimeline({ workflow, isVisible }: ModernWorkflowTimelineProps) {
  if (!isVisible || !workflow) return null;

  const totalSteps = workflow.steps.length;
  const currentStep = workflow.currentStepIndex;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Play className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Progression du workflow</h3>
        <span className="ml-auto text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          Étape {Math.min(currentStep + 1, totalSteps)}/{totalSteps}
        </span>
      </div>
      <ol className="relative border-l-2 border-blue-200 ml-4">
        {workflow.steps.map((step, idx) => (
          <li key={step.id} className="mb-8 ml-2">
            <div className={`flex items-center gap-3 mb-1 ${idx === currentStep ? 'animate-pulse' : ''}`}> 
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${statusColor[step.status]} shadow-sm`}>{statusIcon[step.status]}</span>
              <span className="font-semibold text-base text-gray-900">{step.name}</span>
              <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${statusBadge[step.status]}`}>{
                step.status === 'completed' ? 'Terminé' :
                step.status === 'running' ? 'En cours' :
                step.status === 'failed' ? 'Erreur' :
                'En attente'
              }</span>
              {idx === currentStep && step.status !== 'completed' && (
                <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Étape actuelle</span>
              )}
            </div>
            <div className="ml-10">
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              {step.result && (
                <div className="p-3 bg-white border border-blue-100 rounded-lg text-sm mb-2 mt-1 shadow-sm">
                  <div className="whitespace-pre-wrap text-gray-800">{step.result}</div>
                </div>
              )}
              {step.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm mb-2 mt-1">
                  <div className="text-red-700 font-medium mb-1">Erreur :</div>
                  <div className="text-red-600">{step.error}</div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      {workflow.finalResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Résultat final :</h4>
          <div className="text-green-700 whitespace-pre-wrap">
            <FinalResultDisplay content={workflow.finalResult} />
          </div>
        </div>
      )}
      {workflow.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Erreur du workflow :</h4>
          <div className="text-red-600">{workflow.error}</div>
        </div>
      )}
    </div>
  );
}

function FinalResultDisplay({ content }: { content: string }) {
  let parsed: any = null;
  try {
    let clean = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\n/g, '\n');
    if (clean.trim().startsWith('{') || clean.trim().startsWith('[')) {
      parsed = JSON.parse(clean);
    }
  } catch (e) { /* pas du JSON */ }

  if (parsed) {
    return (
      <div className="space-y-2">
        {Object.entries(parsed).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold text-green-900">{key} :</span>
            {Array.isArray(value) ? (
              <ul className="list-disc ml-6 text-green-800">
                {value.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            ) : (
              <span className="ml-2 text-green-800">{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="prose prose-green max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
} 