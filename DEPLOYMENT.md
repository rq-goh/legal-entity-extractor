# Deployment Guide

This guide covers deploying the Legal Entity Extractor to Vercel, Render, or Heroku.

## Prerequisites

- GitHub account with repository access
- Node.js 24.x (for local testing)
- OpenAI API key (users will provide their own)

## Quick Start - Local Testing

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start development servers
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## Deployment to Vercel

Vercel is the easiest option for this application.

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### Configuration

Vercel will automatically:
- Build the client with `npm run build`
- Serve static files from `client/dist`
- Proxy `/api/*` requests to the server

**Environment Variables:**
- No secrets needed (users provide their own API keys)
- Optional: `VITE_API_URL` (defaults to `/api`)

### Troubleshooting

**"Cannot find module" errors:**
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore`

**"API requests failing":**
- Verify backend is running
- Check CORS configuration in `server/index.js`
- Ensure API URL is correct in frontend

## Deployment to Render

Render offers a free tier and automatic deployments.

### Step 1: Prepare Repository

Ensure your GitHub repository includes:
- `package.json` (root)
- `server/` directory
- `client/` directory with `dist/` build output
- `render.yaml` (included)

### Step 2: Create Render Service

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub account
5. Select your repository

### Step 3: Configure Service

- **Name:** legal-entity-extractor
- **Environment:** Node
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Plan:** Free (or Starter for better performance)

### Step 4: Deploy

- Click "Create Web Service"
- Render will automatically deploy on every push to main

### Environment Variables

No environment variables needed for basic functionality.

### Monitoring

- View logs in Render dashboard
- Check service health status
- Monitor CPU and memory usage

## Deployment to Heroku

Heroku is being phased out but still works for deployments.

### Prerequisites

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

### Deploy

```bash
# Create app
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

## Post-Deployment

### 1. Test the Application

1. Visit your deployed URL
2. Go to Settings
3. Enter your OpenAI API key
4. Upload a test document
5. Verify extraction works

### 2. Configure Custom Domain

**Vercel:**
- Project Settings → Domains
- Add your custom domain

**Render:**
- Service Settings → Custom Domain
- Add your custom domain

### 3. Enable HTTPS

All three platforms provide free HTTPS automatically.

### 4. Monitor Performance

- Check response times
- Monitor error rates
- Review logs for issues

## Troubleshooting

### Application won't start

**Check logs:**
```bash
# Vercel
vercel logs

# Render
# View in dashboard

# Heroku
heroku logs --tail
```

**Common issues:**
- Missing dependencies in `package.json`
- Incorrect build command
- Port not set correctly

### API requests failing

**Check CORS:**
- Verify frontend URL is allowed in `server/index.js`
- Check API endpoint URLs match deployment

**Check authentication:**
- Verify OpenAI API key is valid
- Check rate limits haven't been exceeded

### File upload issues

**Check file size limits:**
- Multer limit: 10MB per file
- Vercel: 4.5MB request limit (upgrade for more)
- Render: No limit on free tier

**Solution:**
- Compress documents before upload
- Split large documents into smaller files

### GitHub integration not working

**Check token:**
- Verify GitHub token is valid
- Ensure token has `repo` scope
- Check token hasn't expired

**Check repository:**
- Verify repository name is correct
- Ensure user has write access

## Scaling

### When to upgrade

- **Vercel:** Upgrade to Pro for larger deployments
- **Render:** Upgrade to Starter or higher for production
- **Heroku:** Use Hobby tier or higher

### Performance optimization

1. **Frontend:**
   - Enable gzip compression
   - Lazy load Mermaid library
   - Cache static assets

2. **Backend:**
   - Add caching for API responses
   - Implement connection pooling
   - Monitor memory usage

3. **Database:**
   - Not needed for current implementation
   - Consider adding for user accounts

## Security

### API Keys

- **Never** commit API keys to repository
- Use environment variables for secrets
- Rotate keys regularly

### CORS

- Restrict to your domain
- Don't allow all origins in production

### Rate Limiting

- Implemented on backend (10 req/min per IP)
- Monitor for abuse
- Adjust limits based on usage

## Monitoring & Maintenance

### Health Checks

```bash
# Test API health
curl https://your-domain.com/api/health

# Should return: { "status": "ok", "timestamp": "..." }
```

### Logs

- Check logs regularly for errors
- Monitor for unusual patterns
- Set up alerts for failures

### Updates

- Keep dependencies updated
- Monitor security advisories
- Test updates before deploying

## Support

For issues:
1. Check application logs
2. Review error messages
3. Test locally first
4. Check GitHub issues
5. Contact platform support

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
