# Winebook - Dependency Upgrade Plan

## Current State Analysis

### Backend Dependencies (api/package.json) - Current and Good
| Package | Current Version | Status |
|---------|-----------------|--------|
| bcryptjs | ^3.0.3 | Up to date |
| cors | ^2.8.5 | Up to date |
| dotenv | ^16.4.7 | Up to date |
| express | ^4.22.1 | Up to date |
| jsonwebtoken | ^9.0.3 | Up to date |
| mongoose | ^6.13.9 | Up to date (v6 is stable) |
| jest | ^29.7.0 | Up to date |
| supertest | ^7.0.0 | Up to date |
| @babel/preset-env | ^7.26.0 | Up to date |

**Assessment**: Backend dependencies are well-maintained and current. No urgent upgrades needed.

---

### Frontend Dependencies (client/package.json) - Issues Identified

#### 1. react-google-charts - RECOMMENDED: Upgrade
- **Current**: ^4.0.0 (installed: 4.0.7)
- **Latest**: 5.2.1 (stable: 5.x)
- **Issue**: v4.x is older; Google Charts has moved to 5.x series
- **Impact**: New chart features unavailable, potential API changes
- **Action**: Consider upgrading to ^5.0.0 for latest features

#### 2. react-validation - RECOMMENDED: Replace
- **Current**: ^3.0.7 (installed: 3.0.7)
- **Status**: **UNMAINTAINED** - Last published 2022, not actively maintained
- **Issue**: Old library, not following modern React patterns
- **Migration Path**: Use modern validation libraries
- **Recommendation**: Switch to **Zod** (schema-first, TypeScript-friendly) or **Yup**

#### 3. react-router-dom - STABLE but OLD
- **Current**: ^6.30.3 (installed: 6.30.3)
- **Latest**: ^7.9.6 (React Router v7 is out!)
- **Issue**: Version 6.x is still maintained but v7 has major breaking changes
- **Note**: v7 requires different routing syntax; upgrade planned
- **Action**: Plan migration to v7 or stay on 6.x for now

#### 4. axios - STABLE but OLD
- **Current**: ^1.13.6 (installed: 1.13.6)
- **Latest**: 1.13.6
- **Status**: Up to date (the version is valid, just unusual numbering)
- **Note**: This is the latest version, no action needed

#### 5. react-scripts - MAINTENANCE MODE
- **Current**: ^5.0.1
- **Status**: Create React App 5.x is in maintenance mode (EOL scheduled)
- **Issue**: CRA is being deprecated by Meta, no new features
- **Long-term**: Consider migrating to **Vite** for faster builds and modern DX
- **Short-term**: Keep as-is for stability, plan migration later

---

## Migration Recommendations

### Priority 1: Critical Fixes (Do First)
1. **Fix version typos**: Correct axios and react-router-dom versions
2. **Replace react-validation**: Migrate to Zod or Yup
3. **Upgrade react-google-charts**: Get latest stable version

### Priority 2: Security & Stability
1. **Run npm audit**: Check for security vulnerabilities ✓ COMPLETED
2. **Update all dependencies**: `npm audit fix` (safe, non-breaking updates only) ✓ COMPLETED
3. **Regenerate package-lock.json**: Clean install ✓ COMPLETED

**Results after Priority 2:**
- **Client**: Reduced from 29 to 26 vulnerabilities (3 safe fixes applied)
  - Remaining 26 vulnerabilities are tied to Create React App's transitive dependencies
  - Requires `--force` to fix, which would break the app
  - Resolution: Migrate to Vite (Priority 3)
- **API**: Still 18 high severity vulnerabilities
  - Tied to Mongoose v6 → MongoDB → AWS SDK → fast-xml-parser
  - Resolution: Upgrade to Mongoose v8 (Priority 3)

### Priority 3: Long-term Modernization
1. **Migrate from Create React App to Vite**: Faster builds, better DX, more modern
2. **Consider TypeScript**: Better type safety for growing codebase
3. **Update to Mongoose 8**: Latest MongoDB ODM features

---

## Vite Migration Status: COMPLETED ✓

The Vite migration has been completed successfully.

### Changes Made:

#### 1. Vite Configuration
- ✅ `vite.config.js` - Main configuration with React plugin and Vitest
- ✅ `vitest.config.js` - Test configuration
- ✅ `client/index.html` - HTML file in root (replaces `public/index.html`)

#### 2. Scripts in package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

#### 3. Entry File
- ✅ `src/index.jsx` - Entry point with ReactDOM.createRoot

