import { Loader, Popover, TextField } from '@navikt/ds-react';
import { FormEvent, useRef, useState } from 'react';

import styles from './ComboSearch.module.css';

interface ComboboxProps<T> {
  label: string;
  fetcher: (input: string) => Promise<T[] | undefined>;
  searchAsString: (input: T) => string;
  setValue: (input: T) => void;
  error?: string;
}

export const ComboSearch = <T,>({ label, fetcher, searchAsString, setValue, error }: ComboboxProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const onChange = async (event: FormEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
    if (!event.currentTarget.value) {
      setSearchResults([]);
      setShowPopover(false);
    } else {
      setShowPopover(true);
      setSearching(true);
      const res = await fetcher(event.currentTarget.value);

      if (res) {
        setSearchResults(res);
        setSearching(false);
      }
    }
  };

  const selectItem = (index: number) => {
    setSearchValue(searchAsString(searchResults[index]));
    setValue(searchResults[index]);
    setShowPopover(false);
  };

  inputRef.current?.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown') {
      if (!showPopover && searchResults.length > 0) {
        setShowPopover(true);
        popoverRef.current?.focus();
      }
      if (showPopover && searchResults.length > 0) {
        popoverRef.current?.focus();
      }
    }
  });

  return (
    <div ref={containerRef}>
      <TextField label={label} value={searchValue} onChange={onChange} ref={inputRef} size={'small'} error={error} />
      {searchResults && searchResults.length > 0 && (
        <Popover
          ref={popoverRef}
          anchorEl={inputRef.current}
          open={showPopover}
          onClose={() => setShowPopover(false)}
          placement="bottom-start"
          arrow={false}
          tabIndex={0}
        >
          {searching && <Loader />}
          {searchResults.length > 0 && (
            <ul role="listbox" className={styles.list}>
              {searchResults.map((hit, index) => (
                <li
                  key={searchAsString(hit)}
                  tabIndex={0}
                  role="option"
                  aria-selected={hit === searchValue}
                  onMouseUp={() => selectItem(index)}
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      selectItem(index);
                    }
                    if (event.key === 'ArrowUp') {
                      console.log('Gå til forrige');
                    }
                    if (event.key === 'ArrowDown') {
                      console.log('Gå til neste');
                    }
                  }}
                  className={styles.listItem}
                >
                  {searchAsString(hit)}
                </li>
              ))}
            </ul>
          )}
        </Popover>
      )}
    </div>
  );
};
