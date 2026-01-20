# Legal Entity Extractor - Web Application

## Project Overview

A full-stack web application that extracts legal entities and relationships from documents using OpenAI's API and visualizes them as interactive Mermaid diagrams.

## Architecture

### Frontend (React + Vite)
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Diagrams:** Mermaid
- **Routing:** React Router
- **HTTP Client:** Axios

### Backend (Node.js + Express)
- **Runtime:** Node.js 24.x
- **Framework:** Express.js
- **File Upload:** Multer
- **Document Parsing:** Mammoth (DOCX), native PDF parsing
- **GitHub API:** Octokit
- **External API:** OpenAI

## Key Features

1. **Document Upload**
   - Supports .txt, .pdf, .docx files
   - Max 10MB per file, 5 files per upload
   - Client-side validation

2. **Entity Extraction**
   - Uses OpenAI API (user-provided key)
   - Supports multiple models (gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo)
   - Extracts 7 entity types: case, person, organisation, legal_issue, event, document, location

3. **Diagram Visualization**
   - Interactive Mermaid diagrams
   - Zoom and pan controls
   - Search/filter functionality
   - Code view and copy-to-clipboard

4. **GitHub Integration**
   - Upload diagrams to GitHub repositories
   - Automatic file naming with timestamps
   - Permission validation

5. **Security**
   - API keys stored locally (browser localStorage)
   - No server-side secret storage
   - Rate limiting (10 req/min per IP)
   - Input validation and sanitization
   - CORS protection

## File Structure

```
legal-entity-extractor-web/
├── server/                          # Backend
│   ├── index.js                     # Express app & routes
│   ├── routes/
│   │   ├── upload.js               # Document upload endpoint
│   │   ├── extraction.js           # Entity extraction endpoint
│   │   └── github.js               # GitHub integration endpoint
│   └── utils/
│       ├── document-extractor.js   # Text extraction logic
│       ├── openai-client.js        # OpenAI API integration
│       ├── mermaid-validator.js    # Diagram validation
│       ├── github-client.js        # GitHub API wrapper
│       └── security.js             # Rate limiting & validation
├── client/                          # Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Home page with recent extractions
│   │   │   ├── Upload.jsx          # Document upload page
│   │   │   ├── Viewer.jsx          # Diagram viewer page
│   │   │   └── Settings.jsx        # Settings page
│   │   ├── components/
│   │   │   ├── Navigation.jsx      # Top navigation bar
│   │   │   └── MermaidViewer.jsx   # Diagram viewer component
│   │   ├── api.js                  # API client
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── package.json
├── package.json                     # Root dependencies
├── README.md                        # Full documentation
├── QUICKSTART.md                    # Quick start guide
├── DEPLOYMENT.md                    # Deployment instructions
├── vercel.json                      # Vercel configuration
├── render.yaml                      # Render configuration
├── Procfile                         # Heroku configuration
└── .gitignore
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "..." }
```

### Upload Documents
```
POST /api/upload/documents
Content-Type: multipart/form-data

Response: {
  success: true,
  documents: [{ fileName: string, text: string }],
  errors?: [{ file: string, error: string }]
}
```

### Extract Entities
```
POST /api/extraction/extract
Content-Type: application/json

Request: {
  documents: [{ fileName: string, text: string }],
  apiKey: string,
  model?: string
}

Response: {
  success: true,
  mermaidCode: string,
  entities: { case: number, person: number, ... },
  relationships: number,
  stats: { ... }
}
```

### Validate Diagram
```
POST /api/extraction/validate
Content-Type: application/json

Request: { mermaidCode: string }

Response: {
  isValid: boolean,
  errors: string[],
  warnings: string[],
  stats: { ... }
}
```

### Upload to GitHub
```
POST /api/github/upload
Content-Type: application/json

Request: {
  mermaidCode: string,
  fileName: string,
  token: string,
  username: string,
  repo: string
}

Response: { success: true, url: string }
```

