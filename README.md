# Legal Entity Extractor - Web Version

A full-stack web application that extracts legal entities and relationships from documents, generates interactive Mermaid diagrams, and supports GitHub integration.

## Features

- **Document Upload**: Support for .txt, .pdf, and .docx files
- **AI-Powered Extraction**: Uses OpenAI API to extract entities and relationships
- **Interactive Diagrams**: Mermaid-based visualization with zoom, pan, and search
- **GitHub Integration**: Optional storage of diagrams in GitHub repositories
- **Secure API Key Handling**: Keys stored locally, never exposed to server
- **Dark Mode**: Automatic dark mode support
- **Rate Limiting**: Built-in protection against abuse

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Mermaid
- Axios

**Backend:**
- Node.js
- Express
- Mammoth (DOCX extraction)
- Octokit (GitHub API)

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenAI API key (get from https://platform.openai.com/api-keys)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173

3. **Configure API keys:**
   - Open http://localhost:5173
   - Go to Settings
   - Enter your OpenAI API key
   - (Optional) Configure GitHub integration

## Deployment

### Deploy to Vercel

1. **Create a new Vercel project:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure environment variables in Vercel:**
   - No server-side secrets needed (users provide their own API keys)
   - Set `VITE_API_URL` to your Vercel deployment URL

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Deploy to Render

1. **Create a new Render service:**
   - Go to https://dashboard.render.com
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure build settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

3. **Set environment variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `3000`

4. **Deploy:**
   - Push to GitHub, Render will auto-deploy

### Deploy to Heroku (Alternative)

1. **Create Procfile:**
   ```
   web: npm start
   ```

2. **Deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## API Endpoints

### Upload Documents
```
POST /api/upload/documents
Content-Type: multipart/form-data

Returns: { success: true, documents: [...], errors?: [...] }
```

### Extract Entities
```
POST /api/extraction/extract
Content-Type: application/json

Body: {
  documents: [{ fileName: string, text: string }],
  apiKey: string,
  model?: string
}

Returns: { success: true, mermaidCode: string, entities: {...}, relationships: number }
```

### Validate Diagram
```
POST /api/extraction/validate
Content-Type: application/json

Body: { mermaidCode: string }

Returns: { isValid: boolean, errors: [...], warnings: [...], stats: {...} }
```

### Upload to GitHub
```
POST /api/github/upload
Content-Type: application/json

Body: {
  mermaidCode: string,
  fileName: string,
  token: string,
  username: string,
  repo: string
}

Returns: { success: true, url: string }
```

## Security

- **API Keys**: Never stored on server, only in browser localStorage
- **Rate Limiting**: 10 requests per minute per IP
- **File Validation**: Only .txt, .pdf, .docx files allowed
- **Size Limits**: 10MB per file, 5 files maximum
- **Text Length**: 100,000 characters maximum

## Troubleshooting

### "API key is invalid"
- Check your OpenAI API key is correct
- Ensure your account has API credits
- Try testing the key in Settings

### "Failed to extract text from PDF"
- PDF extraction works best with text-based PDFs
- Scanned/image-based PDFs may not extract properly
- Convert to .docx or .txt format as workaround

### "GitHub upload failed"
- Verify GitHub token has write access
- Check repository name and username
- Ensure token is not expired

## Development

### Project Structure
```
.
├── server/
│   ├── index.js              # Express app
│   ├── routes/               # API routes
│   └── utils/                # Utilities
├── client/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # React components
│   │   ├── api.js            # API client
│   │   └── App.jsx           # Main app
│   └── vite.config.js        # Vite config
└── package.json
```

### Adding New Features

1. **Backend**: Add route in `server/routes/`
2. **API Client**: Add function in `client/src/api.js`
3. **Frontend**: Add component/page in `client/src/`

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
