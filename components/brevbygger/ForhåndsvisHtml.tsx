'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@navikt/ds-react';

import styles from './ForhåndsvisHtml.module.css';

interface Props {
  html: string | undefined;
  isLoading: boolean;
  markerteDelmalKeys: Set<string>;
}

function parseToDiv(html: string): HTMLDivElement {
  const body = new DOMParser().parseFromString(html, 'text/html').body;
  const div = document.createElement('div');
  div.innerHTML = body.innerHTML;
  return div;
}

function leggTilMarkeringer(container: HTMLDivElement, keys: Set<string>, className: string) {
  container.querySelectorAll(`.${className}`).forEach((el) => el.classList.remove(className));
  keys.forEach((key) => container.querySelector(`#brev_${key}`)?.classList.add(className));
}

export const ForhåndsvisHtml = ({ html, isLoading, markerteDelmalKeys }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerteDelmalKeysRef = useRef(markerteDelmalKeys);
  markerteDelmalKeysRef.current = markerteDelmalKeys;

  // når html-en oppdateres pga en endring fra bruker
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;

    container.innerHTML = parseToDiv(html).innerHTML;
    leggTilMarkeringer(container, markerteDelmalKeysRef.current, styles.valgtBrevmal);
  }, [html]);

  // når vi endrer hvilke delmaler som er markert
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    leggTilMarkeringer(container, markerteDelmalKeys, styles.valgtBrevmal);
  }, [markerteDelmalKeys]);

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
