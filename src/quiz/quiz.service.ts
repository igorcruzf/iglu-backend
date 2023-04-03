import { ApiParams, QuizData } from './types';
import { shuffle } from './utils';
import { OpenAiApiService } from './openAIApi.service';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const MOCK_QUIZ_PATH = 'src/quiz/mocks/quizMock.json';
@Injectable()
export class QuizService {
  constructor(private readonly openAiApiService: OpenAiApiService) {}

  async getMockQuiz(): Promise<QuizData[]> {
    return JSON.parse(fs.readFileSync(MOCK_QUIZ_PATH, 'utf8'));
  }

  async getQuiz({
    language,
    questionsQuantity,
    answersQuantity,
    useMock,
  }: ApiParams): Promise<QuizData[]> {
    if (useMock) {
      return this.getMockQuiz();
    }

    const chatCompletion = await this.openAiApiService.fetchQuizData({
      language,
      questionsQuantity,
      answersQuantity,
    });

    return chatCompletion.choices
      .map((choice) => {
        const chatMessage = choice.message;
        let splitAnswers: string[];
        let answers: string[];
        let history: string;

        try {
          const splitQuiz = chatMessage.content.split(/quiz:/gi);
          splitAnswers = splitQuiz[1].split(/answers:/gi);
          answers = splitAnswers[1]
            .replace('[', '')
            .replace(']', '')
            .split(',');
          history = splitQuiz[0].includes('istory:')
            ? splitQuiz[0].split('istory:')[1]
            : splitQuiz[0];
        } catch (error) {
          console.error(
            'Failed to fetch one of the quiz data from OpenAI API:',
            error,
          );
          splitAnswers = [''];
          answers = [''];
          history = '';
        }

        return {
          history: history,
          question: splitAnswers[0],
          correctAnswer: answers[0],
          answers: shuffle(answers),
        };
      })
      .filter((quizData) => {
        return (
          quizData.history &&
          quizData.question &&
          quizData.correctAnswer &&
          quizData.answers.length == answersQuantity
        );
      });
  }
}
