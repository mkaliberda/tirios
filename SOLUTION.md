# Frontend
Because this project is an early version intended to handle a lot of data and has many outdated libraries, the goal was to refactor it.

- Added ESLint to keep the codebase structure consistent in ES6 style
- Replaced react-script with vite
  react-script is not recommended anymore because of the huge dependency tree and vulnerabilities
  vite is lightweight, safe, and modern
- Added react query
- Added tailwind css

- Changed structure
  - moved App.jsx to src folder
  - added pages folder with components folder
  - added shared to store reusable components and methods
  - added entities
    - that represent server entities and provide additional interfaces
    - utilize react-query for reliable API request control

# Backend

- Added DB support to improve performance in search by providing indexes
    It can be normilize, into 2 tables
- Added redis as cache service to improve performance of /stats and items repeated queries
- Added cache for GET /api/items and GET /api/items/:id with 5 min ttl
- added watcher service that follows data source changes and updates DB, invalidates cache, and warms cache
- invalidation added for POST /api/items and for db watcher sync updates
- warm cache strategy added for stats and all items after sync
- added dto for better control
- dto for request validation and response mapping (item/list/stats)
- added unit and functional tests
   tests run with docker and provide output

# Docker
To support different setups for local development and functional environments with one command, see docker-compose files for details.

- added redis service into docker compose for backend and db-sync
- added helper script `./run-docker-dev.sh` for local development
- added helper script `./run-docker-tests.sh` to run unit + functional tests in docker
- tests artifacts are saved into `artifacts/`

Frontend Bugs:
1. **Memory Leak**
   - `Items.js` leaks memory if the component unmounts before fetch completes. Fix it.
 
- done by moving data fetch flow to react-query based architecture, no direct leaking fetch lifecycle

2. **Pagination & Search**
   - Implement paginated list with server‑side search (`q` param). Contribute to both client and server.
  
- done: search by category and name is not case-sensitive
- serach has debounce 300ms
- added storing query and pagination params as QueryParams in browser
- browser keeps data when user opens Item and goes back to Item List

3. **Performance**
   - The list can grow large. Integrate **virtualization** (e.g., `react-window`) to keep UI smooth.

- done with custom scrolling, pagination and react window library

4. **UI/UX Polish**  
   - Feel free to enhance styling, accessibility, and add loading/skeleton states.

- done it looks pretty good now 😎
- polished with some reusable components, did not build a UI library though
- all styles are provided with tailwind css, which is very flexible and well supported by coding agents

Backend issues:

1. **Refactor blocking I/O**  
   - `src/routes/items.js` uses `fs.readFileSync`. Replace with non‑blocking async operations.

- Done 

2. **Performance**  
   - `GET /api/stats` recalculates stats on every request. Cache results, watch file changes, or introduce a smarter strategy.

- Done - it hadle 100k database with 2digit ms latency

3. **Testing**  
   - Add **unit tests** (Jest) for items routes (happy path + error cases).

- Done
