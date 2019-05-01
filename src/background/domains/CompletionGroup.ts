import CompletionItem from './CompletionItem';

export default interface CompletionGroup {
  name: string;
  items: CompletionItem[];
  // eslint-disable-next-line semi
}
