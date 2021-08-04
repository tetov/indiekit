import { Indiekit } from '@indiekit/indiekit';
import { GithubStore } from '@indiekit/store-github';
import XyzPreset from './post-preset.js';

// Create a new indiekit instance
const indiekit = new Indiekit();

// Configure GitHub content store
const github = new GithubStore({
  user: process.env.GITHUB_USER, // Your username on GitHub
  repo: process.env.GITHUB_REPO, // Repository files will be saved to
  branch: process.env.GITHUB_BRANCH, // Branch to publish to
  token: process.env.GITHUB_TOKEN // GitHub personal access token
});

const xyz = new XyzPreset();

// Configure publication
indiekit.set('publication.me', process.env.URL);
indiekit.set('publication.store', github);

indiekit.set('publication.preset', xyz);

// Create a server
const server = indiekit.server();

// Export server
export default server;
