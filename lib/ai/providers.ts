import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { OpenAI } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

import { isTestEnvironment } from '../constants';

const llm7ApiKey = process.env.LLM7_API_KEY!;
const llm7BaseURL = process.env.LLM7_API_BASE_URL || 'https://api.llm7.io/v1';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': new OpenAI({
          apiKey: llm7ApiKey,
          baseURL: llm7BaseURL,
          model: 'deepseek-r1-0528',
        }),
        'chat-model-reasoning': wrapLanguageModel({
          model: new OpenAI({
            apiKey: llm7ApiKey,
            baseURL: llm7BaseURL,
            model: 'deepseek-coder',
          }),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': new OpenAI({
          apiKey: llm7ApiKey,
          baseURL: llm7BaseURL,
          model: 'deepseek-r1-0528',
        }),
        'artifact-model': new OpenAI({
          apiKey: llm7ApiKey,
          baseURL: llm7BaseURL,
          model: 'deepseek-r1-0528',
        }),
      },
      imageModels: {
        // اگر llm7 تصویر ساپورت کند، اینجا اضافه کن
      },
    });
