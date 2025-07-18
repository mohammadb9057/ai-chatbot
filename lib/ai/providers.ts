import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';


const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: 'compatible', // strict mode, enable when using the OpenAI API
  baseURL:'https://api.openai.com/v1' ,
  Authorization:'OPENAI_API_KEY',
  
});

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
        'chat-model': openai('deepseek-r1-0528'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('deepseek-r1-0528'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('deepseek-r1-0528'),
        'artifact-model': openai('deepseek-r1-0528'),
      },
      imageModels: {
        'small-model': xai.imageModel('grok-2-image'),
      },
    });
