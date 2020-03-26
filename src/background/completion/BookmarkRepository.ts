export type BookmarkItem = {
  title: string
  url: string
}

export default interface BookmarkRepository {
  queryBookmarks(query: string): Promise<BookmarkItem[]>;
}
