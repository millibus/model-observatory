# Model Observatory

Model Observatory is a standalone React + TypeScript dashboard for comparing OpenAI models without flattening them into a fake universal leaderboard.

## Included models

- GPT-5.4
- GPT-5.4-Mini
- GPT-5.3-Codex
- GPT-5.2-Codex
- GPT-5.2
- GPT-5.1-Codex-Max
- GPT-5.1-Codex-Mini

## Experience

- Orbital Atlas for model discovery
- Task Mixer with presets and a task heatmap
- Tradeoff Scanner for chart-based comparisons
- Evidence Console with metric-level citations

## Source snapshot

All facts in the bundled dataset are manually curated from official OpenAI model pages, docs, and launch posts, checked on `2026-04-02`.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run test:run
npm run build
```
