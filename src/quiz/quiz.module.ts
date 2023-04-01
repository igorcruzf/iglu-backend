import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { OpenAiApiService } from './openAIApi.service';
import { QuizService } from './quiz.service';

@Module({
  controllers: [QuizController],
  providers: [OpenAiApiService, QuizService],
})
export class QuizModule {}
