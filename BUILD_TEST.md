# Build Verification Commands

## Test the fix locally before pushing to Vercel

### 1. Clean build
```bash
# Remove previous build artifacts
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Run production build
npm run build
```

### 2. Check for warnings
Look for these lines in the output:
- ❌ Should NOT see: `Unsupported metadata viewport is configured`
- ✅ Should see: `Creating an optimized production build ... ✓ Compiled successfully`

### 3. Start production server (optional)
```bash
npm run start
```

### 4. Deploy to Vercel
```bash
# Commit changes
git add app/layout.tsx VERCEL_FIX.md
git commit -m "fix: move viewport to separate export for Next.js 14+ compatibility"
git push origin main
```

## Expected Results

### Before Fix:
```
⚠ Unsupported metadata viewport is configured in metadata export
⚠ Using edge runtime on a page currently disables static generation
```

### After Fix:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

## Troubleshooting

### If you still see warnings:

1. **Clear cache**:
   ```bash
   Remove-Item -Recurse -Force .next, node_modules/.cache
   npm run build
   ```

2. **Check Next.js version**:
   ```bash
   npm list next
   ```
   Should be Next.js 14+ (currently likely 15.x)

3. **Verify the fix**:
   Make sure `app/layout.tsx` has `viewport` as a separate export, not inside `metadata`

## Vercel Deployment

Once you push to GitHub/GitLab/Bitbucket:
1. Vercel will automatically detect the changes
2. Build will start automatically
3. Check deployment logs at https://vercel.com/[your-username]/[project-name]
4. Look for successful build message

## Quick Test Command
```bash
npm run build 2>&1 | Select-String -Pattern "viewport","error","warning"
```

This will show only lines containing viewport, error, or warning messages.
