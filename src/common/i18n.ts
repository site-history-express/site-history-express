export const i18n = {
  lang: chrome.i18n.getMessage('lang'),
  untitled: chrome.i18n.getMessage('untitled'),
  filterPlaceholder: (domain: string) => chrome.i18n.getMessage('filter_placeholder', domain),
  filterGlobalPlaceholder: chrome.i18n.getMessage('filter_global_placeholder'),
  noHistory: chrome.i18n.getMessage('no_history'),
};
