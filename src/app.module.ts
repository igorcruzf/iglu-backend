import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { OpenAiApiService } from './quiz/openAIApi.service';

@Module({
  imports: [QuizModule],
  controllers: [QuizController],
  providers: [OpenAiApiService, QuizService],
})
export class AppModule {}
