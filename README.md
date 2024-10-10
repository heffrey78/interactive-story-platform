# Interactive Storytelling Platform

This project is a backend API for an Interactive Storytelling Platform built with NestJS and PostgreSQL.

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

### Backend (Current Focus)
- NestJS with TypeScript
- PostgreSQL for database
- TypeORM for ORM
- Jest for unit and integration testing

### DevOps
- Docker and docker-compose for containerization
- GitHub Actions for CI/CD (to be implemented)
- GCP for cloud deployment (to be implemented)

### Frontend (To be implemented)
- React 18 with TypeScript
- styled-components for styling
- Axios for API calls
- Jest and React Testing Library for unit testing

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/heffrey78/interactive-storytelling-platform.git
   cd interactive-storytelling-platform
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

3. The API will be available at `http://localhost:3000`

## API Documentation

Once the application is running, you can access the Swagger API documentation at `http://localhost:3000/api`.

## Development

To run the application in development mode:

```
docker-compose up
```

This will start the application with hot-reloading enabled.

## Running Tests

(To be implemented)

- Backend tests: `cd backend && npm test`
- E2E tests: `npm run test:e2e`

## Deployment

Deployment instructions to Google Cloud Platform will be added in future sprints.

## Documentation

- API documentation: To be added using Swagger
- User guide: To be implemented

For more detailed information about the project structure and development guidelines, please refer to the `docs` directory (to be implemented).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
