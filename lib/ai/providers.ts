import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  openai,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

import { isTestEnvironment } from '../constants';

// استفاده از llm7.io به عنوان provider به سبک OpenAI
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
        'chat-model': openai({
          apiKey: llm7ApiKey,
          baseURL: llm7BaseURL,
          model: 'deepseek-r1-0528', // مدل دلخواه llm7.io را اینجا قرار دهید
        }),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai({
            apiKey: llm7ApiKey,
            baseURL: llm7BaseURL,
            model: 'deepseek-coder', // مدل متفاوت برای reasoning اگر نیاز دارید
          }),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai({
          apiKey: llm7ApiKey,
          baseURL: llm7BaseURL,
          model: 'deepseek-r1-0528',
        }),
        'artifact-model': openai({
          apiKey: llm7ApiKey,
          baseURL: llm7BaseURL,
          model: 'deepseek-r1-0528',
        }),
      },
      imageModels: {
        // اگر llm7 از مدل تصویر پشتیبانی کند، اینجا اضافه کنید
      },
    });
