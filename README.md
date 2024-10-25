# Interactive Storytelling Platform

This project is an Interactive Storytelling Platform with a NestJS backend API and a React frontend, using PostgreSQL for the database.

## Current Sprint: Core Storytelling Functionality

### Sprint Goals
1. Implement the basic interactive storytelling feature
2. Create a story creation interface for authors
3. Develop a story visualization tool

### User Stories
1. As a user, I can start a new story and see the first segment with multiple choice options.
2. As a user, I can make choices in the story and see the next segment based on my choice.
3. As a story creator, I can create new story segments with choices.
4. As a story creator, I can link story segments together.
5. As a story creator, I can view a visual representation of my story structure.

## Tech Stack

### Backend
- NestJS with TypeScript
- PostgreSQL for database
- TypeORM for ORM
- Jest for unit and integration testing

### Frontend
- React 17 with TypeScript
- Material-UI for styling
- Axios for API calls
- Jest and React Testing Library for unit testing
- Cypress for E2E testing

### DevOps
- Docker and docker-compose for containerization
- GitHub Actions for CI/CD (to be implemented)
- GCP for cloud deployment (to be implemented)

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/interactive-storytelling-platform.git
   cd interactive-storytelling-platform
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

3. The frontend will be available at `http://localhost:3000`
4. The backend API will be available at `http://localhost:3001`

## Development

The Docker setup includes hot-reloading for both frontend and backend, so you can make changes to the code and see them reflected immediately.

### VS Code Debugging

For backend debugging:
1. Ensure the containers are running (`docker-compose up`)
2. In VS Code, go to the Debug view
3. Select "Attach to Backend" from the dropdown
4. Click the "Start Debugging" button (or press F5)

You can now set breakpoints in your backend code and debug as usual.

## API Documentation

Once the application is running, you can access the Swagger API documentation at `http://localhost:3001/api`.

## Running Tests

### Backend Tests

To run backend tests:
```
docker-compose run backend npm test
```

This will run all unit tests for the backend. You should see output indicating which tests have passed or failed.

To run tests with coverage information:
```
docker-compose run backend npm run test:cov
```

To run a specific test file:
```
docker-compose run backend npm test -- path/to/test-file.spec.ts
```

### Frontend Tests

To run frontend unit tests:
```
docker-compose run frontend npm test
```

To run Cypress E2E tests:
```
docker-compose run frontend npm run test:e2e
```

To run Cypress E2E tests locally:
```
cd frontend && npx cypress run --spec "cypress/integration/main_user_flows.cy.js"
```

## Deployment

The application is set up for deployment to Google Cloud Platform (GCP) using Google Cloud Run. The deployment process is automated using GitHub Actions.

### Prerequisites for Deployment

1. A Google Cloud Platform account with billing enabled
2. A GCP project created for this application
3. Google Cloud SDK installed and configured locally
4. Docker installed locally

### Deployment Process

1. Ensure all changes are committed and pushed to the `main` branch on GitHub.
2. The GitHub Actions workflow will automatically trigger on push to the `main` branch.
3. The workflow will:
   - Run tests for both frontend and backend
   - Build Docker images for production
   - Push the Docker images to Google Container Registry
   - Deploy the images to Google Cloud Run

### Manual Deployment

If you need to deploy manually, you can use the following steps:

1. Build the production Docker images:
   ```
   docker-compose -f docker-compose.prod.yml build
   ```

2. Push the images to Google Container Registry:
   ```
   docker tag interactive-storytelling-frontend:latest gcr.io/[YOUR_PROJECT_ID]/interactive-storytelling-frontend:latest
   docker tag interactive-storytelling-backend:latest gcr.io/[YOUR_PROJECT_ID]/interactive-storytelling-backend:latest
   docker push gcr.io/[YOUR_PROJECT_ID]/interactive-storytelling-frontend:latest
   docker push gcr.io/[YOUR_PROJECT_ID]/interactive-storytelling-backend:latest
   ```

3. Deploy to Google Cloud Run:
   ```
   gcloud run deploy interactive-storytelling-frontend --image gcr.io/[YOUR_PROJECT_ID]/interactive-storytelling-frontend:latest --platform managed --region us-central1 --allow-unauthenticated
   gcloud run deploy interactive-storytelling-backend --image gcr.io/[YOUR_PROJECT_ID]/interactive-storytelling-backend:latest --platform managed --region us-central1 --allow-unauthenticated
   ```

Replace `[YOUR_PROJECT_ID]` with your actual GCP project ID.

### Environment Variables

Ensure that you have set up the following environment variables in your GCP project:

- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`

These should be set as secrets in your GitHub repository for the CI/CD process, and in your GCP project for manual deployments.

## Documentation

- API documentation: Available at `http://localhost:3001/api` when the application is running
- User guide: To be implemented

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
