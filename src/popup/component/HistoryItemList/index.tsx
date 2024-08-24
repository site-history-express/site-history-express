import { useEffect, useState, useRef } from 'react';
import { List, ListRowRenderer } from 'react-virtualized';

import { HistoryItem } from '@/common/history';
import { i18n } from '@/common/i18n';
import Item, { ITEM_HEIGHT } from './Item';

export interface Props {
  items: HistoryItem[];
  total: number;
  highlightedUrlSet: Set<string>;
}

const MAX_HEIGHT = 500;
const WIDTH = 400;

export default function HistoryItemList({ items, total, highlightedUrlSet }: Props) {
  const listRef = useRef<List>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
    listRef.current?.scrollToPosition(0);
  }, [items]);

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => (
    <div key={key} style={style}>
      <Item
        item={items[index]}
        highlighted={highlightedUrlSet.has(items[index].url)}
        selected={selectedIndex === index}
        onClick={(item) => openItem(item)}
        onMouseMiddleClick={(item) => openItem(item, true)}
      />
    </div>
  );

  function handleKeyDown(event: KeyboardEvent) {
    const offset = event.shiftKey ? 9 : 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((index) => {
          return Math.min(index + offset, items.length - 1);
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((index) => {
          return index === -1 ? items.length - 1 : Math.max(index - offset, 0);
        });
        break;
      case 'Enter':
        event.preventDefault();
        if (items[selectedIndex]) {
          openItem(items[selectedIndex], event.shiftKey);
        }
        break;
    }
  }

  const keydownHandlerRef = useRef(handleKeyDown);
  useEffect(() => {
    keydownHandlerRef.current = handleKeyDown;
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => keydownHandlerRef.current(event);
    document.addEventListener('keydown', handler, true);
    return () => {
      document.removeEventListener('keydown', handler, true);
    };
  }, []);

  return (
    <div className='relative min-h-12'>
      <List
        ref={listRef}
        width={WIDTH}
        height={Math.min(MAX_HEIGHT, total * ITEM_HEIGHT)}
        rowHeight={ITEM_HEIGHT}
        rowCount={items.length}
        rowRenderer={rowRenderer}
        scrollToIndex={selectedIndex}
        style={{
          padding: '12px 0',
          boxSizing: 'content-box',
        }}
      />
      {!items.length && (
        <div className='absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'>
          <span className='text-xs text-center opacity-50 select-none'>{i18n.noHistory}</span>
        </div>
      )}
    </div>
  );
}

async function openItem(item: HistoryItem, mustInNewTab?: boolean) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabIndex = tabs.find((tab) => tab.url === item.url)?.index ?? -1;
  const isCurrentTabHttp = tabs.find((tab) => tab.active)?.url?.startsWith('http') ?? false;
  if (tabIndex > -1) {
    chrome.tabs.highlight({
      tabs: tabIndex,
    });
  } else if (isCurrentTabHttp || mustInNewTab) {
    chrome.tabs.create({
      url: item.url,
    });
  } else {
    chrome.tabs.update({
      url: item.url,
    });
  }
  window.close();
}
