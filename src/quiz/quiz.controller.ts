import { Controller, Get, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizData } from './types';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuizData(
    @Query('language') language: string,
    @Query('questionsQuantity') questionsQuantity = 5,
    @Query('answersQuantity') answersQuantity = 3,
  ): Promise<QuizData[]> {
    try {
      return await this.quizService.getQuiz({
        language,
        questionsQuantity,
        answersQuantity,
      });
    } catch (error) {
      throw error;
    }
  }
}
