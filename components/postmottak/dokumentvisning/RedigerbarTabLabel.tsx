'use client';

import { useEffect, useRef } from 'react';
import { HStack } from '@navikt/ds-react';
import { PencilIcon } from '@navikt/aksel-icons';
import styles from './Dokumentvisning.module.css';

interface Props {
  tittel: string;
  isEditing: boolean;
  editError: string | null;
  readOnly: boolean;
  onStartEditing: () => void;
  onInput: (value: string) => void;
}

export const RedigerbarTabLabel = ({ tittel, isEditing, editError, readOnly, onStartEditing, onInput }: Props) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isEditing && spanRef.current) {
      const node = spanRef.current;
      node.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(node);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && spanRef.current) {
      spanRef.current.textContent = tittel;
    }
  }, [isEditing, tittel]);

  return (
    <HStack align="center" gap="space-4" className={styles.tabLabel}>
      <span
        ref={spanRef}
        role={isEditing ? 'textbox' : undefined}
        aria-label={isEditing ? 'Dokumenttittel' : undefined}
        aria-invalid={isEditing && !!editError}
        contentEditable={isEditing}
        suppressContentEditableWarning
        style={{
          maxWidth: '160px',
          overflow: 'hidden',
          textOverflow: isEditing ? undefined : 'ellipsis',
          whiteSpace: 'nowrap',
          outline: 'none',
          borderBottom: isEditing ? `2px solid ${editError ? 'var(--a-border-danger)' : 'currentColor'}` : undefined,
          minWidth: isEditing ? '80px' : undefined,
        }}
        onInput={(e) => onInput(e.currentTarget.textContent ?? '')}
      >
        {tittel}
      </span>
      {!isEditing && !readOnly && (
        <span
          className={styles.editIcon}
          role="button"
          tabIndex={0}
          aria-label={`Endre tittel: ${tittel}`}
          onClick={(e) => {
            e.stopPropagation();
            onStartEditing();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onStartEditing();
            }
          }}
        >
          <PencilIcon aria-hidden />
        </span>
      )}
    </HStack>
  );
};
