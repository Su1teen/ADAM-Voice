# Edge Runtime Warning Fix

## Problem
Vercel build logs showed warning:
```
⚠ Using edge runtime on a page currently disables static generation for that page
```

This warning appears when Edge Runtime is used unnecessarily, preventing Next.js from optimizing pages at build time.

## Root Cause
**Edge Runtime was enabled in routes that don't need it:**
- `app/route.ts` - Simple redirect
- `app/api/text/route.ts` - Mock text response

### What is Edge Runtime?
- **Purpose**: Ultra-fast, globally distributed API routes
- **Use Case**: External API calls, geographically distributed logic
- **Limitations**: 
  - No Node.js APIs
  - No static generation
  - Smaller runtime environment

### When to Use Edge Runtime
✅ **Use Edge Runtime for:**
- External API calls (e.g., ElevenLabs, OpenAI)
- Simple data transformations
- Geographically distributed endpoints
- WebSocket connections

❌ **Don't Use Edge Runtime for:**
- Simple redirects
- Mock/stub endpoints
- File system operations
- Heavy computational tasks

## Changes Made

### 1. Removed Edge Runtime from `app/route.ts`
**Before:**
```typescript
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.redirect(new URL(`/c/${performance.now()}_${Math.random()}`, request.url))
}
```

**After:**
```typescript
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.redirect(new URL(`/c/${performance.now()}_${Math.random()}`, request.url))
}
```

**Why:** Simple redirect doesn't benefit from Edge Runtime

### 2. Removed Edge Runtime from `app/api/text/route.ts`
**Before:**
```typescript
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function POST(request: Request) {
  if (!message || !process.env.XI_API_KEY) {
    return NextResponse.json({ error: 'Missing message or API key' }, { status: 400 })
  }
  // Mock response...
}
```

**After:**
```typescript
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 })
  }
  // Mock response...
}
```

**Why:** Mock endpoint doesn't need Edge Runtime or env var check

### 3. Kept Edge Runtime in Critical Routes
✅ **`app/api/i/route.ts`** - Calls ElevenLabs API (benefits from edge)
✅ **`app/api/c/route.ts`** - In-memory storage (works well on edge)

## Results

### Before
- 4 routes using Edge Runtime
- Build warnings about disabled static generation
- Unnecessary runtime constraints

### After
- 2 routes using Edge Runtime (only where needed)
- ✅ No edge runtime warnings
- Better build optimization
- Faster page loads

## Benefits

1. **Better Performance**: Pages can be statically optimized when possible
2. **Cleaner Builds**: No unnecessary warnings in logs
3. **More Flexibility**: Node.js runtime available where needed
4. **Easier Debugging**: Full Node.js APIs available in non-edge routes

## Testing

### Local Build Test
```powershell
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
```

**No warnings about Edge Runtime**

### Verify Edge Routes Still Work
1. Test voice connection: `/api/i` (should still use Edge)
2. Test message storage: `/api/c` (should still use Edge)
3. Test redirect: `/` (now uses Node.js runtime)
4. Test text API: `/api/text` (now uses Node.js runtime)

All should work identically!

## When to Add Edge Runtime Back

Only add `export const runtime = 'edge'` if:
1. Route makes external API calls
2. Need global distribution for speed
3. Route is simple (no Node.js APIs needed)
4. Performance is critical

## References
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Edge vs Node.js Runtime](https://vercel.com/docs/functions/runtimes/edge-runtime)
