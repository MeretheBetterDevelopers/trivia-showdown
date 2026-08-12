import { TRIVIA_API_URL } from "@/src/lib/constants/urls";
import { TRIVIA_RESPOND_CODES } from "@/src/lib/constants/triviaRespondCodes";
import { mapTriviaApiQuestions } from "@/src/lib/helpers/mapTriviaQuestion";
import {
  TriviaApiResponse,
  triviaApiResponseSchema,
} from "@/src/lib/schemas/trivia";
import { Questions } from "@/src/types/game/Question";

//fetch and queries for trivia questions
export const fetchTriviaQuestions = async (
  amount?: number,
  category?: number,
  difficulty?: "easy" | "medium" | "hard",
): Promise<Questions[]> => {
  const url = new URL(TRIVIA_API_URL);
  amount && url.searchParams.set("amount", String(amount));
  category && url.searchParams.set("category", String(category));
  difficulty && url.searchParams.set("difficulty", difficulty);

  let data: TriviaApiResponse;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.status === 429) {
      throw new Error("Trivia API rate limit reached — please wait a moment and try again.");
    }
    if (!response.ok) {
      throw new Error(`Trivia API request failed (${response.status})`);
    }
    data = triviaApiResponseSchema.parse(await response.json());
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    throw error;
  }

  if (data.response_code !== 0) {
    throw new Error(
      `Trivia API error: ${TRIVIA_RESPOND_CODES[data.response_code]}`,
    );
  }

  return mapTriviaApiQuestions(data.results);
};
