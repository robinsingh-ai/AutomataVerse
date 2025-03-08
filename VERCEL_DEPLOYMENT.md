# Secure Deployment on Vercel

This guide provides instructions for deploying Automata-Verse securely on Vercel to ensure your source code and problem solutions are protected.

## Setting Up Vercel Deployment

### 1. Connect Your GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

### 2. Configure Project Settings

On the configuration screen:

1. **Framework Preset**: Select "Next.js"
2. **Build Command**: Make sure it shows `npm run build:secure` (this is set by vercel.json)
3. **Environment Variables**: Click "Add" and add the following:
   - `NODE_ENV` with value `production`
   - `NEXT_PUBLIC_SECURE_BUILD` with value `true`

### 3. Deploy

Click "Deploy" and wait for the build to complete.

## Verifying Security

After deployment, check your site to make sure your source code is protected:

1. Visit your deployed Vercel site
2. Open browser developer tools (F12)
3. Go to the "Sources" tab
4. Verify you cannot see your original source files:
   - No TypeScript (.ts/.tsx) files should be visible
   - No problem solution files should be accessible
   - Code should be minified/obfuscated

## Additional Vercel-Specific Security Settings

For even more security, you can configure these additional settings in the Vercel dashboard:

### Environment Variables

Make sure any sensitive configuration values are stored as Vercel Environment Variables and not hardcoded.

### Custom Domains & HTTPS

Always use HTTPS with your custom domains. Vercel handles this automatically.

### Branch Protection (GitHub)

Enable branch protection rules on your main branch to prevent unauthorized code changes.

## Updating Your Deployment

When you push changes to your GitHub repository:

1. Vercel will automatically rebuild and redeploy your site
2. The secure build command will run automatically
3. Your source code will remain protected

## Troubleshooting

If you can still see source maps or original source files:

1. Check that `vercel.json` exists in your repository
2. Verify your environment variables are set correctly
3. Rebuild the project manually in the Vercel dashboard
4. Make sure you're not using "Development" or "Preview" deployments, which might show source maps 