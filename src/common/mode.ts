export enum MatchMode {
  Loose = 1,
  Strict = 2,
}

export const DEFAULT_MATCH_MODE = MatchMode.Strict;

const STORAGE_KEY = 'looseModeDomains';
const STORAGE_LIMIT = 100;

export async function updateMatchMode(mainDomain: string, mode: MatchMode) {
  const res = await chrome.storage.sync.get(STORAGE_KEY);
  let domains = (res[STORAGE_KEY] || []).filter((domain: string) => domain !== mainDomain);
  if (mode === MatchMode.Loose) {
    domains.push(mainDomain);
  }
  if (domains.length > STORAGE_LIMIT) {
    domains = domains.slice(-STORAGE_LIMIT);
  }
  await chrome.storage.sync.set({ [STORAGE_KEY]: domains });
}

export async function getMatchMode(mainDomain: string): Promise<MatchMode> {
  const res = await chrome.storage.sync.get(STORAGE_KEY);
  return (res[STORAGE_KEY] || []).includes(mainDomain) ? MatchMode.Loose : DEFAULT_MATCH_MODE;
}
