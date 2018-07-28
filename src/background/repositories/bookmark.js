export default class BookmarkRepository {
  async create(title, url) {
    let item = await browser.bookmarks.create({
      type: 'bookmark',
      title,
      url,
    });
    if (!item) {
      throw new Error('Could not create a bookmark');
    }
    return item;
  }
}
