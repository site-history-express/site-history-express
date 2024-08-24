export interface Domain {
  sub: string;
  main: string;
}

const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);
const CHAR_CODE_DOT = '.'.charCodeAt(0);
const CHAR_CODE_COL = ':'.charCodeAt(0);
const MIN_IP_LEN = '0.0.0.0'.length;

const COMMON_DOMAINS = new Set(['com', 'org', 'net', 'int', 'edu', 'gov', 'mil', 'ac']);
const REGION_DOMAINS = new Set([
  'ac',
  'ad',
  'ae',
  'af',
  'ag',
  'ai',
  'al',
  'am',
  'ao',
  'aq',
  'ar',
  'as',
  'at',
  'au',
  'aw',
  'ax',
  'az',
  'ba',
  'bb',
  'bd',
  'be',
  'bf',
  'bg',
  'bh',
  'bi',
  'bj',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'bt',
  'bw',
  'by',
  'bz',
  'ca',
  'cc',
  'cd',
  'cf',
  'cg',
  'ch',
  'ci',
  'ck',
  'cl',
  'cm',
  'cn',
  'co',
  'cr',
  'cu',
  'cv',
  'cw',
  'cx',
  'cy',
  'cz',
  'de',
  'dj',
  'dk',
  'dm',
  'do',
  'dz',
  'ec',
  'ee',
  'eg',
  'er',
  'es',
  'et',
  'eu',
  'fi',
  'fj',
  'fk',
  'fm',
  'fo',
  'fr',
  'ga',
  'gd',
  'ge',
  'gf',
  'gg',
  'gh',
  'gi',
  'gl',
  'gm',
  'gn',
  'gp',
  'gq',
  'gr',
  'gs',
  'gt',
  'gu',
  'gw',
  'gy',
  'hk',
  'hm',
  'hn',
  'hr',
  'ht',
  'hu',
  'id',
  'ie',
  'il',
  'im',
  'in',
  'io',
  'iq',
  'ir',
  'is',
  'it',
  'je',
  'jm',
  'jo',
  'jp',
  'ke',
  'kg',
  'kh',
  'ki',
  'km',
  'kn',
  'kp',
  'kr',
  'kw',
  'ky',
  'kz',
  'la',
  'lb',
  'lc',
  'li',
  'lk',
  'lr',
  'ls',
  'lt',
  'lu',
  'lv',
  'ly',
  'ma',
  'mc',
  'md',
  'me',
  'mg',
  'mh',
  'mk',
  'ml',
  'mm',
  'mn',
  'mo',
  'mp',
  'mq',
  'mr',
  'ms',
  'mt',
  'mu',
  'mv',
  'mw',
  'mx',
  'my',
  'mz',
  'na',
  'nc',
  'ne',
  'nf',
  'ng',
  'ni',
  'nl',
  'no',
  'np',
  'nr',
  'nu',
  'nz',
  'om',
  'pa',
  'pe',
  'pf',
  'pg',
  'ph',
  'pk',
  'pl',
  'pm',
  'pn',
  'pr',
  'ps',
  'pt',
  'pw',
  'py',
  'qa',
  're',
  'ro',
  'rs',
  'ru',
  'rw',
  'sa',
  'sb',
  'sc',
  'sd',
  'se',
  'sg',
  'sh',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sx',
  'sy',
  'sz',
  'tc',
  'td',
  'tf',
  'tg',
  'th',
  'tj',
  'tk',
  'tl',
  'tm',
  'tn',
  'to',
  'tr',
  'tt',
  'tv',
  'tw',
  'tz',
  'ua',
  'ug',
  'uk',
  'us',
  'uy',
  'uz',
  'va',
  'vc',
  've',
  'vg',
  'vi',
  'vn',
  'vu',
  'wf',
  'ws',
  'ye',
  'yt',
  'za',
  'zm',
  'zw',
]);

export function getCleanUrl(url: string): string {
  if (!url) {
    return '';
  }
  let end = url.length;
  for (let i = 0; i < url.length; i++) {
    if (url[i] === '#' || url[i] === '?') {
      end = i;
      break;
    }
  }
  if (url[end - 1] === '/') {
    end--;
  }
  return url.slice(0, end);
}

export function getCleanDomain(url: string): Domain {
  let start = 0;
  let end = url.length;
  for (let i = 1; i < url.length; i++) {
    if (url[i] === '/' && url[i - 1] === '/') {
      start = i + 1;
      break;
    }
  }
  if (
    url.length > start + 4 &&
    url[start] === 'w' &&
    url[start + 1] === 'w' &&
    url[start + 2] === 'w' &&
    url[start + 3] === '.'
  ) {
    start += 4;
  }
  for (let i = start; i < url.length; i++) {
    if (url[i] === '/' || url[i] === '?' || url[i] === '#') {
      end = i;
      break;
    }
  }
  return resolveDomain(url.slice(start, end));
}

function resolveDomain(domain: string): Domain {
  if (!domain) {
    return { sub: '', main: '' };
  }
  if (isIp(domain)) {
    return { sub: '', main: domain };
  }
  let partIndex = 0;
  let tldIndex = 0;
  for (let i = domain.length - 1; i >= 0; i--) {
    if (domain[i] !== '.') {
      continue;
    }
    if (partIndex === 0) {
      tldIndex = i;
      partIndex++;
      continue;
    }
    if (
      partIndex === 1 &&
      COMMON_DOMAINS.has(domain.slice(i + 1, tldIndex)) &&
      REGION_DOMAINS.has(domain.slice(tldIndex + 1))
    ) {
      continue;
    }
    return { sub: domain.slice(0, i), main: domain.slice(i + 1) };
  }
  return { sub: '', main: domain };
}

export function isIp(val: string): boolean {
  if (val.length < MIN_IP_LEN) {
    return false;
  }
  for (let i = val.length - 1; i >= 0; i--) {
    const code = val.charCodeAt(i);
    if ((code < CHAR_CODE_0 || code > CHAR_CODE_9) && code !== CHAR_CODE_DOT && code !== CHAR_CODE_COL) {
      return false;
    }
  }
  return true;
}
