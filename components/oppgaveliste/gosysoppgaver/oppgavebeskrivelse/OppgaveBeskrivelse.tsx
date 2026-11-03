import { useEffect, useId, useRef, useState } from 'react';
import { Button, VStack } from '@navikt/ds-react';
import styles from '../gosystabell/GosysTabell.module.css';

interface Props {
  beskrivelse: string;
}

export function OppgaveBeskrivelse({ beskrivelse }: Props) {
  const [utvidet, setUtvidet] = useState(false);
  const [erAvkortet, setErAvkortet] = useState(false);
  const tekstRef = useRef<HTMLParagraphElement>(null);
  const tekstId = useId();

  useEffect(() => {
    const tekst = tekstRef.current;
    if (!tekst) return;

    const observer = new ResizeObserver(() => {
      // Scrollheight er høyden hele teksten trenger, mens clientheight er høyden som er synlig.
      if (!utvidet) {
        setErAvkortet(tekst.scrollHeight > tekst.clientHeight);
      }
    });

    observer.observe(tekst);
    return () => observer.disconnect();
  }, [beskrivelse, utvidet]);

  return (
    <VStack gap="space-4" align="start">
      <p
        ref={tekstRef}
        id={tekstId}
        className={`${styles.beskrivelse} ${utvidet ? styles.utvidet : styles.forhaandsvisning}`}
      >
        {beskrivelse}
      </p>
      {erAvkortet && (
        <Button
          type="button"
          variant="tertiary"
          size="xsmall"
          onClick={() => setUtvidet((forrige) => !forrige)}
          aria-expanded={utvidet}
          aria-controls={tekstId}
        >
          {utvidet ? 'Vis mindre' : 'Vis hele beskrivelsen'}
        </Button>
      )}
    </VStack>
  );
}
