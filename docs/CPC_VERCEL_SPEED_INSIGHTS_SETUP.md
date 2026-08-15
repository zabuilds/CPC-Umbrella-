# CPC Vercel Speed Insights Setup Guide

## Purpose
Official implementation guide for integrating Vercel Speed Insights into the CPC application, based on the latest Vercel documentation (retrieved August 15, 2026).

## Prerequisites
- Vercel account with CPC project deployed
- Source code synchronized from Lovable to GitHub repository
- Package manager available (npm, pnpm, yarn, or bun)

## Implementation Steps

### Step 1: Enable Speed Insights in Vercel Dashboard
1. Navigate to the Vercel dashboard
2. Select the CPC project
3. Click "Speed Insights" from the sidebar
4. Click the "Enable" button
5. This adds tracking routes that will be active after the next deployment

### Step 2: Install the Package
Based on the CPC project's package manager, run ONE of the following commands:

```bash
# If using pnpm (recommended for Vercel projects)
pnpm i @vercel/speed-insights

# If using npm
npm i @vercel/speed-insights

# If using yarn
yarn add @vercel/speed-insights

# If using bun
bun add @vercel/speed-insights
```

### Step 3: Add SpeedInsights Component

#### For Next.js 13.5+ (App Router)
The CPC application likely uses the App Router. Add the component to the root layout file:

**File: `app/layout.tsx` (or `app/layout.js`)**

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### Alternative: For Next.js Pages Router
If the CPC application uses Pages Router instead:

**File: `pages/_app.tsx` (or `pages/_app.js`)**

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
```

### Step 4: Deploy and Verify
1. Commit the changes to the repository
2. Deploy using `vercel deploy` or automatic Git deployment
3. After deployment, verify the tracking script appears in your page's head tag
4. Check for the script at `/<unique-path>/script.js` in the browser DevTools

### Step 5: Monitor Performance
1. Navigate to the Vercel dashboard
2. Select the CPC project
3. Click "Speed Insights" in the sidebar
4. Performance metrics will appear after several days of visitor activity

## Integration with CPC CI/CD

### Build Verification
Add to CI/CD gates (per CPC_VERCEL_CICD_ENVIRONMENT_READINESS.md):
- Ensure `@vercel/speed-insights` is in dependencies
- Verify TypeScript compilation passes with the new import
- Run linter to ensure no errors
- Execute tests to verify no breaking changes
- Confirm production build completes successfully

### Environment Considerations
- Speed Insights works across all Vercel environments (development, preview, production)
- No additional environment variables required
- No server-only secrets needed
- Safe for preview deployments

## Testing Checklist
Before marking as complete:

- [ ] Package installed and added to package.json
- [ ] Lock file updated (package-lock.json, pnpm-lock.yaml, yarn.lock, or bun.lockb)
- [ ] SpeedInsights component added to appropriate layout file
- [ ] TypeScript compilation passes (`npm run typecheck` or equivalent)
- [ ] Linter passes (if configured)
- [ ] Tests pass (if available)
- [ ] Production build completes successfully
- [ ] Component renders without errors in browser
- [ ] Speed Insights script tag appears in HTML after deployment
- [ ] Speed Insights enabled in Vercel dashboard

## Architecture Notes
- Speed Insights is a client-side library with minimal performance impact
- It uses Web Vitals to measure Core Web Vitals (LCP, FID, CLS, etc.)
- Data is sent to Vercel's analytics infrastructure
- No PII or sensitive data is collected
- Complements the existing CPC observability strategy

## References
- Official documentation: https://vercel.com/docs/speed-insights/quickstart
- Retrieved: August 15, 2026
- Framework: Next.js (App Router expected based on modern Lovable setup)

## Current Status
**PENDING IMPLEMENTATION** - This guide is ready for execution once the CPC source code is synchronized from Lovable to the GitHub repository.

When the source code is available:
1. Identify the actual package manager used
2. Locate the root layout file (app/layout.tsx or pages/_app.tsx)
3. Follow the implementation steps above
4. Update CPC_EXECUTION_LEDGER.md to reflect completion
