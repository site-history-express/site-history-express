export function getFaviconUrl(url: string) {
  const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
  iconUrl.searchParams.set('pageUrl', url);
  iconUrl.searchParams.set('size', '32');
  return iconUrl.toString();
}
