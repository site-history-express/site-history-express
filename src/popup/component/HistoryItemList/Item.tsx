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
        <div className='truncate opacity-50 mt-[2px]'>{formattedUrl}</div>
      </div>
    </div>
  );
}

function getTitle(item: HistoryItem): string {
  return item.title || new URL(item.url).pathname.slice(1) || i18n.untitled;
}

function getHoverText(item: HistoryItem, title: string): string {
  return `${getTitle(item)}\n\n${item.url}\n\n${dayjs(item.time).fromNow()}`;
}

function getFormattedUrl(item: HistoryItem): string {
  const domain = item.domain.sub ? `${item.domain.sub}.${item.domain.main}` : item.domain.main;
  const tail = decodeURIComponent(
    item.url.slice(new URL(item.url).origin.length, item.url.endsWith('/') ? -1 : undefined),
  );
  return `${domain}${tail}`;
}

function shouldAdjustTitleLeft(title: string): boolean {
  return ['【', '（', '《', '“', '‘'].includes(title[0]);
}
