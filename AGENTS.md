# Architecture Rules

- Reuse `src/game/QuezonMap.tsx` and its official municipality shapes for every interactive Quezon map, so geography and district boundaries remain consistent across the dictionary and game.
- Quezon Quest levels/questions are generated from `src/quest/data.ts` (CONFIG, FACTS, game districts, dictionary) — grow the game by editing data, not UI.
