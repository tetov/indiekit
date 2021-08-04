import { Indiekit } from "@indiekit/indiekit";
import { GithubStore } from "@indiekit/store-github";

import YAML from 'yaml';

// YAML options
YAML.scalarOptions.str.fold.lineWidth = 0;


const xyzPreset = class {
  constructor() {
    this.id = "noop";
    this.name = "noop";
  }

  /**
   * Post types
   *
   * @returns {object} Post types config
   */
  get postTypes() {
    return [
      {
        type: "note",
        name: "Note",
        post: {
          path: "content/notes/{slug}.json",
          url: "{slug}",
        },
      },
      {
        type: "post",
        name: "post",
        post: {
          path: "content/notes/{slug}.json",
          url: "{slug}",
        },
      },
    ];
  }

  /**
   * Post template
   *
   * @param {object} properties Post data variables
   * @returns {string} Rendered template
   */
  postTemplate(properties) {
       let content;
    if (properties.content) {
      content = properties.content.text || properties.content.html || properties.content;
      content = `${content}\n`;
    } else {
      content = '';
    }

    properties = {
      date: properties.published,
      slug: properties['mp-slug'],
      "post-type": properties['post-type'],
      ...(properties.name && {title: properties.name}),
      ...(properties.summary && {excerpt: properties.summary}),
      ...(properties.category && {category: properties.category}),
      ...(properties.start && {start: properties.start}),
      ...(properties.end && {end: properties.end}),
      ...(properties.rsvp && {rsvp: properties.rsvp}),
      ...(properties.location && {location: properties.location}),
      ...(properties.checkin && {checkin: properties.checkin}),
      ...(properties.audio && {audio: properties.audio}),
      ...(properties.photo && {photo: properties.photo}),
      ...(properties.video && {video: properties.video}),
      ...(properties['bookmark-of'] && {'bookmark-of': properties['bookmark-of']}),
      ...(properties['like-of'] && {'like-of': properties['like-of']}),
      ...(properties['repost-of'] && {'repost-of': properties['repost-of']}),
      ...(properties['in-reply-to'] && {'in-reply-to': properties['in-reply-to']}),
      ...(properties['post-status'] === 'draft' && {draft: true}),
      ...(properties.visibility && {visibility: properties.visibility}),
      ...(properties.syndication && {syndication: properties.syndication}),
      ...(properties['mp-syndicate-to'] && {'mp-syndicate-to': properties['mp-syndicate-to']})
    };
    let frontmatter = YAML.stringify(properties);
    frontmatter = `---\n${frontmatter}---\n`;

    return frontmatter + content;
  }
};

// Create a new indiekit instance
const indiekit = new Indiekit();

// Configure GitHub content store
const github = new GithubStore({
  user: process.env.GITHUB_USER, // Your username on GitHub
  repo: process.env.GITHUB_REPO, // Repository files will be saved to
  branch: process.env.GITHUB_BRANCH, // Branch to publish to
  token: process.env.GITHUB_TOKEN, // GitHub personal access token
});

// Configure publication
indiekit.set("publication.me", process.env.URL);
indiekit.set("publication.store", github);

const postPreset = new xyzPreset();

const rootDir = "content";
const dateFormat = "{yyyy}{MM}{dd}"

const makePostType = ({typeName, typeDir, preSlug="", includeMedia=false}) => {
    const type= {
        type: typeName.toLowerCase(),
        name: typeName[0].toUpperCase() + typeName.slice(1),
        post: {
            path: `${rootDir}/${typeDir}/${dateFormat}-{slug}.md`,
            url: `${preSlug}${dateFormat}-{slug}`
        },
    }
    type.media = includeMedia ? {
        path: `${rootDir}/${typeDir}/${dateFormat}-{filename}`
    } : undefined
    return type
}

indiekit.set("publication.preset", postPreset);
indiekit.set("publication.postTypes", [
    makePostType({typeName: "article", typeDir: "posts", includeMedia: true}),
    makePostType({typeName: "note", typeDir: "notes", includeMedia: false}),
    makePostType({typeName: "photo", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "video", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "bookmark", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "checkin", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "event", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "rsvp", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "reply", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "repost", typeDir: "other", preSlug: "o/" , includeMedia: true}),
    makePostType({typeName: "like", typeDir: "other", preSlug: "o/" , includeMedia: true}),
]);

// Create a server
const server = indiekit.server();

// Export server
export default server;