## Data Flow

1. **Upload Phase**
   - User selects files
   - Frontend validates file types and sizes
   - Files sent to `/api/upload/documents`
   - Backend extracts text from each file

2. **Extraction Phase**
   - Extracted text sent to `/api/extraction/extract`
   - Backend calls OpenAI API with system prompt
   - OpenAI returns Mermaid diagram code
   - Backend validates diagram syntax

3. **Visualization Phase**
   - Diagram stored in browser localStorage
   - Mermaid library renders diagram
   - User can zoom, pan, search

4. **Export Phase**
   - User can copy Mermaid code
   - User can upload to GitHub
   - Diagram stored with timestamp

## Technology Decisions

### Why React?
- Component-based architecture
- Large ecosystem and community
- Easy state management with hooks
- Good performance with virtual DOM

### Why Express?
- Lightweight and flexible
- Easy to set up and deploy
- Good middleware ecosystem
- Perfect for REST APIs

### Why Mermaid?
- Client-side rendering (no server load)
- Wide diagram type support
- Good for entity relationships
- Active development and community

### Why Vercel/Render?
- Easy deployment from GitHub
- Free tier available
- Automatic HTTPS
- Good performance and uptime

## Deployment Options

### Vercel (Recommended)
- Easiest setup
- Free tier with good limits
- Automatic deployments from GitHub
- Built-in analytics

### Render
- Good free tier
- Simple configuration
- Automatic deployments
- Good documentation

### Heroku
- Traditional option
- Requires paid dynos now
- Good for learning
- Lots of documentation

## Security Considerations

1. **API Keys**
   - Never stored on server
   - Only in browser localStorage
   - Users responsible for key security

2. **Rate Limiting**
   - 10 requests per minute per IP
   - Prevents abuse
   - Configurable in `server/utils/security.js`

3. **Input Validation**
   - File type validation
   - File size limits
   - Text length limits
   - Mermaid syntax validation

4. **CORS**
   - Enabled for all origins (can be restricted)
   - Protects against unauthorized requests

5. **Error Handling**
   - No sensitive information in error messages
   - Proper HTTP status codes
   - Detailed logs on server

## Performance Considerations

1. **Frontend**
   - Lazy load Mermaid library
   - Code splitting with Vite
   - Tailwind CSS purging
   - Gzip compression

2. **Backend**
   - In-memory file processing
   - No database queries
   - Efficient text extraction
   - Connection pooling ready

3. **Network**
   - Minimal API calls
   - Efficient JSON payloads
   - Gzip compression
   - CDN-ready static files

## Future Enhancements

1. **OCR Support**
   - Add Tesseract or cloud OCR
   - Support scanned PDFs
   - Image-based documents

2. **User Accounts**
   - Save extraction history
   - Share diagrams
   - Collaboration features

3. **Database**
   - Store extractions
   - User preferences
   - Usage analytics

4. **Advanced Features**
   - Batch processing
   - Scheduled extractions
   - Custom entity types
   - Relationship weighting

5. **UI Improvements**
   - Diagram editing
   - Custom styling
   - Export to multiple formats
   - Real-time collaboration

## Testing

Manual testing:
1. Start dev servers: `npm run dev`
2. Upload test document
3. Verify extraction
4. Test GitHub integration
5. Check error handling

## Maintenance

### Regular Tasks
- Monitor error logs
- Check API usage
- Update dependencies
- Review security advisories

### Monitoring
- Application health: `/api/health`
- Error tracking
- Performance metrics
- User feedback

### Updates
- Keep Node.js updated
- Update npm packages
- Test before deploying
- Monitor for breaking changes

## Support & Documentation

- **README.md** - Full documentation
- **QUICKSTART.md** - Quick start guide
- **DEPLOYMENT.md** - Deployment instructions
- **Code comments** - Inline documentation
- **API endpoints** - RESTful API reference

## License

MIT - Free to use and modify
