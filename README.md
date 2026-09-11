<div align="center">

<img src="./docs/assets/qubitlab-banner.svg" alt="QubitLab — interactive quantum computing learning platform" width="100%" />

# QubitLab

### Learn quantum computing by actually playing with it.

Build a circuit. See what changes. Understand the result. Test yourself.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/deployment-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

[Features](#features) · [How it works](#how-it-works) · [Architecture](#architecture) · [Getting started](#getting-started) · [Deployment](#deployment)

</div>

---

## What is QubitLab?

Quantum computing is much easier to understand when you can **see what the math is doing**.

QubitLab is a browser-based learning platform built around that idea. Instead of reading about a quantum gate and moving on, you can put the gate into a circuit, simulate it, inspect the resulting state, visualize it, and then test what you learned.

The basic loop is simple:

```text
        LEARN
          ↓
        BUILD
          ↓
       SIMULATE
          ↓
      VISUALIZE
          ↓
       PRACTICE
          ↓
        REPEAT
```

It is deliberately a small learning lab, not a replacement for real quantum hardware or large-scale simulation software.

---

## Why was it built?

A lot of beginner quantum-computing material quickly turns into formulas, matrices, gates, probabilities, and notation. Those pieces make sense individually, but connecting them is where things get difficult.

QubitLab tries to make that connection visible.

Change a gate and the simulated state changes. Explore the result from more than one view. Then use the practice section to check whether the idea actually stuck.

The goal is simple: **make quantum computing something you can interact with, not just something you read about.**

---

# Features

## Learn

- Structured quantum-computing curriculum
- Foundations, core concepts, gates and circuits, mathematics, and algorithms
- Learning objectives for each topic
- Topic difficulty, duration, and prerequisites

## Build circuits

The Circuit Composer is where the theory becomes hands-on.

- 1–5 configurable qubits
- 4–12 configurable circuit steps
- `H`, `X`, `Y`, `Z`, `S`, `T`, `Rx`, `Ry`, `Rz`
- `S†` and `T†`
- `CNOT` and `CZ`
- `SWAP` and `CCNOT`
- Measurement markers
- Multi-qubit gate placement validation
- Bell, GHZ, Superposition, Grover, Deutsch, and Teleportation presets
- Step-by-step circuit scrubbing
- Clear and reset controls

## Simulate

The circuit is connected to a client-side state-vector simulator, so the circuit diagram is backed by an actual calculation rather than being only a visual mock-up.

It supports:

- Complex amplitudes
- State-vector evolution
- Gate-by-gate simulation
- Basis-state probabilities
- Measurement-shot sampling
- Numerical state normalization
- Bloch-vector extraction
- Dirac notation
- Entanglement-aware inspection

## Visualize

The same result can be explored from several angles:

- State-vector amplitudes
- Probabilities
- Relative phase
- Measurement histograms
- Dirac notation
- Bloch-sphere visualization
- Interactive 3D views using Three.js/WebGL

## Export

Circuits can be exported as educational code for:

- **Qiskit**
- **PennyLane**
- **Cirq**
- **OpenQASM**

Generated code is meant to help with learning and experimentation. It should still be checked against the SDK or compiler version you plan to use.

## Practice and progress

- Module-based MCQs
- Immediate feedback and explanations
- Score calculation
- Best-score tracking for the current browser session
- Session-based learner progress
- Dashboard summaries

---

# The Local Learning Guide

One of the changes made during debugging was moving the main tutor experience away from a required external AI service.

The current guide is an **offline, deterministic knowledge system**. It uses the curriculum and quiz material bundled with the application, together with a compact technical knowledge base, to find relevant information and build a response.

```text
curriculum.ts ──────┐
                    ├──> localTutor.ts ──> Local Guide
mockQuizzes.ts ─────┘
```

That means the main guide:

- works without an API key
- does not need a network request
- responds quickly
- behaves predictably
- stays connected to the project's own learning material

### What it is not

It is **not a full generative LLM**. It has a finite knowledge base and cannot answer every possible question or provide current information from the web.

That is intentional. The guide is designed to be useful and available offline rather than pretending to have unlimited knowledge.

The repository still contains an optional server/API path for deployments that want model-backed responses, but the main tutor interface does not depend on it.

---

# How it works

## 1. Start with a concept

Choose a topic from the curriculum. Each topic includes the material, learning objectives, difficulty, and prerequisites used by the learning flow.

## 2. Build something

Open the Circuit Composer and place gates on the qubit wires.

A simple Bell-state circuit looks like this:

```text
q₀ ── H ──●────
          │
q₁ ───────X────
```

The composer keeps track of qubits, circuit steps, gate placement, and multi-qubit relationships.

## 3. Simulate

Whenever the circuit changes, the current circuit is passed through the quantum engine.

```text
Circuit
   ↓
Check gate placement
   ↓
Initialize |00...0⟩
   ↓
Apply gates in order
   ↓
Normalize numerical state
   ↓
Calculate probabilities
   ↓
Sample measurements
   ↓
SimulationResult
```

The circuit and the displayed results therefore come from the same underlying state calculation.

## 4. Understand the result

You can inspect the result through amplitudes, probabilities, measurement shots, Dirac notation, and Bloch-sphere information.

The idea is to make questions like these easier to answer:

> What changed after the H gate?
>
> Why are the measurement probabilities different?
>
> What did the CNOT do to the two-qubit state?

## 5. Practice

Once the concept makes sense, return to the practice modules and check your understanding.

```mermaid
flowchart LR
    A[Learn] --> B[Build]
    B --> C[Simulate]
    C --> D[Visualize]
    D --> E[Practice]
    E --> A
```

---

# Architecture

Most of QubitLab runs directly in the browser.

```mermaid
flowchart TB
    USER[User] --> APP[React + TypeScript]

    APP --> CUR[Curriculum]
    APP --> CIR[Circuit Composer]
    APP --> VIS[Visualization]
    APP --> SANDBOX[Quantum Code Sandbox]
    APP --> QUIZ[Practice]
    APP --> DASH[Dashboard]
    APP --> GUIDE[Local Guide]

    CUR --> CDATA[(curriculum.ts)]
    QUIZ --> QDATA[(mockQuizzes.ts)]

    CIR --> ENGINE[Quantum Engine]
    ENGINE --> RESULT[Simulation Result]
    RESULT --> VIS
    RESULT --> BLOCH[Bloch / State Views]

    GUIDE --> LOCAL[localTutor.ts]
    LOCAL --> CDATA
    LOCAL --> QDATA

    APP --> SESSION[(sessionStorage)]
    QUIZ --> SESSION
    DASH --> SESSION

    OPTIONAL[Optional API path] --> PROVIDER[External model provider]
```

### What each part does

| Location | Job |
|---|---|
| `src/components/` | UI and feature components |
| `src/data/` | Curriculum and quiz content |
| `src/types/` | Shared TypeScript types |
| `src/utils/quantumEngine.ts` | State-vector simulation and quantum operations |
| `src/utils/localTutor.ts` | Offline knowledge retrieval and responses |
| `src/utils/progress.ts` | Session-based progress |
| `api/chat.ts` | Optional model-backed API endpoint |
| `server/index.ts` | Optional Express/Vite runtime |
| `vercel.json` | Vercel build and SPA routing |

---

# Circuit Simulation

```mermaid
sequenceDiagram
    participant User
    participant Composer as Circuit Composer
    participant Engine as Quantum Engine
    participant UI as Visualizations

    User->>Composer: Add or change a gate
    Composer->>Composer: Validate placement
    Composer->>Engine: Simulate circuit
    Engine->>Engine: Initialize statevector
    Engine->>Engine: Apply gates in order
    Engine->>Engine: Normalize state
    Engine->>Engine: Calculate probabilities
    Engine->>Engine: Generate measurement shots
    Engine-->>Composer: SimulationResult
    Composer->>UI: Update state data
    UI-->>User: Updated visualization
```

The circuit diagram is not treated as a separate animation. The visual result is driven by the simulated state.

---

# Quantum Engine

The simulation core lives in:

```text
src/utils/quantumEngine.ts
```

| Category | Operations |
|---|---|
| Basic | `H`, `X`, `Y`, `Z` |
| Phase | `S`, `S†`, `T`, `T†` |
| Rotations | `Rx(θ)`, `Ry(θ)`, `Rz(θ)` |
| Controlled | `CNOT`, `CZ` |
| Multi-qubit | `SWAP`, `CCNOT` |
| Analysis | amplitudes, probabilities, phases, Bloch vectors |
| Measurement | shot sampling and histograms |
| Export | Qiskit, PennyLane, Cirq, OpenQASM |

Rotation gates use the standard half-angle convention. For example:

```text
Rx(θ) = cos(θ/2) I − i sin(θ/2) X
```

The engine also normalizes the state after numerical evolution to reduce floating-point drift.

---

# Session Data

Learner progress is intentionally stored in `sessionStorage`.

```mermaid
flowchart LR
    ACTION[User action] --> STATE[Application state]
    STATE --> STORAGE[(sessionStorage)]
    STORAGE --> RELOAD[Page reload]
    RELOAD --> RESTORE[Restore valid state]
```

| Situation | Behavior |
|---|---|
| Navigate around the app | Current progress stays available |
| Reload the page | Valid session state is restored |
| New browser session | Starts with fresh session data |
| Account login | Not implemented |
| Cloud sync | Not implemented |

This keeps the project simple and avoids pretending that it currently has a cloud account system.

---

# Project Structure

```text
Qubit_Lab/
│
├── api/
│   └── chat.ts                   # Optional model-backed API
│
├── docs/
│   └── assets/
│       └── qubitlab-banner.svg   # README/project visual
│
├── server/
│   └── index.ts                  # Optional Express + Vite server
│
├── src/
│   ├── components/
│   │   ├── bloch/                # Bloch-sphere visualization
│   │   ├── chat/                 # Local learning guide
│   │   ├── circuit/              # Circuit composer
│   │   ├── curriculum/           # Curriculum UI
│   │   ├── dashboard/            # Learner dashboard
│   │   ├── landing/              # Landing page
│   │   ├── layout/               # Shared layout/navigation
│   │   ├── quiz/                 # Practice modules
│   │   ├── sandbox/               # Quantum code exploration
│   │   └── visualization/         # State/probability views
│   │
│   ├── data/
│   │   ├── curriculum.ts         # Learning content
│   │   └── mockQuizzes.ts        # Quiz content
│   │
│   ├── types/
│   │   └── quantum.ts            # Domain types
│   │
│   ├── utils/
│   │   ├── localTutor.ts         # Offline tutor logic
│   │   ├── progress.ts            # Session progress
│   │   └── quantumEngine.ts       # Simulation core
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── metadata.json
├── package.json
├── bun.lock
├── tsconfig.json
├── vercel.json
├── vite.config.ts
└── README.md
```

---

# Tech Stack

| Technology | Why it is here |
|---|---|
| **React 19** | Interactive application UI |
| **TypeScript 5.8** | Type-safe UI and simulation logic |
| **Vite 6** | Development and production builds |
| **Tailwind CSS 4** | Application styling |
| **Motion** | UI animation and interaction |
| **Three.js** | 3D quantum visualization |
| **Lucide React** | Interface icons |
| **Express** | Optional server runtime |
| **Google GenAI** | Optional model integration |
| **Vercel** | Current deployment target |

---

# Getting Started

## Requirements

- Node.js 18+
- npm

Check your versions:

```bash
node --version
npm --version
```

## Clone

```bash
git clone https://github.com/chamanvashishth/Qubit_Lab.git
cd Qubit_Lab
```

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

---

# Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Type-check the project with TypeScript |
| `npm run build` | Build the frontend into `dist/` |
| `npm run start` | Preview the built frontend with Vite |
| `npm run build:server` | Build the frontend and optional Express server bundle |
| `npm run clean` | Remove the `dist/` directory |

A useful baseline check before pushing a change is:

```bash
npm run lint
npm run build
```

For changes to the circuit engine, also test a few small circuits manually. Quantum code can look perfectly reasonable while still producing the wrong state.

---

# Deployment

## Vercel

**Vercel is the current deployment path for QubitLab.**

The repository contains `vercel.json` with the Vite build and SPA fallback configuration.

```mermaid
flowchart LR
    GITHUB[Git repository] --> VERCEL[Vercel]
    VERCEL --> INSTALL[npm install]
    INSTALL --> BUILD[npm run build]
    BUILD --> DIST[dist/]
    DIST --> APP[QubitLab]
    APP --> USER[Browser]
```

Current build settings:

```text
Framework:      Vite
Build command:  npm run build
Output:         dist
```

The SPA rewrite sends normal application routes to `index.html` while keeping API routes available for server-side handling.

### GitHub Pages

GitHub Pages is **not** used for the current deployment. The old Pages workflow was removed because it did not match the current Vercel-based setup.

---

# Optional API Configuration

The main local learning guide does not need any API credentials.

If you intentionally enable the optional model-backed API path, configure the required provider credential through your deployment platform's **environment variables**.

For local development, use an untracked environment file such as `.env.local` and never place the actual credential in source code, README files, screenshots, commit messages, or frontend JavaScript.

**Never commit API keys, tokens, passwords, private URLs, or other secrets to Git.**

The server-side API code keeps provider credentials on the server side and distinguishes different credential formats before sending requests to an external model provider.

---

# Security Notes

This README intentionally does not contain:

- API keys or token values
- passwords or private credentials
- deployment secrets
- private environment-variable values
- personal contact information
- private infrastructure details

If you are contributing, check your diff before pushing:

```bash
git diff --check
git status
```

Also make sure local environment files remain ignored and that secrets are configured through the hosting provider rather than committed to the repository.

---

# What changed during debugging?

The project went through a practical cleanup rather than only a visual rewrite.

### Quantum simulation

- Fixed the `Rx(θ)` matrix implementation.
- Added `Ry` and `Rz` rotations.
- Added `S†` and `T†`.
- Improved controlled-gate handling.
- Added SWAP and Toffoli support.
- Added state normalization after simulation.
- Improved measurement sampling and state analysis.

### Circuit Composer

- Made simulation update with circuit edits.
- Added dynamic qubit and circuit-step sizing.
- Added multi-qubit collision and placement checks.
- Added live probability and measurement views.
- Added Dirac notation and entanglement inspection.
- Added circuit presets and step scrubbing.
- Added exports for Qiskit, PennyLane, Cirq, and OpenQASM.

### Learning experience

- Made curriculum and quiz data drive the learning flow.
- Added session-based progress behavior.
- Added a local tutor backed by the application's syllabus.
- Removed the main tutor UI's dependency on the model API.

### Deployment and API cleanup

- Removed the obsolete GitHub Pages deployment workflow.
- Kept Vercel as the documented deployment target.
- Hardened optional AI credential handling.
- Avoided exposing credential details in the client application.

---

# Known Limits

A few limits are worth being clear about.

### Small simulations by design

State-vector simulation grows exponentially with the number of qubits. The interactive composer therefore stays within **1–5 qubits**.

### The local guide has a finite knowledge base

It can answer from the material bundled with QubitLab, but it cannot know new web information, private data, or every question a user might ask.

### Progress is session-based

There is no account system or cross-device synchronization yet.

### Exported code needs validation

Generated Qiskit, PennyLane, Cirq, and OpenQASM code is intended as educational/export material. Validate it against the version of the SDK or compiler you are actually using.

---

# Roadmap

The next useful improvements are mostly about making the existing learning loop better:

- More curriculum modules and worked examples
- More algorithm and circuit challenges
- Stronger automated tests for the quantum engine
- Component and integration tests
- Better circuit-specific explanations in the local guide
- Optional learner accounts
- Cross-device progress synchronization
- More SDK export coverage
- More visualization modes

---

# Contributing

Contributions are welcome. Keep changes focused so they are easy to understand and review.

1. Fork the repository.
2. Create a branch:

```bash
git checkout -b feature/your-change
```

3. Make your change.
4. Run:

```bash
npm run lint
npm run build
```

5. If you changed an interactive feature, test it in the browser.
6. If you changed the quantum engine, include a small circuit or mathematical case that demonstrates the expected result.
7. Make sure no secrets were added.
8. Open a pull request explaining what changed, why it changed, and how you tested it.

---

# License

There is currently no `LICENSE` file in the repository.

If the project is going to be distributed as an open-source project, add an appropriate license before defining reuse or redistribution rights.

---

<div align="center">

**Learn · Build · Simulate · Visualize · Practice**

A small quantum lab for making the theory easier to see.

</div>