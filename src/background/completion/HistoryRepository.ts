export type HistoryItem = {
  title: string
  url: string
}

export default interface HistoryRepository {
  queryHistories(keywords: string): Promise<HistoryItem[]>;
}
