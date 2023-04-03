export type ChatCompletion = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop';
    index: number;
  }[];
};

export type QuizData = {
  history: string;
  question: string;
  correctAnswer: string;
  answers: string[];
};

export type ApiParams = {
  language: string;
  questionsQuantity: number;
  answersQuantity: number;
  useMock?: boolean;
};
