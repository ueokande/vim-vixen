import { injectable } from 'tsyringe';

@injectable()
export default class BookmarkRepository {
  async create(
    title: string, url: string
  ): Promise<browser.bookmarks.BookmarkTreeNode> {
    const item = await browser.bookmarks.create({
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
