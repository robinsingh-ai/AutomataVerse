# Security Guidelines for Automata-Verse

This document provides security guidelines for deploying Automata-Verse to production environments. Following these best practices will help prevent exposure of source code, problem solutions, and other sensitive information.

## Source Code Protection

When deployed in development mode, modern web applications typically include source maps that allow browsers to map minified code back to the original source. This is helpful for debugging but can expose your source code to users.

### Building for Production

Always use the secure production build when deploying to a publicly accessible server:

```bash
# Run the secure production build
npm run build:secure

# Or with yarn
yarn build:secure
```

This will:
1. Disable browser source maps
2. Enable code minification and obfuscation
3. Remove console logs and debug information
4. Add security headers to prevent various attacks

### Verifying Security

After deploying, verify that source code is not accessible:

1. Visit your deployed site
2. Open browser developer tools (F12 or Right-click → Inspect)
3. Go to the Sources tab
4. Confirm that original source files are not visible and only minified files appear

## Additional Security Recommendations

1. **Regular Updates**: Keep Next.js and all dependencies updated to patch security vulnerabilities.

2. **Environment Variables**: Never expose API keys or sensitive values in client-side code. Use server-side environment variables.

3. **Content Security Policy**: Consider implementing a strict Content Security Policy.

4. **Rate Limiting**: Implement rate limiting on API routes to prevent abuse.

5. **Input Validation**: Always validate user inputs server-side before processing them.

## Problem Data Privacy

For educational applications like Automata-Verse, protecting problem solutions is important:

1. Don't expose complete test cases in the client code
2. Consider implementing an API that only returns test results, not the test cases themselves
3. Use server-side validation for checking solutions when possible

## Reporting Security Issues

If you discover any security vulnerabilities in Automata-Verse, please report them responsibly. 