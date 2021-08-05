const makePostType = ({
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
      path: `${rootDir}/${typeDir}/${dateFormat}-{slug}.json`,
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

const makePostTypeProps = [
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

const getPostTypes = () => {
  return makePostTypeProps.map(makePostType);
};
export default getPostTypes;
