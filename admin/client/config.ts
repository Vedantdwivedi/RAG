import { z } from "zod";
import {
  AzureOpenAIConfigSchema,
  DEFAULT_AZURE_OPENAI_CONFIG,
} from "./providers/azure";
import { DEFAULT_GEMINI_CONFIG, GeminiConfigSchema } from "./providers/gemini";
import { DEFAULT_OLLAMA_CONFIG, OllamaConfigSchema } from "./providers/ollama";
import { DEFAULT_OPENAI_CONFIG, OpenAIConfigSchema } from "./providers/openai";
import { getBaseURL } from "./utils";

// Chat config scheme
export const ChatConfigSchema = z.object({
  system_prompt: z.string().nullable().optional(),
  conversation_starters: z
    .array(z.string())
    .optional()
    .refine(
      (data) => {
        if (data?.length ?? 0 > 2) {
          return data?.every((item) => item.trim() !== "");
        } else {
          // There is no conversation starter questions
          return true;
        }
      },
      { message: "A conversation starter message must be non-empty" },
    ),
});

// Merge the model config schemes with the Chat config scheme
export const ConfigFormSchema = z
  .union([
    OpenAIConfigSchema.merge(ChatConfigSchema),
    GeminiConfigSchema.merge(ChatConfigSchema),
    OllamaConfigSchema.merge(ChatConfigSchema),
    AzureOpenAIConfigSchema.merge(ChatConfigSchema),
  ])
  .refine((data) => {
    switch (data.model_provider) {
      case "openai":
        return OpenAIConfigSchema.parse(data);
      case "gemini":
        return GeminiConfigSchema.parse(data);
      case "ollama":
        return OllamaConfigSchema.parse(data);
      case "azure-openai":
        return AzureOpenAIConfigSchema.parse(data);
      default:
        return true;
    }
  });

export type ConfigFormType = z.TypeOf<typeof ConfigFormSchema>;

export const supportedProviders = [
  {
    name: "OpenAI",
    value: "openai",
  },
  {
    name: "Gemini",
    value: "gemini",
  },
  {
    name: "Ollama",
    value: "ollama",
  },
  {
    name: "Azure OpenAI",
    value: "azure-openai",
  },
];

export const DEFAULT_CONFIG: z.input<typeof ConfigFormSchema> = {};

export const getDefaultConfig = (provider: string) => {
  const config = {
    system_prompt: null,
    conversation_starters: [],
    configured: false,
  };

  switch (provider) {
    case "openai":
      return { ...config, ...DEFAULT_OPENAI_CONFIG };
    case "ollama":
      return { ...config, ...DEFAULT_OLLAMA_CONFIG };
    case "gemini":
      return { ...config, ...DEFAULT_GEMINI_CONFIG };
    case "azure-openai":
      return { ...config, ...DEFAULT_AZURE_OPENAI_CONFIG };
    default:
      return { ...config };
  }
};

export async function fetchConfig(): Promise<ConfigFormType> {
  const res = await fetch(`${getBaseURL()}/api/management/config`);
  if (!res.ok) {
    const error = await res.text();
    console.error(error);
    return DEFAULT_CONFIG;
  }
  const data = await res.json();
  return data;
}

export async function updateConfig(
  data: ConfigFormType,
): Promise<ConfigFormType> {
  // Ignore configured attribute
  const { configured, ...updateValues } = data;

  const res = await fetch(`${getBaseURL()}/api/management/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateValues),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return (await res.json()).data as ConfigFormType;
}

export async function fetchModels(
  provider: string,
  providerUrl?: string,
): Promise<string[]> {
  const params = new URLSearchParams({
    provider: provider,
    ...(providerUrl && { provider_url: providerUrl }),
  });

  const url = `${getBaseURL()}/api/management/config/models?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  const data = await res.json();
  return data;
}
