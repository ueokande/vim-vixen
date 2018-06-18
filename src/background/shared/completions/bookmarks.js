const getCompletions = async(keywords) => {
  let items = await browser.bookmarks.search({ query: keywords });
  return items.filter((item) => {
    let url = undefined;
    try {
      url = new URL(item.url);
    } catch (e) {
      return false;
    }
    return item.type === 'bookmark' && url.protocol !== 'place:';
  }).slice(0, 10);
};

export { getCompletions };
