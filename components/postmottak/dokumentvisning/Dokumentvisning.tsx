'use client';

import { useEffect, useState } from 'react';
import { BodyShort, Button, HStack, Tabs, Tooltip } from '@navikt/ds-react';
import { Dokument } from 'lib/types/postmottakTypes';
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';
import { Alert } from 'components/alert/Alert';

import styles from './Dokumentvisning.module.css';
import { postmottakHentDokumentClient } from 'lib/postmottakClientApi';

interface Props {
  journalpostId: string;
  dokumenter: (Dokument & { journalpostId?: string; kanForhaandsvises?: boolean; beskrivelse?: string })[];
  setIsExpandedAction: (isExpanded: boolean) => void;
  isExpanded: boolean;
}

export const Dokumentvisning = ({ journalpostId, dokumenter, setIsExpandedAction, isExpanded }: Props) => {
  const [valgtDokument, setValgtDokument] = useState(
    dokumenter[0] && JSON.stringify([dokumenter[0].journalpostId ?? journalpostId, dokumenter[0].dokumentInfoId])
  );
  const dokumentliste = dokumenter.map((dokument) => ({
    ...dokument,
    nøkkel: JSON.stringify([dokument.journalpostId ?? journalpostId, dokument.dokumentInfoId]),
  }));
  const aktivtDokument = dokumentliste.find(({ nøkkel }) => nøkkel === valgtDokument) ?? dokumentliste[0];

  return (
    <div className={styles.dokumentvisning}>
      <HStack gap={'space-8'} align={'center'} wrap={false}>
        <div className={styles.ekspanderknapp}>
          <Button
            variant={'tertiary'}
            size={'small'}
            icon={isExpanded ? <ShrinkIcon /> : <ExpandIcon />}
            aria-label={isExpanded ? 'Gjør dokumentvisningen smalere' : 'Utvid dokumentvisningen'}
            type={'button'}
            onClick={() => setIsExpandedAction(!isExpanded)}
          />
        </div>
        {aktivtDokument && (
          <Tabs
            className={styles.dokumentfaner}
            value={aktivtDokument.nøkkel}
            onChange={setValgtDokument}
            size="medium"
          >
            <Tabs.List aria-label="Dokumenter">
              {dokumentliste.map((dokument) => (
                <Tooltip
                  key={dokument.nøkkel}
                  content={[dokument.tittel, dokument.beskrivelse].filter(Boolean).join(', ')}
                >
                  <Tabs.Tab
                    value={dokument.nøkkel}
                    label={
                      <div style={{ maxWidth: '200px' }}>
                        <BodyShort truncate>
                          {dokument.tittel || `Dokument ${dokument.dokumentInfoId}`}
                          {dokument.journalpostId ? ` (${dokument.journalpostId})` : ''}
                        </BodyShort>
                      </div>
                    }
                  />
                </Tooltip>
              ))}
            </Tabs.List>
          </Tabs>
        )}
      </HStack>
      {!aktivtDokument ? (
        <BodyShort>Journalposten har ingen dokumenter som kan vises.</BodyShort>
      ) : aktivtDokument.kanForhaandsvises === false ? (
        <Alert variant="info">Dette dokumentet kan ikke forhåndsvises.</Alert>
      ) : (
        <DokumentForhåndsvisning
          key={aktivtDokument.nøkkel}
          journalpostId={aktivtDokument.journalpostId ?? journalpostId}
          dokumentInfoId={aktivtDokument.dokumentInfoId}
        />
      )}
    </div>
  );
};

const DokumentForhåndsvisning = ({
  journalpostId,
  dokumentInfoId,
}: {
  journalpostId: string;
  dokumentInfoId: string;
}) => {
  const [dataUri, setDataUri] = useState<string>();
  const [feil, setFeil] = useState(false);
  const [forsøk, setForsøk] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let objectURL: string | undefined;
    const hentDokument = async () => {
      try {
        const blob = await postmottakHentDokumentClient(journalpostId, dokumentInfoId, controller.signal);
        if (controller.signal.aborted) return;
        objectURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        setDataUri(objectURL);
      } catch {
        if (!controller.signal.aborted) setFeil(true);
      }
    };
    hentDokument();
    return () => {
      controller.abort();
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [journalpostId, dokumentInfoId, forsøk]);

  if (feil)
    return (
      <Alert variant="error">
        Kunne ikke hente dokumentet.
        <Button
          type="button"
          variant="tertiary"
          size="small"
          onClick={() => {
            setFeil(false);
            setForsøk(forsøk + 1);
          }}
        >
          Prøv igjen
        </Button>
      </Alert>
    );
  return dataUri ? (
    <div className={styles.pdf}>
      <iframe className={styles.iframe} src={dataUri} title="Dokumentvisning" />
    </div>
  ) : (
    <BodyShort role="status">Henter dokument …</BodyShort>
  );
};
