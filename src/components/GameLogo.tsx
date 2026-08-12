export function GameLogo({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="game-logo-gradient"
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" style={{ stopColor: "var(--chart-1)" }} />
          <stop offset="25%" style={{ stopColor: "var(--chart-2)" }} />
          <stop offset="50%" style={{ stopColor: "var(--chart-3)" }} />
          <stop offset="75%" style={{ stopColor: "var(--chart-4)" }} />
          <stop offset="100%" style={{ stopColor: "var(--chart-5)" }} />
        </linearGradient>
      </defs>

      {/* Left loop */}
      <path
        d="
          M50 30
          L10 6
          Q3 5 3 20
          V50
          Q3 55 10 54
          L50 30
        "
        fill="none"
        stroke="url(#game-logo-gradient)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right loop */}
      <path
        d="
          M50 30
          L90 6
          Q97 5 97 20
          V50
          Q97 55 88 54
          L50 30
        "
        fill="none"
        stroke="url(#game-logo-gradient)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
