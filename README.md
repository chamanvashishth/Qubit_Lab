# QubitLab

Interactive quantum computing learning platform with circuit composition, Bloch-sphere visualization, code exploration, curriculum content, quizzes, dashboards, and an AI tutor.

## Structure

```text
src/                 React application
├── components/      UI grouped by product domain
│   └── curriculum/  Curriculum explorer and learning modules
├── data/            Static learning data
├── types/           Shared TypeScript types
└── utils/           Quantum simulation utilities

server/              Express API and Vite integration
public/              Static assets
```

## Development

```bash
npm install
npm run dev
```

Configure `GEMINI_API_KEY` locally to enable the AI tutor.

## Checks

```bash
npm run lint
npm run build
```
