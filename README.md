# Factorial N Academy

React + Vite prototype for the Factorial N Academy student and teacher onboarding flows.

The app currently includes:

- Student signup, login, onboarding, and goal selection
- Teacher signup, login, onboarding, classroom dashboard, modules, assignments, analytics
- Firebase Auth, Firestore, and Storage integration with mock fallbacks
- Firebase emulator seed data
- Docker Compose local development setup

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Firebase Emulator Workflow

Start emulators:

```bash
npm run emulators
```

Seed demo data in a second terminal:

```bash
npm run seed:emulators
```

Start the app in a third terminal:

```bash
npm run dev
```

Demo accounts:

```txt
Teacher: teacher@factorialn.test / password123
Student: student1@factorialn.test / password123
```

## Docker Workflow

With Docker Desktop running:

```bash
npm run docker:dev
```

Then seed demo data:

```bash
npm run docker:seed
```

Open:

- App: http://localhost:5173
- Firebase Emulator UI: http://localhost:4000

## Backend Docs

See [docs/backend-readme.md](docs/backend-readme.md) for the Firebase architecture, Docker setup, database collections, rules model, and local development workflow.

## Development Checks

```bash
npm run lint
npm run build
```

## Original Vite Notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
