# Interactive Storytelling Platform Project Structure

```
/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── dto/
│   │   ├── middleware/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── test/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   └── tsconfig.json
├── cypress/
│   └── integration/
├── docs/
│   ├── api.md
│   └── user-guide.md
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
├── deploy-gcp.sh
├── README.md
└── lessons_learned.md
```

This structure accommodates the requirements specified in the sprint and tech stack files:

1. Frontend (React with TypeScript)
2. Backend (NestJS with TypeScript)
3. Testing directories for both frontend and backend
4. Cypress for E2E testing
5. Documentation folder
6. Docker and CI/CD configuration files
7. Deployment script for GCP
