// Types pour les schémas de validation
export type JsonSchema = {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
};

// Types pour les contraintes
export type Constraint = {
    field: string;
    type: 'min' | 'max' | 'required' | 'regex' | 'enum';
    value: any;
    message?: string;
};

// Types pour la configuration UI
export type UIConfig = {
    component?: string;
    label?: string;
    placeholder?: string;
    helpText?: string;
    hidden?: boolean;
    disabled?: boolean;
    options?: Array<{ label: string; value: any }>;
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: string;
    };
};

// Types pour les règles de validation
export type ValidationRule = {
    name: string;
    description?: string;
    validate: (value: any) => boolean;
    message: string;
};

// Type principal de configuration
export type ServiceConfiguration = {
    // Schémas
    inputSchema: JsonSchema;
    outputSchema: JsonSchema;

    // Contraintes
    constraints: Constraint[];
    requirements: string[];

    // Prompts
    systemPrompt: string;
    userPrompt: string;

    // Configuration UI
    uiConfig?: Record<string, UIConfig>;

    // Règles de validation
    validationRules?: ValidationRule[];

    // Configuration de repli
    fallbackConfig?: {
        enabled: boolean;
        defaultValues?: Record<string, any>;
        errorMessage?: string;
    };

    // Métadonnées
    metadata?: {
        version: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        tags?: string[];
    };
};

// Type pour la réponse d'API
export type ConfigurationResponse = {
    success: boolean;
    data?: ServiceConfiguration;
    error?: string;
    timestamp: Date;
};

// Type pour la mise à jour de configuration
export type UpdateConfigurationDto = Partial<Omit<ServiceConfiguration, 'metadata'>> & {
    metadata?: Partial<ServiceConfiguration['metadata']>;
};

export * from '../types/configuration.type';