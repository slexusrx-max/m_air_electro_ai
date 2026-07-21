import "server-only";

export type AiProviderId = "openai" | "anthropic" | "google" | "azure-openai";
export type AiMessageRole = "system" | "user" | "assistant";

export type AiMessage = {
  content: string;
  role: AiMessageRole;
};

export type AiChatRequest = {
  maxOutputTokens?: number;
  messages: AiMessage[];
  model: string;
  temperature?: number;
};

export type AiChatResponse = {
  finishReason: "completed" | "length" | "content-filter" | "tool-call";
  outputText: string;
  provider: AiProviderId;
};

export interface AiProviderAdapter {
  generateText(input: AiChatRequest): Promise<AiChatResponse>;
  id: AiProviderId;
  label: string;
}

type ProviderStatus = {
  configured: boolean;
  id: AiProviderId;
  label: string;
  missingEnv: string[];
};

const providerRequirements: Record<AiProviderId, { env: string[]; label: string }> = {
  openai: {
    label: "OpenAI",
    env: ["OPENAI_API_KEY", "OPENAI_MODEL"],
  },
  anthropic: {
    label: "Anthropic",
    env: ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL"],
  },
  google: {
    label: "Google",
    env: ["GOOGLE_GENERATIVE_AI_API_KEY", "GOOGLE_GENERATIVE_AI_MODEL"],
  },
  "azure-openai": {
    label: "Azure OpenAI",
    env: ["AZURE_OPENAI_API_KEY", "AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_DEPLOYMENT"],
  },
};

function resolvePreferredProvider(): AiProviderId {
  const configured = process.env.AI_PROVIDER?.trim() as AiProviderId | undefined;
  if (configured && configured in providerRequirements) {
    return configured;
  }

  return "openai";
}

export function getAiProviderStatuses(): ProviderStatus[] {
  return (Object.entries(providerRequirements) as Array<
    [AiProviderId, (typeof providerRequirements)[AiProviderId]]
  >).map(([id, config]) => {
    const missingEnv = config.env.filter((name) => !process.env[name]?.trim());
    return {
      id,
      label: config.label,
      configured: missingEnv.length === 0,
      missingEnv,
    };
  });
}

export function getAiRuntimeStatus() {
  const providers = getAiProviderStatuses();
  const preferredProvider = resolvePreferredProvider();
  const active = providers.find((provider) => provider.id === preferredProvider);

  return {
    preferredProvider,
    activeProviderConfigured: Boolean(active?.configured),
    atLeastOneProviderConfigured: providers.some((provider) => provider.configured),
    providers,
  };
}
