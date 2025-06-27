export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface WorkflowExecution {
  id: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_for_input';
  input: any;
  finalResult?: string;
  error?: string;
}

export interface WorkflowResponse {
  success: boolean;
  workflow: WorkflowExecution;
  data?: any;
  error?: string;
}

export interface WorkflowStepResult {
  stepId: string;
  status: 'completed' | 'failed';
  result?: string;
  error?: string;
} 