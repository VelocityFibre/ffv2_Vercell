# Vercel Deployment Errors & Solutions

## Error: No Output Directory named "public" found after the Build completed

### Problem
- Build succeeds but Vercel can't find the output directory
- Error: "No Output Directory named 'public' found after the Build completed"

### Root Cause
In a monorepo workspace setup, the build runs from the root but creates output in a subdirectory. Vercel needs to know the correct context and paths.

### Solution Steps Attempted
1. ❌ Tried copying output: `cp -r apps/web/.output/public ./public` - failed because source path didn't exist
2. ❌ Tried different path variations in `outputDirectory` - paths were incorrect relative to build context
3. ❌ Tried changing build command to `cd apps/web && npm run build` - directory not found in Vercel environment
4. ❌ Tried `rootDirectory: "apps/web"` but property doesn't exist in vercel.json schema
5. ✅ **ACTUAL SOLUTION**: Remove vercel.json entirely and fix app.config.ts preset

### Final Working Configuration
**NO vercel.json needed!** 

Only configure `apps/web/app.config.ts`:
```typescript
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  server: {
    preset: "vercel"  // ← THIS was the key fix!
  }
});
```

### Update: `rootDirectory` Not Supported
- `rootDirectory` property does not exist in vercel.json schema
- Must use `cd apps/web &&` in buildCommand instead
- ❌ Tried `npm install --prefix apps/web` but created wrong path `/apps/web/apps/web/`
- ✅ Use only root `npm install` - workspace handles subdependencies automatically

### Important: This is SolidStart, Not Nuxt
- Project uses **SolidStart** with **Vinxi** build tool
- Build output shows `vinxi v0.5.6`, not Nuxt
- Uses Nitro for server engine (like Nuxt) but deployment differs
- Vercel should auto-detect SolidStart but may need explicit configuration

### SolidStart + Vercel Deployment Notes
- SolidStart generates `.output/public` for static assets
- Server functions go to `.output/server/index.mjs`
- Vercel needs both static assets and server function configured
- Current approach: Git integration with proper vercel.json paths

### Key Learnings - THE REAL ISSUE
- **Modern SolidStart (1.0.2+) uses `app.config.ts`, NOT `vercel.json`**
- The preset in `app.config.ts` MUST be `"vercel"`, not `"node-server"`
- `"node-server"` preset builds for local/traditional hosting, not Vercel serverless
- Vercel auto-detects SolidStart when preset is correct
- All our vercel.json troubleshooting was unnecessary - wrong approach entirely

### What We Learned the Hard Way
- Hours wasted on vercel.json path configurations
- The real issue was a single line: `preset: "node-server"` → `preset: "vercel"`
- Modern frameworks use their own config files, not platform-specific configs
- Always check the framework's deployment preset FIRST

### FINAL SOLUTION - Create New Vercel Project
When importing from GitHub, Vercel correctly auto-detects:
- ✅ Framework: SolidStart (v1)
- ✅ Root Directory: apps/web
- ✅ Build Command: `npm run build` or `vinxi build`
- ✅ Output Directory: `.output`
- ✅ Install Command: Auto npm install

The combination of:
1. `preset: "vercel"` in app.config.ts 
2. Proper Root Directory setting in Vercel project
3. No vercel.json interfering

= SUCCESS!

### Post-Deployment Issue: Blank Page
**Problem**: Deployment worked but page was blank
**Cause**: Missing root index route (`/`)
**Solution**: Created `src/routes/index.tsx` that redirects to `/dashboard`

```typescript
import { Component } from "solid-js"
import { Navigate } from "@solidjs/router"

const Index: Component = () => {
  return <Navigate href="/dashboard" />
}

export default Index
```

### Build Output Analysis
- Build creates: `[success] [vinxi] Generated public .output/public`
- This means `.output/public` directory is created in the build context
- With `rootDirectory: "apps/web"`, the output path is correctly `.output/public`

### Common Mistakes to Avoid
1. Don't set `outputDirectory: "apps/web/.output/public"` when using `rootDirectory: "apps/web"`
2. Don't try to `cd` into subdirectories in `buildCommand` 
3. Don't copy files around - fix the paths instead
4. Don't forget to update function paths when changing `rootDirectory`