'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@navikt/ds-react';

import styles from './ForhåndsvisHtml.module.css';

interface Props {
  html: string | undefined;
  isLoading: boolean;
}

function parseToDiv(html: string): HTMLDivElement {
  const body = new DOMParser().parseFromString(html, 'text/html').body;
  const div = document.createElement('div');
  div.innerHTML = body.innerHTML;
  return div;
}

export const ForhåndsvisHtml = ({ html, isLoading }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;

    const newDiv = parseToDiv(html);

    container.innerHTML = newDiv.innerHTML;
  }, [html]);

  return (
    <div className={styles.wrapper}>
      {isLoading && (
        <div className={styles.overlay}>
          <Loader size="2xlarge" title="Laster forhåndsvisning..." transparent />
        </div>
      )}
      <div ref={containerRef} className={styles.container} />
    </div>
  );
};
