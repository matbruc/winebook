# Winebook Project Memory

## Project Overview
Winebook is a full-stack web application for registering and reviewing wines. Built with React 18 + Create React App (frontend) and Express + MongoDB (backend).

## Key File Locations
- **CLAUDE.md**: `/Users/matbruc/projects/winebook/CLAUDE.md` - Project documentation and commands
- **Backend Entry**: `/api/index.js` and `/api/server.js`
- **Frontend Entry**: `/client/src/index.js` and `/client/src/App.js`
- **API Endpoints**: `/api/routes/` - users, wines, producers, reviews, reports
- **Frontend Components**: `/client/src/components/` - organized by feature

## Memory Files
- **project-structure.md**: Complete project structure, tech stack, API endpoints, and dependency inventory
- **dependency-upgrade-plan.md**: Detailed upgrade recommendations for outdated dependencies

## Completed Upgrades (Priority 1)
1. **react-google-charts**: ^4.0.0 → ^5.2.1 (upgraded)
2. **react-validation**: Removed, replaced with native HTML5 validation
3. **react-router-dom**: ^6.30.3 → ^6.26.0 (updated)
4. **zod**: ^3.23.8 (added)

See `/memory/priority1-completion.md` for detailed completion status.

## Remaining Recommendations
1. **axios ^1.13.6**: Already at latest version (version numbering was unusual but valid)
2. **Long-term**: Migrate to Vite and consider TypeScript

See `/memory/dependency-upgrade-plan.md` for detailed upgrade steps.

## Docker Setup
- MongoDB 6.0, Express API (port 9000), React Client (port 3000)
- Data persisted in Docker volume `mongo-data`
- Environment config via `.env` file

## Test Credentials
- Standard user: testuser@test.com / Test123
- Admin: testadmin@test.com / Test123

## Common Commands
```bash
# Install deps: cd api/client && npm install
cd api && npm start              # Backend port 9000
cd client && npm start            # Frontend port 3000
cd api && npm test                # Run tests
docker-compose up -d              # Start containers
docker-compose down               # Stop containers
```

## Migration Recommendations
1. **Fix version typos** (axios, react-router-dom)
2. **Replace react-validation** with Zod for validation
3. **Upgrade react-google-charts** to 5.x
4. **Long-term**: Migrate to Vite and consider TypeScript

See `/memory/dependency-upgrade-plan.md` for detailed upgrade steps.
