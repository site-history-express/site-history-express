import { Domain, getCleanUrl, getCleanDomain } from './url';
import { fnv1a } from './hash';

export interface HistoryItem {
  key: number;
  domain: Domain;
  url: string;
  title: string;
  time: number;
}

export interface DomainHistoryItems {
  domain: Domain;
  main: HistoryItem[];
  sub: HistoryItem[];
}

export function createDomainHistoryItems(): DomainHistoryItems {
  return {
    domain: {
      main: '',
      sub: '',
    },
    main: [],
    sub: [],
  };
}

export async function getHistoryItems(startTime: number): Promise<HistoryItem[]> {
  const query: chrome.history.HistoryQuery = { text: '', maxResults: 0, startTime };
  const items = await chrome.history.search(query);
  return items.filter(filterHistoryItem).map(resolveHistoryItem);
}

function filterHistoryItem(item: chrome.history.HistoryItem) {
  return item.url && item.url.startsWith('http');
}

function resolveHistoryItem(item: chrome.history.HistoryItem): HistoryItem {
  const key = getItemKey(item);
  const domain = getCleanDomain(item.url || '');
  return {
    key,
    domain,
    url: item.url || '',
    title: item.title || '',
    time: item.lastVisitTime || 0,
  };
}

function getItemKey(item: chrome.history.HistoryItem): number {
  return fnv1a(`${item.title || ''}${getCleanUrl(item.url || '')}`);
}
