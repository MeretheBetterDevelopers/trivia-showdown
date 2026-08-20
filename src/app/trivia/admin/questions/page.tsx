import { prisma } from "@/src/lib/prisma";
import { CreateQuestionForm } from "../_components/create-question-form";
import { QuestionList } from "../_components/question-list";
import { copy } from "@/src/lib/constants/copy";

export default async function AdminQuestionsPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      text: true,
      choices: true,
      correctAnswer: true,
      category: true,
      difficulty: true,
      imageUrl: true,
    },
  });

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <h1 className="font-heading text-3xl font-bold">
        {copy.admin.manageQuestionsHeading}
      </h1>
      <CreateQuestionForm />
      <QuestionList questions={questions} />
    </div>
  );
}
