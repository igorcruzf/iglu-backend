import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiParams, ChatCompletion } from './types';
import { generateAnswersExample } from './utils';

@Injectable()
export class OpenAiApiService {
  async fetchQuizData({
    language,
    questionsQuantity,
    answersQuantity,
  }: ApiParams): Promise<ChatCompletion> {
    const token = process.env.OPENAI_API_KEY;
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const authHeader = { Authorization: `Bearer ${token}` };
    const requestData = {
      model: 'gpt-3.5-turbo',
      n: questionsQuantity,
      frequency_penalty: 1.0,
      messages: [
        {
          role: 'user',
          content: `You are an assistant on a language learning platform, your goal is to tell a story in the language chosen by the user, always within one paragraph. At the end of the story, separately, you will ask a question about the story, in the STRICT format of 'quiz: question here', and provide the answer to the question along with two incorrect answers, in the following STRICT format with ${answersQuantity} answers: ${generateAnswersExample(
            answersQuantity,
          )}, with the correct answer always being answer1. For example, if the user asks for a one-paragraph story in English with ${answersQuantity} answers, the following could be returned (do not use this story as the basis for your answer):
                      "The sun had just risen over the horizon, casting a golden glow over the still lake. The water was calm, with only a few ripples caused by the gentle breeze. The birds chirped in the nearby trees, welcoming the new day. As the sun rose higher in the sky, the world around the lake came to life. A fish leapt out of the water, creating a small splash. A butterfly fluttered by, landing on a nearby flower. The leaves rustled in the wind, creating a soothing sound. The world was in harmony, and everything felt right.
                      quiz: What was the atmosphere like around the lake?
                      answers: [Calm and peaceful, Chaotic and loud, Dark and scary]"
                      Avoid starting the history with a woman name
                   `,
        },
        {
          role: 'user',
          content: `Make a one-paragraph story in ${language} with ${answersQuantity} answers. Remember to try various type of histories, involving one or multiple characters, male or female and use uncommon names.`,
        },
      ],
    };

    try {
      const response = await axios.post(apiEndpoint, requestData, {
        headers: authHeader,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quiz data from OpenAI API:', error);
      throw error;
    }
  }
}
