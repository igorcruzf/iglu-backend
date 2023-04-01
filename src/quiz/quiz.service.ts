import { ApiParams, QuizData } from './types';
import { shuffle } from './utils';
import { OpenAiApiService } from './openAIApi.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  constructor(private readonly openAiApiService: OpenAiApiService) {}

  async getQuiz({
    language,
    questionsQuantity,
    answersQuantity,
  }: ApiParams): Promise<QuizData[]> {
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
