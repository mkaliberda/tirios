## Entities structure (required)
FOLLOW eslint rules!

pages/<name>/
  components/
  MainComponenst.jsx

shared/
  components/
  styles/

entities/<name>/
  api/
    request.ts      # raw HTTP calls
  lib/
    api-hooks.ts    # React Query hooks
    keys.ts         # React Query keys
    utils.ts        # helper utils for this entity
  stores/
    name-store.ts   # zustand store(s)
  model/
    model-types.ts  # public types/enums used by other layers
  index.ts          # public exports

## Entities export conventions (required)

- Prefer exported arrow constants over exported function declarations.
- Use `export const someFn = (...) => {}`.
- For async entity API calls, use `export const fetchItems = async (...) => {}`.
