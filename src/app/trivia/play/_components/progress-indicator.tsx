export default function ProgressIndicator({
  questionNumber,
  total,
}: Readonly<{
  questionNumber: number;
  total: number;
}>) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`size-2 rounded-full transition-colors ${
            index < questionNumber ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}
