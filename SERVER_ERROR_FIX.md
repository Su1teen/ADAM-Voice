# Server-Side Rendering Error Fix

## Problem
Application was throwing **Server Components render error** in production (Vercel):
```
Application error: a server-side exception has occurred
Digest: 3809930603
```

Console showed:
```
Error: An error occurred in the Server Components render.
The specific message is omitted in production builds to avoid leaking sensitive details.
```

## Root Cause
The `app/c/[slug]/page.tsx` component was directly destructuring `slug` from `useParams()` without proper type checking.

**Why this causes errors:**
1. `useParams()` returns `{ [key: string]: string | string[] | undefined }`
2. On initial server render, `slug` can be `undefined` or an array
3. Using `slug` directly in fetch URLs without validation causes runtime errors
4. The error is hidden in production for security, showing only a digest

## Before (Broken Code)
```tsx
export default function ConversationPage() {
  const { slug } = useParams()  // ❌ slug can be undefined/array
  
  const loadConversation = () => {
    fetch(`/api/c?id=${slug}`)  // ❌ Error if slug is undefined
      .then(...)
  }
  
  const saveMessage = async (message: Message) => {
    await fetch('/api/c', {
      body: JSON.stringify({ id: slug })  // ❌ Error if slug is undefined
    })
  }
  
  useEffect(() => {
    loadConversation()  // ❌ Runs even if slug is invalid
  }, [slug])
}
```

## After (Fixed Code)
```tsx
export default function ConversationPage() {
  const params = useParams()
  // ✅ Safely extract slug with type checking
  const slug = typeof params.slug === 'string' 
    ? params.slug 
    : Array.isArray(params.slug) 
      ? params.slug[0] 
      : ''
  
  const loadConversation = () => {
    if (!slug) return  // ✅ Guard clause
    fetch(`/api/c?id=${slug}`)
      .then(...)
  }
  
  const saveMessage = async (message: Message) => {
    if (!slug) return  // ✅ Guard clause
    await fetch('/api/c', {
      body: JSON.stringify({ id: slug })
    })
  }
  
  useEffect(() => {
    if (slug) {  // ✅ Only load if slug exists
      loadConversation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])
}
```

## Changes Made

### 1. Safe Slug Extraction
```tsx
const params = useParams()
const slug = typeof params.slug === 'string' 
  ? params.slug 
  : Array.isArray(params.slug) 
    ? params.slug[0] 
    : ''
```
- Handles string, array, and undefined cases
- Falls back to empty string for safety

### 2. Added Guard Clauses
- `loadConversation()`: Returns early if slug is empty
- `saveMessage()`: Returns early if slug is empty
- `useEffect`: Only calls loadConversation if slug exists

### 3. Fixed useEffect Dependency
- Added conditional check before calling loadConversation
- Added eslint-disable comment for exhaustive-deps (loadConversation doesn't need to be in deps)

## Why This Fixes The Error

1. **Server-Side Safety**: The server can now safely render the page even if params aren't available yet
2. **Type Safety**: TypeScript now knows slug is always a string (possibly empty)
3. **Runtime Safety**: Guard clauses prevent API calls with invalid slugs
4. **Production Stability**: No more hidden server errors on Vercel

## Additional Notes

### Font Preload Warnings (Non-Critical)
```
The resource was preloaded using link preload but not used within a few seconds
```
These are **informational warnings**, not errors. They occur because:
- Next.js preloads fonts for performance
- The warnings appear if fonts load slower than expected
- **They don't affect functionality** and can be safely ignored

To reduce these warnings (optional):
1. Use `font-display: optional` in font configuration
2. Or add `preload: false` to font settings

## Testing

### Local Build Test
```powershell
npm run build
npm run start
```
Expected: No server errors, clean build

### Vercel Deployment
```powershell
git add app/c/[slug]/page.tsx SERVER_ERROR_FIX.md
git commit -m "fix: add slug validation to prevent server-side render errors"
git push origin main
```
Expected: Clean deployment without digest errors

### Browser Test
1. Navigate to any conversation URL (e.g., `/c/test-123`)
2. Open browser console
3. Expected: No "Server Components render" errors
4. Only font preload warnings (harmless)

## References
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [useParams Hook](https://nextjs.org/docs/app/api-reference/functions/use-params)
- [Server Components Errors](https://nextjs.org/docs/messages/no-dynamic-routes-on-segment)
