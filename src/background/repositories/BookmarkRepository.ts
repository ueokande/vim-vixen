export default class BookmarkRepository {
  async create(
    title: string, url: string
  ): Promise<browser.bookmarks.BookmarkTreeNode> {
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
