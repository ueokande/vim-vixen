import BookmarkRepository, { BookmarkItem } from "../BookmarkRepository";

const COMPLETION_ITEM_LIMIT = 10;

export default class CachedBookmarkRepository implements BookmarkRepository {
  async queryBookmarks(query: string): Promise<BookmarkItem[]> {
    const items = await browser.bookmarks.search({ query });
    return items
      .filter((item) => item.title && item.title.length > 0)
      .filter((item) => item.type === "bookmark" && item.url)
      .filter((item) => {
        let url = undefined;
        try {
          url = new URL(item.url!);
        } catch (e) {
          return false;
        }
        return url.protocol !== "place:";
      })
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map((item) => ({
        title: item.title!,
        url: item.url!,
      }));
  }
}
