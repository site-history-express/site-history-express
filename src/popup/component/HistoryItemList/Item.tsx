import { useMemo } from 'react';
import dayjs from 'dayjs';

import { HistoryItem } from '@/common/history';
import { i18n } from '@/common/i18n';
import { getFaviconUrl } from '@/common/favicon';

export interface Props {
  item: HistoryItem;
  highlighted: boolean;
  selected: boolean;
  onClick: (item: HistoryItem) => void;
  onMouseMiddleClick: (item: HistoryItem) => void;
}

export const ITEM_HEIGHT = 55;

export default function Item({ item, highlighted, selected, onClick, onMouseMiddleClick }: Props) {
  const title = useMemo(() => getTitle(item), [item]);
  const hoverText = useMemo(() => getHoverText(item, title), [item, title]);
  const iconUrl = useMemo(() => getFaviconUrl(item.url), [item]);
  const formattedUrl = useMemo(() => getFormattedUrl(item), [item]);
  const shouldAdjust = useMemo(() => shouldAdjustTitleLeft(title), [title]);

  function handleClick() {
    onClick(item);
  }

  function handleAuxClick(e: React.MouseEvent) {
    if (e.button === 1) {
      onMouseMiddleClick(item);
    }
  }

  return (
    <div
      className='flex gap-3 items-center px-3 cursor-pointer hover:bg-[--color-bg-hover]'
      style={{ height: ITEM_HEIGHT, backgroundColor: selected ? 'var(--color-bg-selected)' : '' }}
      title={hoverText}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
    >
      <div className='flex-none'>
        <img src={iconUrl} alt='' className='w-[1.2em] h-[1.2em] mb-[1.5em]' />
      </div>
      <div className='flex-auto w-0'>
        <div
          className='truncate'
          style={{ fontWeight: highlighted ? 'bold' : '', marginLeft: shouldAdjust ? '-0.5em' : '' }}
        >
          {title}
        </div>
        <div className='flex gap-2 opacity-50 mt-[2px]'>
          <div className='flex-auto w-0 truncate'>{formattedUrl}</div>
        </div>
      </div>
    </div>
  );
}

function getTitle(item: HistoryItem): string {
  return (
    item.title || decodeUrlTail(new URL(item.url).pathname.slice(1)) || mergeDomain(item.domain.sub, item.domain.main)
  );
}

function getHoverText(item: HistoryItem, title: string): string {
  const time = `${dayjs(item.time).fromNow()} (${dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')})`;
  return `${getTitle(item)}\n\n${item.url}\n\n${time}`;
}

function getFormattedUrl(item: HistoryItem): string {
  const domain = mergeDomain(item.domain.sub, item.domain.main);
  const tail = item.url.slice(new URL(item.url).origin.length, item.url.endsWith('/') ? -1 : undefined);
  const decodedTail = decodeUrlTail(tail);
  return `${domain}${decodedTail}`;
}

function decodeUrlTail(tail: string): string {
  try {
    return decodeURIComponent(tail);
  } catch (err) {
    return tail;
  }
}

function mergeDomain(sub: string, main: string): string {
  return sub ? `${sub}.${main}` : main;
}

function shouldAdjustTitleLeft(title: string): boolean {
  return ['【', '（', '《', '“', '‘'].includes(title[0]);
}
