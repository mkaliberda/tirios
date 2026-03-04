To run docker in local dev mode run:

`docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

## Backend tests

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
