const appName = "Trivia Showdown";

export const copy = {
  appName,
  welcome: {
    badge: "10 questions · multiple choice",
    titlePrefix: "Trivia",
    titleAccent: "Showdown",
    tagline: "Test your knowledge against the clock and your friends.",
    startButton: "Start",
    leaderboardButton: "Leaderboard",
  },
  trivia: {
    loadingMessage: "Loading questions…",
    genericErrorMessage: "Something went wrong",
    retryButton: "Try again",
    questionLabel: "Question",
    ofLabel: "of",
    timeLeftSuffix: "s",
    nextButton: "Next question",
    seeResultsButton: "See results",
  },
  results: {
    heading: "Round complete!",
    scoreLabel: "You scored",
    playAgainButton: "Play again",
    leaderboardButton: "Leaderboard",
  },
  leaderboard: {
    heading: "Leaderboard",
    comingSoonMessage: "Coming soon — scores aren't tracked yet.",
    backButton: `Back to ${appName}`,
  },
  themeToggle: {
    ariaLabel: "Toggle color theme",
    lightLabel: "☀️ Light",
    darkLabel: "🌙 Dark",
  },
} as const;
