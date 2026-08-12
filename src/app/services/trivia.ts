import { TRIVIA_API_URL } from "@/src/lib/constants/urls";
import { TriviaApiResponse } from "@/src/types/api/TriviaApiResponse";

//fetch and queries for trivia questions
export const fetchTriviaQuestions = async (
  amount: number,
  category: string,
  difficulty: string,
) => {
  let data: TriviaApiResponse;
  try {
    const response = await fetch(
      `${TRIVIA_API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}`,
    );
    data = await response.json();
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    throw error;
  }
  return data;
};
