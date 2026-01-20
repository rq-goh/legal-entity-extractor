# Quick Start Guide

Get the Legal Entity Extractor running in 5 minutes.

## Local Development (Testing)

### 1. Clone and Install

```bash
cd legal-entity-extractor-web
npm install
cd client && npm install && cd ..
```

### 2. Start Development Servers

```bash
npm run dev
```

Open your browser:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

### 3. Configure API Keys

1. Click ⚙️ Settings in the top right
2. Enter your OpenAI API key (get from https://platform.openai.com/api-keys)
3. (Optional) Configure GitHub integration
4. Click "Save Settings"

### 4. Upload a Document

1. Click "New Extraction"
2. Select a .txt, .pdf, or .docx file
3. Click "Extract Entities"
4. Wait for processing
5. View the Mermaid diagram

## Deploy to Production

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

That's it! Your app is live.

### Option 2: Render

1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Create new Web Service
4. Connect your GitHub repo
5. Set build command: `npm run build`
6. Set start command: `npm start`
7. Click "Create Web Service"

### Option 3: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Deploy
heroku create your-app-name
git push heroku main
```

## Environment Variables

No server-side environment variables needed! Users provide their own API keys through the Settings page.

## Troubleshooting

### "Cannot find module" error

```bash
npm install
cd client && npm install && cd ..
```

### "Port 3000 already in use"

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm start
```

### API requests failing

- Check OpenAI API key is valid
- Verify backend is running (http://localhost:3000/api/health)
- Check browser console for errors

### PDF extraction not working

- Try converting PDF to .docx first
- Ensure PDF is text-based (not scanned/image)
- Use .txt files as fallback

## File Structure

```
.
├── server/              # Express backend
│   ├── index.js         # Main server
│   ├── routes/          # API endpoints
│   └── utils/           # Utilities
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # React components
│   │   └── api.js       # API client
│   └── dist/            # Built files
├── package.json         # Root dependencies
├── README.md            # Full documentation
└── DEPLOYMENT.md        # Deployment guide
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Upload Documents
```
POST /api/upload/documents
Content-Type: multipart/form-data
```

### Extract Entities
```
POST /api/extraction/extract
Content-Type: application/json
{
  "documents": [{"fileName": "...", "text": "..."}],
  "apiKey": "sk-...",
  "model": "gpt-4o-mini"
}
```

### Validate Diagram
```
POST /api/extraction/validate
Content-Type: application/json
{"mermaidCode": "graph TD..."}
```

### Upload to GitHub
```
POST /api/github/upload
Content-Type: application/json
{
  "mermaidCode": "...",
  "fileName": "...",
  "token": "ghp_...",
  "username": "...",
  "repo": "..."
}
```

## Features

✅ Upload .txt, .pdf, .docx files
✅ AI-powered entity extraction
✅ Interactive Mermaid diagrams
✅ Zoom, pan, search capabilities
✅ GitHub integration
✅ Dark mode support
✅ Rate limiting & security
✅ No database required

## Next Steps

1. **Deploy:** Follow deployment guide above
2. **Share:** Send URL to users
3. **Customize:** Modify colors in `client/tailwind.config.js`
4. **Monitor:** Check logs in deployment platform

## Support

- Check README.md for detailed documentation
- Review DEPLOYMENT.md for platform-specific help
- Check browser console for error messages
- Review server logs for API errors

## Tips

- Test with the sample ACRA document provided
- Start with smaller documents (< 5MB)
- Use gpt-4o-mini for cost-effective extraction
- Save diagrams to GitHub for version control

Enjoy! 🎉
