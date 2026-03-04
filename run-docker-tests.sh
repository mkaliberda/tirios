#!/bin/sh

set -eu

COMPOSE_ARGS="-f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.test.yml"
ARTIFACTS_DIR="./artifacts"

mkdir -p "$ARTIFACTS_DIR"

set +e
docker compose $COMPOSE_ARGS up --build --abort-on-container-exit unit-tests
UNIT_EXIT_CODE=$?

FUNCTIONAL_EXIT_CODE=0
if [ "$UNIT_EXIT_CODE" -eq 0 ]; then
  docker compose $COMPOSE_ARGS up --build --abort-on-container-exit functional-tests
  FUNCTIONAL_EXIT_CODE=$?
fi

TEST_EXIT_CODE=$UNIT_EXIT_CODE
if [ "$TEST_EXIT_CODE" -eq 0 ]; then
  TEST_EXIT_CODE=$FUNCTIONAL_EXIT_CODE
fi
set -e

docker compose $COMPOSE_ARGS logs --no-color > "$ARTIFACTS_DIR/docker-functional.log" 2>&1 || true

docker compose $COMPOSE_ARGS down -v

exit $TEST_EXIT_CODE
