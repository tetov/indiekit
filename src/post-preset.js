import YAML from "yaml";

// YAML options
YAML.scalarOptions.str.fold.lineWidth = 0;

const XyzPreset = class {
  constructor() {
    this.id = "xyz";
    this.name = "xyz";
  }

  _makePostType = ({
    typeName,
    typeDir,
    preSlug = "",
    includeMedia = false,
  }) => {
    const rootDir = "content";
    const dateFormat = "{t}";

    const type = {
      type: typeName.toLowerCase(),
      name: typeName[0].toUpperCase() + typeName.slice(1),
      post: {
        path: `${rootDir}/${typeDir}/${dateFormat}-{slug}.md`,
        url: `${preSlug}${dateFormat}-{slug}`,
      },
    };
    type.media = includeMedia
      ? {
          path: `${rootDir}/${typeDir}/${dateFormat}-{filename}`,
        }
      : undefined;
    return type;
  };

  _makePostTypeProps = [
    { typeName: "article", typeDir: "posts", includeMedia: true },
    { typeName: "note", typeDir: "notes", includeMedia: true },
    /*
    {
      typeName: "photo",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    {
      typeName: "video",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    */
    {
      typeName: "bookmark",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    /*
    {
      typeName: "checkin",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    {
      typeName: "event",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    { typeName: "rsvp", typeDir: "other", preSlug: "o/", includeMedia: true },
    {
      typeName: "reply",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    {
      typeName: "repost",
      typeDir: "other",
      preSlug: "o/",
      includeMedia: true,
    },
    { typeName: "like", typeDir: "other", preSlug: "o/", includeMedia: true },
    */
  ];

  /**
   * Post types
   *
   * @returns {object} Post types config
   */
  get postTypes() {
    return this._makePostTypeProps.map(this._makePostType);
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
      content =
        properties.content.text ||
        properties.content.html ||
        properties.content;
      content = `${content}\n`;
    } else {
      content = "";
    }

    properties = {
      date: properties.published,
      slug: properties["mp-slug"],
      "post-type": properties["post-type"],
      ...(properties.name && { title: properties.name }),
      ...(properties.summary && { excerpt: properties.summary }),
      ...(properties.category && { category: properties.category }),
      ...(properties.start && { start: properties.start }),
      ...(properties.end && { end: properties.end }),
      ...(properties.rsvp && { rsvp: properties.rsvp }),
      ...(properties.location && { location: properties.location }),
      ...(properties.checkin && { checkin: properties.checkin }),
      ...(properties.audio && { audio: properties.audio }),
      ...(properties.photo && { photo: properties.photo }),
      ...(properties.video && { video: properties.video }),
      ...(properties["bookmark-of"] && {
        "bookmark-of": properties["bookmark-of"],
      }),
      ...(properties["like-of"] && { "like-of": properties["like-of"] }),
      ...(properties["repost-of"] && { "repost-of": properties["repost-of"] }),
      ...(properties["in-reply-to"] && {
        "in-reply-to": properties["in-reply-to"],
      }),
      ...(properties["post-status"] === "draft" && { draft: true }),
      ...(properties.visibility && { visibility: properties.visibility }),
      ...(properties.syndication && { syndication: properties.syndication }),
      ...(properties["mp-syndicate-to"] && {
        "mp-syndicate-to": properties["mp-syndicate-to"],
      }),
    };
    let frontmatter = YAML.stringify(properties);
    frontmatter = `---\n${frontmatter}---\n`;

    return frontmatter + content;
  }
};

export default XyzPreset;
