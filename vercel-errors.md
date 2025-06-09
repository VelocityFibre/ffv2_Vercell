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
4. ✅ **FINAL SOLUTION**: Set `rootDirectory: "apps/web"` in vercel.json

### Final Working Configuration
```json
{
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.output/public",
  "installCommand": "npm install && npm install --prefix apps/web",
  "framework": null,
  "functions": {
    "apps/web/.output/server/index.mjs": {
      "runtime": "nodejs18.x"
    }
  }
}
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

### Key Learnings
- **Always set `rootDirectory`** for monorepo deployments
- When `rootDirectory` is set, all paths become relative to that directory
- Don't try to copy files between directories in build commands
- The workspace script approach (`npm run build` from root) works but requires correct path configuration

### Build Output Analysis
- Build creates: `[success] [vinxi] Generated public .output/public`
- This means `.output/public` directory is created in the build context
- With `rootDirectory: "apps/web"`, the output path is correctly `.output/public`

### Common Mistakes to Avoid
1. Don't set `outputDirectory: "apps/web/.output/public"` when using `rootDirectory: "apps/web"`
2. Don't try to `cd` into subdirectories in `buildCommand` 
3. Don't copy files around - fix the paths instead
4. Don't forget to update function paths when changing `rootDirectory`