#### 4. Environment Variables Migration
- ✅ Migrated from `process.env.REACT_APP_API_URL` to `import.meta.env.VITE_API_URL`
- ✅ Updated services: AuthService, WinesService, ProducerService, UserService, ReportsService
- ✅ Tests updated to use hardcoded URL `'http://localhost:9000'`

#### 5. Dependencies Installed
- ✅ `vite@^5.4.21`
- ✅ `@vitejs/plugin-react@^4.7.0`
- ✅ `vitest@^2.1.9`
- ✅ `jsdom@^27.2.0`

#### 6. Tests
- ✅ All tests passing (34 tests)
- ✅ Vitest configured with globals, jsdom environment, and setupTests.js

#### 7. Build
- ✅ `npm run build` works correctly
- ✅ Output in `dist/` with minified assets

### Environment Variables Required (.env.example):
```
VITE_API_URL=http://localhost:9000
```

### Updated Commands:
```bash
# Start development
npm run dev

# Build for production
npm run build

# Production preview
npm run preview

# Run tests
npm test
```

### Key CRA → Vite Differences:
| Create React App | Vite |
|-----------------|------|
| `npm start` | `npm run dev` |
| `npm run build` | `npm run build` |
| `process.env.REACT_APP_*` | `import.meta.env.VITE_*` |
| `public/index.html` | `index.html` in root |
| react-scripts | vite + plugin-react |
| Jest | Vitest |

### Notes:
- The `@` alias is configured but not used in the current code
- `eslintConfig` in package.json still references `react-app` - can be cleaned up
- CSS warnings are normal with jsdom and do not affect functionality
- Build produces a warning about large chunks (>500KB) - can be optimized with code-splitting

---

## Upgrade Commands

```bash
# Fix axios version typo
cd client
npm uninstall axios
npm install axios@^1.6.0

# Fix react-router-dom version
cd client
npm uninstall react-router-dom
npm install react-router-dom@^6.26.0

# Upgrade react-google-charts
cd client
npm install react-google-charts@^5.0.0

# Replace react-validation with Zod
npm uninstall react-validation
npm install zod

# Full dependency audit and update
npx npm-check-updates -u  # Review before committing
npm install

# Check for security issues
npm audit
npm audit fix
```

---

## Zod Migration Example

### Old (react-validation)
```javascript
import Input from 'react-validation';
import isEmail from 'validator/lib/is_email';

<Input ref="username" name="username" className="form-control" required value={username} onChange={this.handleChange} />
<Input ref="email" name="email" className="form-control" required isEmail value={email} onChange={this.handleChange} />
```

### New (Zod)
```javascript
import { z } from 'zod';

const UserSchema = z.object({
  username: z.string().min(1, 'Username required'),
  email: z.string().email('Invalid email'),
});

type UserFormData = z.infer<typeof UserSchema>;

// Usage in form validation
const validate = (data) => {
  try {
    UserSchema.parse(data);
    return { valid: true };
  } catch (error) {
    return { valid: false, errors: error.errors };
  }
};
```

---

## Testing After Upgrades

1. **Run all tests**: `npm test` (backend) and `npm test` (frontend)
2. **Manual testing**:
   - Login/Registration flow
   - Wine creation/editing
   - Producer management
   - Report generation
3. **API endpoints**: Verify all endpoints still work correctly
4. **Docker**: Ensure containers start and connect properly

---

## Industry Standard Practices for This Stack

### Modern React Stack (2026)
- **Build Tool**: Vite (or CRA with maintenance mode)
- **Routing**: React Router 6.x (LTS)
- **State Management**: React Context + useReducer (or Zustand/Redux Toolkit for complex apps)
- **Validation**: Zod (server/client shared schemas) or Yup
- **HTTP Client**: Axios or native fetch with interceptors
- **Styling**: Bootstrap 5.x, Tailwind CSS, or CSS Modules
- **Charts**: Recharts, Chart.js, or react-google-charts 5.x

### Modern Node.js/Express Stack
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js or Fastify
- **ODM**: Mongoose 6.x (stable) or 8.x (latest)
- **Validation**: Zod or Joi (for request validation)
- **Auth**: JWT (current approach is solid)
- **Testing**: Jest, Supertest, Vitest

### Security Best Practices
- Always validate user input on both client and server
- Use environment variables for secrets
- Implement rate limiting (add `express-rate-limit`)
- Use helmet.js for security headers
- Regular dependency audits (`npm audit`)
- Use .env files with .env.example template

---

## Next Steps

1. **Immediate**: Fix axios and react-router-dom version typos
2. **This Sprint**: Replace react-validation with Zod
3. **Next Sprint**: Upgrade react-google-charts and run full audit
4. **Quarter Goal**: Migrate to Vite and/or TypeScript
