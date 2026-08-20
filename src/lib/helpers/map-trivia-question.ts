//this file is used to map the TriviaApiQuestion type to the Questions type used in the game. It also decodes HTML entities in the question and answer text, and shuffles the answer choices.

import { TriviaApiQuestion } from "@/src/lib/schemas/trivia";
import { Questions } from "@/src/types/game/question";
import { decodeHtmlEntities } from "./decode-html-entities";
import { shuffle } from "./shuffle-items";

export function mapTriviaApiQuestion(
  apiQuestion: TriviaApiQuestion,
  id: number,
): Questions {
  const choices = shuffle([
    apiQuestion.correct_answer,
    ...apiQuestion.incorrect_answers,
  ]).map(decodeHtmlEntities);

  return {
    id: `otdb-${id}`,
    text: decodeHtmlEntities(apiQuestion.question),
    choices,
    correctAnswer: decodeHtmlEntities(apiQuestion.correct_answer),
    category: decodeHtmlEntities(apiQuestion.category),
    difficulty: apiQuestion.difficulty,
  };
}

export function mapTriviaApiQuestions(
  apiQuestions: TriviaApiQuestion[],
): Questions[] {
  return apiQuestions.map(mapTriviaApiQuestion);
}
