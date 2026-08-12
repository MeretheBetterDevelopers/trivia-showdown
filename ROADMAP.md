# Trivia Showdown — Roadmap

A team trivia game for onboarding/game nights. Questions come from two sources shuffled together: the public [Open Trivia DB](https://opentdb.com/) API, and a self-hosted Supabase table for hand-written, company-specific questions that anyone can add without a code deploy.

The company-specific rounds (Slack quotes, guess-the-coworker, Danish/Aarhus-local trivia) are what people actually talk about the next day — those need to stay easy to add to, ideally via a rotating question-setter so it's not all on one person.

Work through the features below one at a time, roughly top to bottom — later items depend on earlier ones. Each links to its GitHub issue.

## Core game mechanics

- [ ] [#1 Fetch trivia questions from public API](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/1)
- [ ] [#2 Countdown timer per question](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/2)
- [ ] [#3 Score tracking + results screen](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/3)
- [ ] [#4 Loading and error states](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/4)
- [ ] [#5 Local leaderboard (stretch)](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/5)

## Custom questions infrastructure

- [ ] [#6 Set up Supabase project + schema for custom questions](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/6)
- [ ] [#7 Build custom-questions fetch/insert service (Supabase)](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/7)
- [ ] [#8 Merge and shuffle Open Trivia DB + custom questions into one pool](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/8)
- [ ] [#9 Add image support to questions](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/9)

## Content rounds

- [ ] [#10 Company/team trivia round](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/10) — "who said it", company history, guess the coworker, dev-team commit stats
- [ ] [#11 Dev/tech knowledge round](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/11) — programming history, famous bugs/outages, guess the framework, tech company trivia
- [ ] [#12 General knowledge round](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/12) — geography, movies/TV, music, sports, science, Danish/Aarhus-local trivia
- [ ] [#13 Wildcard/fun rounds](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/13) — estimation questions, picture round, rapid-fire true/false tiebreaker

## Process

- [ ] [#14 Rotating question-setter workflow](https://github.com/MeretheBetterDevelopers/trivia-showdown/issues/14) — keep the custom-question pool fresh without one person writing it all
