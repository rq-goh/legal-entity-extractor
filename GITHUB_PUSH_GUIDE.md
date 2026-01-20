# GitHub Push Guide - Step by Step

This guide explains how the Legal Entity Extractor was pushed to GitHub and how to do it yourself.

## What Was Done

Your project has been successfully pushed to:
```
https://github.com/rq-goh/legal-entity-extractor
```

## Step-by-Step Process

### Step 1: Initialize Git Repository
```bash
cd legal-entity-extractor-web
git init
```
This creates a `.git` folder that tracks all changes.

### Step 2: Configure Git User
```bash
git config user.email "your-email@github.com"
git config user.name "your-username"
```
Replace with your actual GitHub email and username.

### Step 3: Add All Files
```bash
git add -A
```
This stages all files for commit. The `-A` flag means "add all".

### Step 4: Create Initial Commit
```bash
git commit -m "Initial commit: Legal Entity Extractor web application"
```
The message describes what's in this commit.

### Step 5: Add GitHub Remote
```bash
git remote add origin https://github.com/rq-goh/legal-entity-extractor.git
```
This connects your local repo to the GitHub repository.

### Step 6: Rename Branch to Main
```bash
git branch -M main
```
GitHub uses `main` as the default branch name (not `master`).

### Step 7: Push to GitHub
```bash
git push -u origin main
```
The `-u` flag sets `origin/main` as the upstream branch.

### Step 8: Verify Push
```bash
git log --oneline
git status
```
Check that your commits are now on GitHub.

## File Structure on GitHub

Your repository is organized like this:

```
legal-entity-extractor/
├── server/                          # Backend code
│   ├── index.js                     # Main Express server
│   ├── routes/
│   │   ├── upload.js               # File upload endpoint
│   │   ├── extraction.js           # Entity extraction endpoint
│   │   └── github.js               # GitHub integration
│   └── utils/
│       ├── document-extractor.js   # Text extraction
│       ├── openai-client.js        # OpenAI API
│       ├── mermaid-validator.js    # Diagram validation
│       ├── github-client.js        # GitHub API
│       └── security.js             # Rate limiting
│
├── client/                          # Frontend code
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Home page
│   │   │   ├── Upload.jsx          # Upload page
│   │   │   ├── Viewer.jsx          # Viewer page
│   │   │   └── Settings.jsx        # Settings page
│   │   ├── components/
│   │   │   ├── Navigation.jsx      # Navigation bar
│   │   │   └── MermaidViewer.jsx   # Diagram viewer
│   │   ├── api.js                  # API client
│   │   ├── App.jsx                 # Main app
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Styles
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite config
│   ├── tailwind.config.js          # Tailwind config
│   ├── postcss.config.js           # PostCSS config
│   └── package.json
│
├── package.json                     # Root dependencies
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick start guide
├── DEPLOYMENT.md                    # Deployment guide
├── PROJECT_SUMMARY.md               # Architecture details
├── vercel.json                      # Vercel config
├── render.yaml                      # Render config
├── Procfile                         # Heroku config
├── .gitignore                       # Git ignore rules
└── GITHUB_PUSH_GUIDE.md            # This file
```

## What Gets Ignored

The `.gitignore` file prevents these from being pushed:
- `node_modules/` - Too large, reinstalled with `npm install`
- `dist/` - Build output, regenerated with `npm run build`
- `.env` - Secret files with API keys
- `.DS_Store` - macOS system files
- `.vscode/` - Editor settings

## Common Git Commands

### Check Status
```bash
git status
```
Shows which files have changed.

### View Commit History
```bash
git log --oneline
```
Shows recent commits with short messages.

### Add Specific Files
```bash
git add file1.js file2.jsx
```
Stage only certain files.

### Commit Changes
```bash
git commit -m "Your message here"
```
Create a commit with a descriptive message.

### Push to GitHub
```bash
git push origin main
```
Upload commits to GitHub.

### Pull from GitHub
```bash
git pull origin main
```
Download latest changes from GitHub.

### Create New Branch
```bash
git checkout -b feature/new-feature
```
Create and switch to a new branch.

### Switch Branch
```bash
git checkout main
```
Switch between branches.

## Making Changes After Initial Push

### 1. Make Changes to Files
Edit files as needed.

### 2. Check What Changed
```bash
git status
```

### 3. Stage Changes
```bash
git add -A
```
Or add specific files:
```bash
git add file1.js file2.jsx
```

### 4. Commit
```bash
git commit -m "Describe your changes"
```

### 5. Push
```bash
git push origin main
```

## Example: Adding a New Feature

```bash
# Create feature branch
git checkout -b feature/ocr-support

# Make changes to files
# ... edit files ...

# Stage changes
git add -A

# Commit
git commit -m "Add OCR support for scanned PDFs"

# Push feature branch
git push origin feature/ocr-support

# On GitHub: Create Pull Request to merge into main
```

## Viewing on GitHub

After pushing, visit:
```
https://github.com/rq-goh/legal-entity-extractor
```

You'll see:
- **Code tab** - Browse all files
- **Commits tab** - See commit history
- **Branches tab** - Manage branches
- **Releases tab** - Create releases
- **Settings tab** - Configure repository

## Deployment from GitHub

### Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-deploys on every push to `main`

### Render
1. Go to https://dashboard.render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Render auto-deploys on every push to `main`

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

## Tips & Best Practices

1. **Commit Often** - Small, focused commits are easier to understand
2. **Write Good Messages** - Describe WHAT and WHY, not just WHAT
3. **Use Branches** - Keep `main` stable, use branches for features
4. **Pull Before Push** - Always pull latest changes first
5. **Review Before Commit** - Check `git diff` before committing
6. **Keep .gitignore Updated** - Add new files that shouldn't be tracked

## Good Commit Messages

❌ Bad:
```
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

✅ Good:
```
git commit -m "Fix PDF text extraction for scanned documents"
git commit -m "Add rate limiting to API endpoints"
git commit -m "Update Mermaid diagram validation rules"
```

## Troubleshooting

### "fatal: not a git repository"
```bash
cd legal-entity-extractor-web
git init
```

### "fatal: could not read Username"
```bash
git config user.email "your-email@github.com"
git config user.name "your-username"
```

### "rejected ... (fetch first)"
```bash
git pull origin main
git push origin main
```

### "Permission denied (publickey)"
- Check SSH key setup on GitHub
- Or use HTTPS instead of SSH

### "Your branch is ahead of 'origin/main'"
```bash
git push origin main
```

## Summary

The Legal Entity Extractor is now on GitHub! You can:
- ✅ View code online
- ✅ Deploy to Vercel/Render/Heroku
- ✅ Collaborate with others
- ✅ Track changes with git history
- ✅ Create releases and tags

For questions, check the main README.md or DEPLOYMENT.md files.
