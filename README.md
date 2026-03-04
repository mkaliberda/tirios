## Run in Development

Start local development stack:

`docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

When services are up:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

Notes:


- Unit tests (inside `backend/`):
  - `npm test`
  - or `npm run test:unit`
  - artifact mode: `npm run test:unit:artifacts` (writes `artifacts/backend-unit-jest.json`)
- Functional API tests with Docker Compose:
  - `docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.test.yml up --build --abort-on-container-exit functional-tests`
  - Artifacts are written to `artifacts/backend-functional-jest.json` and `artifacts/docker-functional.log`

### Docker test helper

- Run both backend suites (unit first, then functional):
  - `./run-docker-tests.sh`
- Artifacts produced by the helper:
  - `artifacts/backend-unit-jest.json`
  - `artifacts/backend-functional-jest.json`
  - `artifacts/docker-functional.log`
