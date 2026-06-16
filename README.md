# Factorial N Academy

Factorial N Academy is a React and Firebase prototype for a STEM learning platform with separate student and educator experiences.

The project focuses on onboarding, classroom setup, assignment workflows, and a simple dashboard structure for both students and teachers. It uses Firebase Auth, Firestore, and Storage for the backend, with Firebase emulators for local development.

## Project Status

This is a working prototype, not a production deployment. The main app flows are implemented with local Firebase emulator support.

Implemented:

- Student signup, login, onboarding, goal selection, dashboard, assignments, and grades
- Teacher signup, login, onboarding, classroom dashboard, modules, assignments, quizzes, and analytics
- Account settings, password reset, and email verification support
- Firebase Auth integration for student and teacher accounts
- Firestore-backed classrooms, modules, assignments, submissions, analytics, and profile data
- Firebase Storage support for assignment resources and student submissions
- Firestore and Storage security rules
- Docker Compose setup for local development
- Seed script for demo teachers, students, classrooms, modules, assignments, and grades

## Tech Stack

- React
- Vite
- React Router
- Firebase Auth
- Cloud Firestore
- Firebase Storage
- Firebase Emulator Suite
- Docker Compose
- ESLint

## Main User Flows

### Student

Students can create an account, complete onboarding, choose goals, join classrooms using a join code, view modules, see assignments, submit work, and review grades.

Key routes:

- `/student`
- `/student/signup`
- `/student/login`
- `/student/intro`
- `/onboarding`
- `/goals`
- `/student/dashboard`
- `/student/modules`
- `/student/assignments`
- `/student/grades`

### Teacher

Teachers can create an educator account, complete profile setup, view classroom dashboards, create classrooms, manage modules, post assignments, create quizzes, and review analytics.

Key routes:

- `/teacher`
- `/signup`
- `/login`
- `/intro`
- `/teacher-profile`
- `/teacher-experience`
- `/teacher-tutorial`
- `/dashboard`
- `/classroom/:classroomId`
- `/modules`
- `/assignments`
- `/quizzes`
- `/analytics`

### Shared Account Routes

- `/`
- `/account`
- `/password-reset`

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Start Firebase emulators:

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

Open:

```txt
http://localhost:5173
```

Firebase Emulator UI:

```txt
http://localhost:4000
```

## Demo Accounts

```txt
Teacher: teacher@factorialn.test / password123
Student: student1@factorialn.test / password123
```

## Docker Setup

Start the app and Firebase emulators with Docker:

```bash
npm run docker:dev
```

Seed the Docker emulator environment:

```bash
npm run docker:seed
```

Open:

- App: `http://localhost:5173`
- Emulator UI: `http://localhost:4000`

## Project Structure

```txt
src/
  components/    Reusable UI components
  lib/           Firebase initialization
  pages/         Route-level React pages
  services/      Firebase and mock service adapters
  App.jsx        App routing
  App.css        Main app styling

docs/
  backend-plan.md      Backend planning notes
  backend-readme.md    Firebase architecture and data model

scripts/
  seedEmulators.js     Local emulator seed data

firestore.rules        Firestore security rules
storage.rules          Firebase Storage rules
firebase.json          Firebase emulator configuration
docker-compose.yml     Docker local development setup
```

## Backend Overview

The app uses Firebase directly from the React frontend.

Main collections:

- `users`
- `teachers`
- `students`
- `classrooms`
- `classroomJoinCodes`
- `modules`
- `assignments`
- `quizzes`
- `submissions`
- `analytics`

The security model is role-based:

- Teachers can manage only classrooms they own.
- Students can read only classrooms they belong to.
- Students can submit work only for assignments in their classrooms.
- Students can read only their own submissions.
- Teachers can read and grade submissions for their classrooms.

More detail is in [docs/backend-readme.md](docs/backend-readme.md).

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run emulators
npm run seed:emulators
npm run docker:dev
npm run docker:seed
```

## Development Notes

- The UI intentionally stays simple and white-space heavy to match the Factorial N Academy onboarding mockups.
- Mock services exist as a fallback, but Firebase is the main backend path.
- Local `.env` files are ignored and should not be committed.
- The current bundle-size message from Vite is a warning, not a build failure.

## Next Steps

Possible future improvements:

- Deploy the app with production Firebase configuration
- Add teacher grading UI for submitted assignments
- Add classroom join-code entry earlier in the student flow
- Add richer module and lesson editing screens
- Split large frontend bundles with dynamic imports
- Add automated tests for Firebase service adapters
