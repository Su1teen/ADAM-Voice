# Vercel Deployment Fix - Viewport Metadata Issue

## Problem
Vercel build was showing warnings:
```
⚠ Unsupported metadata viewport is configured in metadata export in /c/[slug]. 
Please move it to viewport export instead.
```

## Root Cause
Next.js 14+ requires `viewport` configuration to be exported separately from the `metadata` object. Having it inside `metadata` causes warnings during build and may cause deployment issues.

## Solution Applied

### File: `app/layout.tsx`

**Before (Incorrect):**
```tsx
export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  viewport: {                        // ❌ Inside metadata
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  openGraph: { ... },
  twitter: { ... },
}
```

**After (Correct):**
```tsx
export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  openGraph: { ... },
  twitter: { ... },
}

export const viewport = {            // ✅ Separate export
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}
```

## Why This Fixes The Issue

1. **Next.js 14+ Requirement**: The framework now requires viewport to be a separate named export
2. **Build Optimization**: Separate exports allow Next.js to better optimize the build
3. **Static Generation**: Fixes issues with static page generation on edge runtime
4. **Vercel Deployment**: Removes warnings that could potentially cause deployment failures

## Additional Notes

### Edge Runtime Warning
You may also see:
```
⚠ Using edge runtime on a page currently disables static generation for that page
```

This is expected because:
- The conversation page (`/c/[slug]`) uses `'use client'` directive
- It has dynamic routes and real-time features
- Edge runtime is appropriate for this use case

### Local vs Vercel Behavior
- **Locally**: Next.js may be more lenient with warnings
- **Vercel**: Stricter build checks to ensure production-ready code
- **Fix**: Always address warnings before deployment

## Verification

After this fix, your Vercel build should:
- ✅ Complete without viewport warnings
- ✅ Generate static pages successfully
- ✅ Deploy to production without errors

## Testing

1. **Local build test**:
   ```bash
   npm run build
   ```
   Should complete without viewport warnings

2. **Vercel deployment**:
   - Push changes to your repository
   - Vercel will automatically rebuild
   - Check build logs for success

## Reference
- [Next.js Viewport Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

## Summary
✅ **Fixed**: Moved `viewport` from `metadata` export to separate `viewport` export  
✅ **Result**: Vercel build warnings eliminated  
✅ **Status**: Ready for production deployment  
