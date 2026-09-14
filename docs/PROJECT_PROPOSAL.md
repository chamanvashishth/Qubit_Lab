# QubitLab — Project Proposal

## Interactive Quantum Computing Learning Platform

### Selection Process

## 1. Project Objective

QubitLab is designed to make quantum computing easier to approach by connecting concepts with hands-on experimentation. The platform brings curriculum, circuit construction, small-scale simulation, visualization, quizzes and a rule-based adaptive learning path into one browser-based workspace.

### Primary objectives

- Help beginners understand quantum concepts without requiring advanced programming knowledge.
- Let learners build and test circuits instead of learning gates and notation only from static explanations.
- Show how gates change amplitudes, probabilities, phase and observable measurement outcomes.
- Use quiz results, prediction performance and experiment checks to recommend what a learner should work on next.
- Provide a practical bridge from foundational learning to mainstream quantum SDK workflows through educational exports.

The adaptive layer is intentionally rule-based in the current version. It uses learner goals, prerequisite mastery, quiz performance and prediction results rather than claiming a black-box AI model.

## 2. Problem Statement / Need for the Solution

Quantum computing is important but difficult for many students to approach. Qubits, superposition, phase, entanglement and quantum gates combine mathematical notation with behavior that is hard to see directly. A learner can memorize a definition and still be unsure what a circuit actually does.

| Problem | QubitLab response |
|---|---|
| Abstract quantum concepts | Interactive state, probability, phase and visualization feedback. |
| Theory separated from practice | Learn a concept and immediately build or inspect a circuit. |
| High beginner entry barrier | Small browser-first simulator and guided missions. |
| Same path for every learner | Goal, prerequisite and performance signals influence the next recommended concept. |
| Weak immediate feedback | Prediction-before-run experiments, quiz results and evidence views. |

## 3. Key Features

### Adaptive Learning Path
A learner profile captures goal and background. Prerequisites, mastery and performance signals are used to choose the next concept.

### Interactive Curriculum
Structured topics cover foundations, concepts, gates, mathematics and algorithms, with objectives and prerequisites.

### Circuit Composer
A visual circuit environment supports small quantum circuits, single- and multi-qubit gates, presets and placement validation.

### Local Quantum Simulation
A browser-based state-vector engine calculates amplitudes, probabilities, normalization and measurement sampling for small circuits.

### State and Probability Views
Dirac notation, basis-state amplitudes, probabilities and measurement histograms make simulation results inspectable.

### Bloch-Sphere and 3D Visualization
Single-qubit state changes can be explored geometrically through Bloch-sphere views.

### Guided Experiments
Learners predict an outcome before running a predefined mission and compare their prediction with simulated evidence.

### Quizzes and Progress
Practice results update learning signals while the dashboard shows mastery, prediction accuracy and lab activity.

### Learning Guide
A deterministic local guide provides grounded explanations for core quantum topics. An optional model-backed API path exists separately for broader responses.

### Framework Exports
Educational circuit exports are available for Qiskit, PennyLane, Cirq and OpenQASM.

## Learning Flow

**Diagnose → Predict → Experiment → Explain → Verify → Adapt**

1. The learner selects a goal and gives a simple background profile.
2. QubitLab chooses an appropriate starting concept using prerequisites and learner signals.
3. The learner predicts what a small circuit will do.
4. The local quantum engine runs the circuit and produces evidence.
5. The learner compares the prediction with the result and can review the concept.
6. Mastery and performance signals are updated and the next recommendation changes accordingly.

## Platform Architecture

```text
Learner
   ↓
Adaptive Learning Engine
   │  goals • prerequisites • mastery • misconceptions • performance
   ↓
React Learning Workspace
   │  curriculum • composer • visualization • quizzes • guide
   ↓
Quantum Engine
   │  state vector • gates • normalization • probabilities • sampling
   ↓
Result / Visual Layer
   │  Dirac notation • state views • histograms • Bloch / 3D
   ↓
Optional API
   └─ model-backed responses / future external services
```

The core simulation is browser-first and does not require a quantum backend. The adaptive system is explainable and rule-based in the current MVP.

## Feasibility and Scope

The adaptive proposal is reasonable to implement because it builds on data already present in QubitLab rather than requiring a large ML infrastructure. The current implementation uses learner goals, concept prerequisites, mastery values, quiz outcomes and guided prediction results.

Important scope boundaries:

- This is adaptive learning logic, not a trained machine-learning personalization model.
- The simulator is intentionally small-scale and browser-friendly.
- The local guide is deterministic rather than an unlimited generative AI system.
- Cloud accounts, cloud progress synchronization and physical quantum hardware control are not part of the current MVP.

## Project Screenshots

The selection-process PDF contains four interface captures from the supplied QubitLab project materials, covering the main application interface, circuit-building workflow, composer controls/gate palette and state-vector evidence.

## Proposal Deliverable

The complete formatted selection-process proposal is provided as:

`QubitLab_Project_Proposal_Selection_Process.pdf`

The PDF uses a classical Times-style presentation, black typography, compact spacing, four project screenshots and the architecture described above.
