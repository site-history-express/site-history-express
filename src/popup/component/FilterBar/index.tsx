import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { MatchMode } from '@/common/mode';
import { Domain } from '@/common/url';
import { debounce } from '@/common/stream';
import { i18n } from '@/common/i18n';

export interface Props {
  domain: Domain;
  matchMode: MatchMode;
  onTextChange: (text: string) => void;
  onToggleMatchMode: () => void;
}

export default function FilterBar({ domain, matchMode, onTextChange, onToggleMatchMode }: Props) {
  const canToggleMatchMode = useMemo(() => !!domain.main, [domain]);
  const placeholder = useMemo(() => {
    if (!domain.main) {
      return i18n.filterGlobalPlaceholder;
    }
    if (matchMode === MatchMode.Strict) {
      return i18n.filterPlaceholder(domain.sub ? `${domain.sub}.${domain.main}` : domain.main);
    }
    return i18n.filterPlaceholder(`*.${domain.main}`);
  }, [domain, matchMode]);

  const [text, setText] = useState('');
  const debouncedUpdate = useCallback(debounce(onTextChange, 300), []);
  const [shouldHideCaret, setShouldHideCaret] = useState(true);

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newText = event.target.value;
    setText(newText);
    setShouldHideCaret(false);
    debouncedUpdate(newText);
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleBtnClick() {
    inputRef.current?.focus();
    onToggleMatchMode();
  }

  return (
    <div className='flex items-center h-[40px] border-t border-[--color-border] shadow-lg shadow-[--color-text]'>
      <input
        ref={inputRef}
        className='flex-auto bg-transparent outline-none border-none h-full px-3'
        style={{ caretColor: shouldHideCaret ? 'transparent' : undefined }}
        type='text'
        placeholder={placeholder}
        spellCheck={false}
        autoComplete='off'
        value={text}
        onChange={handleTextChange}
        onClick={() => setShouldHideCaret(false)}
      />
      {canToggleMatchMode && (
        <button className='h-full p-3 outline-none opacity-30 hover:opacity-50' onClick={handleBtnClick}>
          {matchMode === MatchMode.Strict ? <StrictModeSvg /> : <LooseModeSvg />}
        </button>
      )}
    </div>
  );
}

function StrictModeSvg() {
  return (
    <svg
      style={{ width: '16px', height: '16px' }}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
      ></path>
    </svg>
  );
}

function LooseModeSvg() {
  return (
    <svg
      style={{ width: '16px', height: '16px' }}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
      ></path>
    </svg>
  );
}
