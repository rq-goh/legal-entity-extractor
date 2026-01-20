import { Octokit } from 'octokit';

/**
 * Upload Mermaid diagram to GitHub repository
 */
export async function uploadToGitHub(config, mermaidCode, fileName) {
  try {
    // Validate config
    if (!config.token || !config.username || !config.repo) {
      return {
        success: false,
        error: 'GitHub configuration incomplete. Please provide token, username, and repository name.',
      };
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: config.token,
    });

    // Generate unique file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFileName = `${fileName.replace(/\s+/g, '_')}_${timestamp}.md`;
    const path = `diagrams/${fullFileName}`;

    // Encode content to base64
    const contentBase64 = Buffer.from(
      `\`\`\`mermaid\n${mermaidCode}\n\`\`\``
    ).toString('base64');

    // Check if file already exists
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: config.username,
        repo: config.repo,
        path,
      });

      if (data.sha) {
        sha = data.sha;
      }
    } catch (error) {
      // File doesn't exist, which is fine for new uploads
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create or update file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: config.username,
      repo: config.repo,
      path,
      message: `Add legal entity extraction diagram: ${fileName}`,
      content: contentBase64,
      sha,
    });

    // Return the URL to the file
    const fileUrl = `https://github.com/${config.username}/${config.repo}/blob/${response.data.commit.sha}/${path}`;

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error) {
    console.error('GitHub upload error:', error);

    let errorMessage = 'Failed to upload to GitHub';

    if (error.status === 401) {
      errorMessage = 'Invalid GitHub token. Please check your credentials.';
    } else if (error.status === 404) {
      errorMessage = `Repository not found: ${config.username}/${config.repo}. Please check the repository name.`;
    } else if (error.status === 403) {
      errorMessage = 'Permission denied. Please ensure your token has write access to the repository.';
    } else if (error.message) {
      errorMessage = `GitHub error: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Test GitHub connection and permissions
 */
export async function testGitHubConnection(config) {
  try {
    if (!config.token || !config.username || !config.repo) {
      return {
        success: false,
        error: 'Please provide token, username, and repository name.',
      };
    }

    const octokit = new Octokit({
      auth: config.token,
    });

    // Test authentication
    const { data: user } = await octokit.users.getAuthenticated();

    // Test repository access
    const { data: repo } = await octokit.repos.get({
      owner: config.username,
      repo: config.repo,
    });

    // Check if user has push access
    if (!repo.permissions?.push) {
      return {
        success: false,
        error: 'Token does not have write access to the repository.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('GitHub connection test error:', error);

    let errorMessage = 'Failed to connect to GitHub';

    if (error.status === 401) {
      errorMessage = 'Invalid GitHub token.';
    } else if (error.status === 404) {
      errorMessage = `Repository not found: ${config.username}/${config.repo}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
