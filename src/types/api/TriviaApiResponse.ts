import { TriviaApiQuestion } from "./TriviaApiQuestion";

export interface TriviaApiResponse {
  response_code: 0 | 1 | 2 | 3 | 4 | 5;
  results: TriviaApiQuestion[];
}
