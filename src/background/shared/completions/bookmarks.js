const getCompletions = (keywords) => {
  return browser.bookmarks.search({ query: keywords }).then((items) => {
    return items.filter((item) => {
      let url = undefined;
      try {
        url = new URL(item.url);
      } catch (e) {
        return false;
      }
      return item.type === 'bookmark' && url.protocol !== 'place:';
    });
  });
};

export { getCompletions };
