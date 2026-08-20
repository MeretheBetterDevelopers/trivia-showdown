import { TRIVIA_API_URL } from "@/src/lib/constants/urls";
import { TRIVIA_RESPOND_CODES } from "@/src/lib/constants/trivia-respond-codes";
import { mapTriviaApiQuestions } from "@/src/lib/helpers/map-trivia-question";
import {
  TriviaApiResponse,
  triviaApiResponseSchema,
} from "@/src/lib/schemas/trivia";
import { Questions } from "@/src/types/game/question";

//fetch and queries for trivia questions
export const fetchTriviaQuestions = async (
  amount?: number,
  categoryId?: number,
  difficulty?: string,
): Promise<Questions[]> => {
  const url = new URL(TRIVIA_API_URL);
  if (amount) url.searchParams.set("amount", String(amount));
  if (categoryId) url.searchParams.set("category", String(categoryId));
  if (difficulty) url.searchParams.set("difficulty", difficulty);

  let data: TriviaApiResponse;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.status === 429) {
      throw new Error(
        "Trivia API rate limit reached — please wait a moment and try again.",
      );
    }
    if (!response.ok) {
      throw new Error(`Trivia API request failed (${response.status})`);
    }
    data = triviaApiResponseSchema.parse(await response.json());
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    throw error;
  }

  // Code 1 ("No results found") is a valid empty outcome for a narrow
  // category request, not an error — the round-building logic treats it
  // as "nothing more from OTDB" rather than failing the whole round.
  if (data.response_code === 1) {
    return [];
  }
  if (data.response_code !== 0) {
    throw new Error(
      `Trivia API error: ${TRIVIA_RESPOND_CODES[data.response_code]}`,
    );
  }

  return mapTriviaApiQuestions(data.results);
};
