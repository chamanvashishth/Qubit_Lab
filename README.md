# QubitLab

> An interactive quantum computing learning and experimentation platform designed to make quantum concepts easier to understand through hands-on circuits, visualizations, structured learning, quizzes, and guided exploration.

## Overview

Quantum computing can be difficult to learn because it combines mathematics, physics, programming, and abstract concepts. **QubitLab** brings these areas together in one interactive environment.

Instead of only reading about quantum concepts, users can move through a practical learning cycle:

**Learn → Experiment → Visualize → Test → Continue**

The platform combines educational modules with interactive quantum-focused tools so learners can connect theory with experimentation.

---

## Features

### Structured Learning

Explore quantum computing through organized learning modules covering:

- Quantum foundations
- Core quantum concepts
- Mathematical foundations
- Quantum algorithms

### Circuit Lab

Experiment with quantum circuits through an interactive circuit-oriented workspace.

### Bloch Sphere Visualization

Visualize qubit states using Bloch-sphere-based representations to make abstract state concepts easier to explore.

### Quantum Sandbox

Use a dedicated experimental environment for hands-on exploration and interaction.

### Quizzes

Test understanding after learning concepts and reinforce knowledge through assessment.

### Dashboard

Navigate the platform and access learning experiences from a central interface.

### AI-Assisted Learning

QubitLab includes an AI integration layer for interactive assistance. AI functionality requires a valid local `GEMINI_API_KEY`.

---

# How the Project Works

## Step 1 — Application Startup

The application follows this primary flow:

```text
index.html
    ↓
src/main.tsx
    ↓
src/App.tsx
```

- `index.html` provides the browser entry point.
- `src/main.tsx` mounts the React application.
- `src/App.tsx` coordinates the main application experience.

---

## Step 2 — Feature-Based Architecture

The interface is organized by product domain rather than placing every component in one large folder.

```text
src/components/
├── bloch/          Bloch-sphere features
├── chat/           AI/chat experience
├── circuit/        Circuit composition and interaction
├── curriculum/     Learning content
├── dashboard/      Dashboard experience
├── landing/        Landing-page experience
├── layout/         Shared application layout
├── quiz/           Assessment features
├── sandbox/        Experimental workspace
└── visualization/  Quantum visualizations
```

This structure makes individual features easier to locate and extend.

---

## Step 3 — Curriculum Organization

Learning modules are grouped inside the curriculum domain:

```text
src/components/curriculum/modules/
├── FoundationsModule.tsx
├── ConceptsModule.tsx
├── MathModule.tsx
└── AlgorithmsModule.tsx
```

This separates educational content by subject area while keeping related functionality together.

---

## Step 4 — Shared Application Logic

Reusable application resources are separated from UI components:

```text
src/
├── data/    Structured application data
├── types/   Shared TypeScript definitions
└── utils/   Reusable and quantum-related utilities
```

This reduces unnecessary coupling between presentation code and reusable logic.

---

## Step 5 — Server

The backend/server entry point is:

```text
server/index.ts
```

It is responsible for server-side and API-related functionality and integration with the development environment.

---

# Technology Stack

| Area | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Backend | Express |
| Styling | Tailwind CSS |
| Animation | Motion |
| 3D Visualization | Three.js |
| Icons | Lucide React |
| AI Integration | Google GenAI |
| Runtime Tooling | tsx / esbuild |

---

# Project Structure

```text
Qubit_Lab/
│
├── public/                     # Static assets
│
├── server/
│   └── index.ts                # Backend/server entry point
│
├── src/
│   ├── components/
│   │   ├── bloch/
│   │   ├── chat/
│   │   ├── circuit/
│   │   ├── curriculum/
│   │   │   └── modules/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── quiz/
│   │   ├── sandbox/
│   │   └── visualization/
│   │
│   ├── data/                   # Structured application data
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Reusable utilities
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Getting Started

## Prerequisites

Install the following before running the project:

- Node.js 18 or newer recommended
- npm

Check your installation:

```bash
node --version
npm --version
```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/chamanvashishth/Qubit_Lab.git
```

Move into the project directory:

```bash
cd Qubit_Lab
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

This installs the dependencies defined in `package.json`.

---

## Step 3 — Configure Environment Variables

If you want to use AI-assisted functionality, configure your local environment with:

```text
GEMINI_API_KEY=your_api_key_here
```

### Security Notice

Never commit:

- API keys
- Tokens
- Passwords
- Private credentials
- Production secrets

Keep sensitive values in local environment files.

---

## Step 4 — Start Development Mode

```bash
npm run dev
```

After the server starts, open the local URL displayed in your terminal.

---

## Step 5 — Validate the Project

Run TypeScript validation:

```bash
npm run lint
```

---

## Step 6 — Create a Production Build

```bash
npm run build
```

---

# Available Commands

```bash
npm run dev      # Start development mode
npm run lint     # Run TypeScript validation
npm run build    # Create a production build
npm run start    # Run the production server
npm run clean    # Remove generated build output
```

---

# Development Principles

QubitLab follows a practical engineering approach:

- Prefer simple solutions over unnecessary abstractions.
- Reuse existing capabilities before adding dependencies.
- Keep features grouped by product domain.
- Keep reusable logic separate from presentation code where practical.
- Avoid exposing secrets in frontend code or Git history.
- Build incrementally and verify changes before expanding scope.

The objective is **minimum necessary complexity**, not merely minimum lines of code.

---

# Contributing

Contributions, improvements, bug fixes, and feature proposals are welcome.

A recommended workflow:

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run the available checks.
5. Commit with a clear and descriptive message.
6. Open a pull request explaining what changed and why.

Please avoid mixing unrelated changes into one pull request.

---

# Collaborators

QubitLab is developed with collaboration from the following repository members:

| Collaborator | GitHub Username | Role |
|---|---|---|
| **Chaman Vashishth** | `chamanvashishth` | Project Owner & Maintainer |
| **asharma975565-ship-it** | `asharma975565-ship-it` | Collaborator |
| **Vineet Sharma** | `hellovneet` | Collaborator |
| **mehfa1** | `mehfa1` | Collaborator |
| **Narayan Kr** | `narayankr03-gif` | Collaborator |

> **Note:** GitHub collaborator access and Git commit contribution are different concepts. This section lists the collaborators shown in the repository collaboration context provided for this project.

---

# Security

When working on QubitLab:

- Do not commit `.env` files containing secrets.
- Do not expose API keys in frontend code.
- Do not publish passwords, tokens, or credentials.
- Review changes before pushing them to the public repository.
- Report sensitive security issues privately to the project maintainer where possible.

---

# Roadmap

Potential future directions include:

- More quantum algorithms and interactive experiments
- Expanded circuit capabilities
- Improved quantum visualizations
- Additional learning paths
- Progress persistence
- User accounts
- More quizzes and challenge modes
- Broader interoperability with quantum SDKs

---

# License

A license file is not currently defined in the repository.

Before formally distributing the project as open source, add an explicit license that defines how the code can be used, modified, and distributed.

---

# Repository

**GitHub:** https://github.com/chamanvashishth/Qubit_Lab

---

Built as an interactive environment for learning, experimenting with, and visualizing quantum computing.
