import { Indiekit } from "@indiekit/indiekit";
import { GithubStore } from "@indiekit/store-github";
import getPostTypes from "./post-types.js";
import { TwitterSyndicator } from "@indiekit/syndicator-twitter";

// Create a new indiekit instance
const indiekit = new Indiekit();

// Application settings
indiekit.set("application.mongodbUrl", process.env.MONGODB_URL);

// Configure GitHub content store
const github = new GithubStore({
  user: process.env.GITHUB_USER, // Your username on GitHub
  repo: process.env.GITHUB_REPO, // Repository files will be saved to
  branch: process.env.GITHUB_BRANCH, // Branch to publish to
  token: process.env.GITHUB_TOKEN, // GitHub personal access token
});

// Configure publication
indiekit.set("publication.me", process.env.URL);
indiekit.set("publication.timeZone", process.env.PUB_TZ);
indiekit.set("publication.store", github);
indiekit.set("publication.postTypes", getPostTypes());

const twitter = new TwitterSyndicator({
  apiKey: process.env.TWITTER_API_KEY,
  apiKeySecret: process.env.TWITTER_API_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  user: process.env.TWITTER_USERNAME,
  checked: process.env.TWITTER_ENABLED_FOR_ALL,
});

indiekit.set("publication.syndicationTargets", [twitter]);

// Create a server
const server = indiekit.server();

// Export server
export default server;
