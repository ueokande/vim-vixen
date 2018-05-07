const create = (title, url) => {
  return browser.bookmarks.create({
    type: 'bookmark',
    title,
    url,
  });
};

export { create };
