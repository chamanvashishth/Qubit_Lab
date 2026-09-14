<div align="center">

<img src="./docs/assets/qubitlab-banner.svg" alt="QubitLab — interactive quantum computing learning platform" width="100%" />

# QubitLab

### Learn quantum computing by actually working with it.

Build a circuit. Run it. See the state change. Understand why. Test yourself.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/deployment-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

[Overview](#overview) · [Features](#features) · [How it works](#how-it-works) · [Architecture](#architecture) · [Setup](#getting-started) · [Security](#security) · [Deployment](#deployment)

</div>

---

## Overview

QubitLab is a browser-based learning platform for exploring quantum computing through interaction rather than theory alone.

The idea is straightforward: learn a concept, build a small circuit, simulate it, inspect the result, and then use practice questions to check whether the concept actually makes sense.

```text
LEARN → BUILD → SIMULATE → VISUALIZE → PRACTICE
  ↑                                             ↓
  └─────────────────────────────────────────────┘
```

It is designed as a learning lab. It is not intended to replace real quantum hardware, production quantum SDKs, or large-scale scientific simulators.

### Why QubitLab?

Quantum computing becomes difficult for beginners when the connection between the math and the circuit is hard to see.

QubitLab tries to make that connection visible:

- change a gate and see the state change
- inspect amplitudes and probabilities instead of only reading formulas
- view the same state through different visualizations
- experiment with common circuits and presets
- practice the concepts immediately after exploring them

The goal is not to hide the mathematics. It is to give the mathematics somewhere concrete to live.

---

## Features

### Learn

- Structured quantum-computing curriculum
- Foundations, core concepts, gates and circuits, mathematics, and algorithms
- Learning objectives for each topic
- Topic difficulty, duration, and prerequisites

### Build circuits

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

### Simulate

The Circuit Composer is backed by a client-side state-vector simulator. The displayed state is calculated from the circuit rather than being a visual-only mock-up.

The engine handles:

- Complex amplitudes
- State-vector evolution
- Gate-by-gate simulation
- Basis-state probabilities
- Measurement-shot sampling
- Numerical state normalization
- Bloch-vector extraction
- Dirac notation
- Entanglement-aware inspection

### Visualize

Simulation results can be explored through:

- State-vector amplitudes
- Probabilities
- Relative phase
- Measurement histograms
- Dirac notation
- Bloch-sphere visualization
- Interactive 3D views using Three.js/WebGL

### Export

Circuits can be exported as educational code for:

- **Qiskit**
- **PennyLane**
- **Cirq**
- **OpenQASM**

The generated code is intended for learning and experimentation. Always check it against the SDK or compiler version you plan to use.

### Practice and progress

- Module-based MCQs
- Immediate feedback and explanations
- Score calculation
- Best-score tracking for the current browser session
- Session-based learner progress
- Dashboard summaries

---

## How It Works

### 1. Learn a concept

Pick a topic from the curriculum and start with the underlying idea. Topics include learning objectives, difficulty, duration, and prerequisites.

### 2. Build a circuit

Open the Circuit Composer and place gates on the qubit wires.

For example, a Bell-state circuit can be represented as:

```text
q₀ ── H ──●────
          │
q₁ ───────X────
```

The composer tracks the qubits, circuit steps, gate parameters, and multi-qubit relationships.

### 3. Simulate it

When the circuit changes, the current circuit is passed through the quantum engine.

```text
Circuit
   ↓
Validate gate placement
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

This keeps the circuit view and the result view tied to the same state calculation.

### 4. Inspect the result

The result can be explored through amplitudes, probabilities, phases, measurement shots, Dirac notation, and Bloch-sphere information.

The useful questions are the simple ones:

> What changed after the H gate?
>
> Why did the probabilities change?
>
> What did the CNOT do to the two-qubit state?

### 5. Practice

After experimenting, move to the practice modules and check whether the concept stuck.

```mermaid
flowchart LR
    A[Learn] --> B[Build]
    B --> C[Simulate]
    C --> D[Visualize]
    D --> E[Practice]
    E --> A
```

---

## Architecture

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
    APP --> GUIDE[Local Learning Guide]

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

    OPTIONAL[Optional AI API] --> CF[Cloudflare Pages Function]
    CF --> AIG[Cloudflare AI Gateway]
```

### Main responsibilities

| Location | Responsibility |
|---|---|
| `src/components/` | UI and feature components |
| `src/data/` | Curriculum, quiz, and adaptive-learning content |
| `src/types/` | Shared TypeScript domain types |
| `src/utils/quantumEngine.ts` | State-vector simulation and quantum operations |
| `src/utils/localTutor.ts` | Offline knowledge retrieval and responses |
| `src/utils/progress.ts` | Session-based progress handling |
| `src/utils/adaptive.ts` | Explainable adaptive-learning state and recommendations |
| `functions/api/chat.ts` | Optional Cloudflare Pages AI endpoint |
| `public/_headers` | Cloudflare Pages security and asset-cache headers |
| `wrangler.toml` | Cloudflare Pages local/deployment configuration |

---

## Circuit Simulation

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

## Quantum Engine

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

## The Local Learning Guide

The main tutor experience was changed during debugging so that it no longer requires an external AI service to work.

The current guide is an **offline, deterministic knowledge system**. It uses the curriculum and quiz material bundled with the application, together with a compact technical knowledge base, to find relevant information and build a response.

```text
curriculum.ts ──────┐
                    ├──> localTutor.ts ──> Local Learning Guide
mockQuizzes.ts ─────┘
```

The main guide therefore:

- works without credentials
- does not require a network request
- responds quickly
- behaves predictably
- stays connected to the project's own learning material

### Optional AI path

QubitLab also contains an optional `/api/chat` path implemented as a Cloudflare Pages Function. The core guide does not depend on it.

When enabled, the function calls Cloudflare's AI REST endpoint and keeps the provider credential on the server side. The browser never receives the Cloudflare API token.

### A clear limitation

The local guide is **not a full generative LLM**. It has a finite knowledge base, so it cannot answer every possible question or provide live information from the web.

That limitation is intentional. The goal is to provide a dependable learning aid that works offline rather than pretending to have unlimited knowledge.

---

## Adaptive Learning

QubitLab includes an explainable adaptive-learning MVP.

The engine combines learner goals, prerequisites, mastery, quiz performance, misconceptions, and experiment predictions to recommend the next learning activity.

```text
Onboarding
    ↓
Learner profile
    ↓
Concept graph + prerequisites
    ↓
Mastery / quiz / prediction signals
    ↓
Next-concept recommendation
    ↓
Experiment → feedback → updated mastery
```

This is currently a **rule-based adaptive system**, not a trained machine-learning model. The design keeps the recommendation logic inspectable and makes it possible to evaluate learner interaction data before introducing a statistical model.

---

## Session Data

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
| Navigate around the app | Current progress remains available |
| Reload the page | Valid session state is restored |
| New browser session | Starts with fresh session data |
| Account login | Not implemented |
| Cloud sync | Not implemented |

This keeps the current project simple and avoids presenting a local session system as a cloud account system.

---

## Project Structure

```text
Qubit_Lab/
│
├── functions/
│   └── api/
│       └── chat.ts              # Optional Cloudflare Pages AI function
│
├── docs/
│   └── assets/
│       └── qubitlab-banner.svg  # README/project visual
│
├── public/
│   └── _headers                 # Cloudflare Pages response headers
│
├── src/
│   ├── components/
│   │   ├── adaptive/            # Adaptive learning flow
│   │   ├── bloch/               # Bloch-sphere visualization
│   │   ├── chat/                 # Local learning guide
│   │   ├── circuit/              # Circuit composer
│   │   ├── curriculum/           # Curriculum UI
│   │   ├── dashboard/            # Learner dashboard
│   │   ├── landing/              # Landing page
│   │   ├── layout/               # Shared layout/navigation
│   │   ├── quiz/                 # Practice modules
│   │   ├── sandbox/              # Quantum code exploration
│   │   └── visualization/        # State/probability views
│   │
│   ├── data/
│   │   ├── adaptiveLearning.ts   # Adaptive concept graph
│   │   ├── curriculum.ts         # Learning content
│   │   └── mockQuizzes.ts        # Quiz content
│   │
│   ├── types/
│   │   └── quantum.ts            # Domain types
│   │
│   ├── utils/
│   │   ├── adaptive.ts           # Adaptive state and recommendations
│   │   ├── localTutor.ts          # Offline tutor logic
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
├── tsconfig.json
├── wrangler.toml
├── vite.config.ts
└── README.md
```

---

## Tech Stack

| Technology | Role in the project |
|---|---|
| **React 19** | Interactive application UI |
| **TypeScript 5.8** | Type-safe UI and simulation logic |
| **Vite 6** | Development and production builds |
| **Tailwind CSS 4** | Application styling |
| **Motion** | UI animation and interaction |
| **Three.js** | 3D quantum visualization |
| **Lucide React** | Interface icons |
| **Cloudflare Pages** | Static frontend hosting and Git deployments |
| **Cloudflare Pages Functions** | Optional server-side API endpoint |
| **Cloudflare AI Gateway** | Optional model-backed tutor path |

---

## Getting Started

### Requirements

- Node.js 18+
- npm

Check your versions:

```bash
node --version
npm --version
```

### Clone the repository

```bash
git clone https://github.com/chamanvashishth/Qubit_Lab.git
cd Qubit_Lab
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

### Preview with Cloudflare Pages locally

After building the project:

```bash
npm run preview:cloudflare
```

This uses Wrangler to preview the Pages output and Functions locally.

---

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Type-check the frontend and Pages Function source |
| `npm run build` | Build the frontend into `dist/` |
| `npm run start` | Preview the built frontend with Vite |
| `npm run preview:cloudflare` | Build and preview through Wrangler Pages |
| `npm run deploy:cloudflare` | Build and deploy `dist/` to Cloudflare Pages |
| `npm run clean` | Remove the `dist/` directory |

A useful baseline before pushing a change is:

```bash
npm run lint
npm run build
```

For simulator changes, also test a few small circuits manually. Quantum code can look reasonable while still producing the wrong state, so small known-state checks are worth doing.

---

## Security

QubitLab does not need credentials for its main learning flow.

The public README intentionally does **not** contain API keys, access tokens, passwords, secret values, deployment credentials, or provider-specific credential values.

If the optional Cloudflare AI function is enabled:

1. Configure `CLOUDFLARE_ACCOUNT_ID` as a Pages environment variable.
2. Configure `CLOUDFLARE_API_TOKEN` as an encrypted Pages secret with the permissions required to run the AI REST API.
3. Optionally configure `CLOUDFLARE_AI_MODEL` to select another supported model.
4. Never commit tokens or local secret files.
5. Rotate a credential immediately if it is exposed in source control.

The browser only calls `/api/chat`; the Cloudflare token remains server-side in the Pages Function.

---

## Deployment

### Cloudflare Pages

**Cloudflare Pages is the deployment target for QubitLab.** Cloudflare's React/Vite guidance uses `npm run build` with `dist` as the build directory. Pages also supports GitHub integration, automatic deployments, and preview deployments. urlCloudflare React + Vite deployment guidehttps://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/

#### GitHub integration

In Cloudflare:

1. Open **Workers & Pages**.
2. Create a **Pages** application.
3. Import the `chamanvashishth/Qubit_Lab` GitHub repository.
4. Set the production branch to `main`.
5. Use:

```text
Build command:    npm run build
Build directory:  dist
```

These are the documented React/Vite Pages settings. urlCloudflare Pages build configurationhttps://developers.cloudflare.com/pages/configuration/build-configuration/

Every pushed commit can then trigger a new deployment and pull requests can receive preview deployments through the Git integration. urlCloudflare Pages Git integrationhttps://developers.cloudflare.com/pages/configuration/git-integration/github-integration/

#### Local Wrangler deployment

The repository includes `wrangler.toml` and Wrangler scripts for Cloudflare-native local preview and deployment.

```bash
npm run preview:cloudflare
npm run deploy:cloudflare
```

The Wrangler configuration points Cloudflare Pages at `dist/` as the build output.

#### Optional AI function

The optional `/api/chat` endpoint is implemented under `functions/api/chat.ts` using the Cloudflare Pages Functions runtime. Pages Functions are the Cloudflare-native way to add server-side behavior without maintaining an Express server. urlCloudflare Pages Functions documentationhttps://developers.cloudflare.com/pages/functions/

The function uses Cloudflare's AI REST API rather than a Vercel-specific gateway or an Express server. Cloudflare documents the OpenAI-compatible `/ai/v1/chat/completions` endpoint for model-backed applications. urlCloudflare AI Gateway REST APIhttps://developers.cloudflare.com/ai-gateway/usage/rest-api/

#### Cloudflare environment configuration

For the optional AI endpoint, configure these values in **Workers & Pages → Settings → Variables and Secrets**:

```text
CLOUDFLARE_ACCOUNT_ID  = your Cloudflare account ID
CLOUDFLARE_API_TOKEN   = encrypted API token
CLOUDFLARE_AI_MODEL    = google-ai-studio/gemini-2.5-flash   # optional
```

Cloudflare Pages Functions access environment variables and secrets through the function runtime rather than exposing them to the browser. urlCloudflare Pages bindings and secretshttps://developers.cloudflare.com/pages/functions/bindings/

### GitHub Pages

GitHub Pages is **not** used for the current deployment. The old GitHub Pages workflow was removed because QubitLab is now structured for Cloudflare Pages.

---

## What Was Fixed During Debugging?

This section records the important engineering changes rather than pretending the project started in its current state.

### Quantum simulation

- Corrected the `Rx(θ)` implementation to use the standard half-angle form.
- Added `Ry` and `Rz` rotation support.
- Added inverse phase gates `S†` and `T†`.
- Added controlled and multi-qubit operations including `CNOT`, `CZ`, `SWAP`, and `CCNOT`.
- Added numerical state normalization to reduce floating-point drift.
- Kept measurement sampling separate from the unitary state-evolution calculation.

### Circuit Composer

- Reworked the composer around live simulation results.
- Added dynamic qubit and step controls.
- Added placement validation for multi-qubit gates.
- Added presets for common teaching circuits.
- Added step scrubbing, reset, clear, histogram, Dirac notation, Bloch views, and code export.

### Learning and progress

- Moved the main tutor experience to a local deterministic guide so the core learning flow does not depend on an external model.
- Changed learner progress to session-based storage rather than long-term browser persistence.
- Connected dashboard and practice views to the same session state.
- Added an explainable adaptive-learning MVP using goals, prerequisites, mastery, quiz results, misconceptions, and experiment predictions.

### Deployment

- Removed the Vercel-specific API function.
- Removed the optional Express/Vite production server from the repository deployment path.
- Removed the Vercel deployment configuration.
- Set the Vite base path to `/`, matching a domain-root Cloudflare Pages deployment.
- Added Wrangler configuration for Cloudflare Pages.
- Added Cloudflare Pages security headers and immutable caching for Vite fingerprinted assets.
- Added a Cloudflare Pages Function for the optional model-backed API path.

---

## Known Limits

QubitLab is intentionally scoped as a learning project.

- The simulator is state-vector based and intended for small circuits.
- The Local Learning Guide has a finite knowledge base.
- There is no account system or cloud progress synchronization.
- Exported code is educational and should be checked against the target SDK/compiler version.
- The optional AI function requires Cloudflare account configuration and AI API permissions.
- The adaptive-learning engine is rule-based; it is not a trained machine-learning model.

These are current project boundaries, not features being hidden behind the documentation.

---

## Roadmap

Possible next steps include:

- More quantum algorithms and guided experiments
- More circuit presets and worked examples
- Better local explanations for advanced topics
- More detailed state-transition inspection
- Additional export and interoperability options
- Automated tests for quantum gate and circuit correctness
- Optional persistent accounts and cloud progress
- Evaluation data for future statistical adaptive-learning models

The focus is to improve the learning experience without making the project unnecessarily complicated.

---

## Contributing

Contributions are welcome, especially around quantum correctness, educational content, visualization quality, accessibility, and developer experience.

A practical contribution flow is:

```text
Fork → Branch → Change → Test → Commit → Pull Request
```

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

For simulator changes, include small known-state examples or tests where possible.

---

## Collaborators

- [@chamanvashishth](https://github.com/chamanvashishth)
- [@asharma975565-ship-it](https://github.com/asharma975565-ship-it)
- [@hellovneet](https://github.com/hellovneet)
- [@mehfa1](https://github.com/mehfa1)
- [@narayankr03-gif](https://github.com/narayankr03-gif)

---

## License

No `LICENSE` file is currently included in the repository. Add an explicit license before distributing or reusing the project under open-source terms.

---

<div align="center">

**QubitLab — understand the circuit by seeing what it actually does.**

</div>
