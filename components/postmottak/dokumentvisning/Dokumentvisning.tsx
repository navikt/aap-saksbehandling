'use client';

import { useEffect, useState } from 'react';
import { Button, ErrorMessage, HStack, Tabs, Tooltip } from '@navikt/ds-react';
import { Dokument } from 'lib/types/postmottakTypes';
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';

import styles from './Dokumentvisning.module.css';
import { postmottakHentDokumentClient } from 'lib/postmottakClientApi';
import { useDokumentTitler } from 'context/postmottak/DokumentTitlerContext';
import { RedigerbarTabLabel } from './RedigerbarTabLabel';

interface Props {
  journalpostId: number;
  dokumenter: Dokument[];
  setIsExpandedAction: (isExpanded: boolean) => void;
  isExpanded: boolean;
}

export const Dokumentvisning = ({ journalpostId, dokumenter, setIsExpandedAction, isExpanded }: Props) => {
  const [valgtDokumentInfoId, setValgtDokumentInfoId] = useState<string | undefined>(
    dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : undefined
  );
  const [dataUri, setDataUri] = useState<string>();
  const [editingDokumentInfoId, setEditingDokumentInfoId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const { titler, setTittel, readOnly } = useDokumentTitler();

  useEffect(() => {
    let objectURL: string | undefined;
    const hentDokument = async (dokumentInfoId: string) => {
      const blob = await postmottakHentDokumentClient(journalpostId, dokumentInfoId);
      objectURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      setDataUri(objectURL);
    };
    if (valgtDokumentInfoId) hentDokument(valgtDokumentInfoId);
    return () => {
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [valgtDokumentInfoId, journalpostId]);

  const startEditing = (dokumentInfoId: string) => {
    setEditError(null);
    setEditingDokumentInfoId(dokumentInfoId);
    setEditValue(titler[dokumentInfoId] ?? '');
  };

  const lagreTittel = (dokumentInfoId: string, verdi: string) => {
    if (!verdi.trim()) {
      setEditError('Dokumenttittel må være satt');
      return;
    }
    setEditError(null);
    setTittel(dokumentInfoId, verdi);
    setEditingDokumentInfoId(null);
  };

  const lagreVedKlikkUtenfor = (dokumentInfoId: string, verdi: string) => {
    if (verdi.trim()) setTittel(dokumentInfoId, verdi);
    setEditError(null);
    setEditingDokumentInfoId(null);
  };

  const avbrytEditing = () => {
    setEditError(null);
    setEditingDokumentInfoId(null);
  };

  return (
    <div className={styles.dokumentvisning}>
      <div
        tabIndex={-1}
        onBlur={(e) => {
          if (editingDokumentInfoId && !e.currentTarget.contains(e.relatedTarget)) {
            lagreVedKlikkUtenfor(editingDokumentInfoId, editValue);
          }
        }}
      >
        <HStack gap={'space-8'} align={'center'}>
          <div className={styles.ekspanderknapp}>
            <Button
              variant={'tertiary'}
              size={'small'}
              icon={isExpanded ? <ShrinkIcon /> : <ExpandIcon />}
              type={'button'}
              onClick={() => setIsExpandedAction(!isExpanded)}
            />
          </div>
          <Tabs defaultValue="0" size="medium">
            <Tabs.List>
              {dokumenter.map((dokument, index) => {
                const isEditing = editingDokumentInfoId === dokument.dokumentInfoId;
                const tittel = titler[dokument.dokumentInfoId] ?? '';
                return (
                  <Tooltip key={dokument.dokumentInfoId} content={isEditing ? '' : tittel}>
                    <Tabs.Tab
                      value={`${index}`}
                      label={
                        <RedigerbarTabLabel
                          tittel={tittel}
                          isEditing={isEditing}
                          editError={editError}
                          readOnly={readOnly}
                          onStartEditing={() => startEditing(dokument.dokumentInfoId)}
                          onInput={(value) => {
                            setEditError(null);
                            setEditValue(value);
                          }}
                        />
                      }
                      onClick={() => {
                        setValgtDokumentInfoId(dokument.dokumentInfoId);
                        if (editingDokumentInfoId !== dokument.dokumentInfoId) avbrytEditing();
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Tabs.List>
            {editError && <ErrorMessage size="small">{editError}</ErrorMessage>}
          </Tabs>
        </HStack>

        {editingDokumentInfoId && (
          <HStack gap="space-8" paddingInline="space-12 space-0" paddingBlock="space-8 space-0">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => lagreTittel(editingDokumentInfoId, editValue)}
            >
              Lagre
            </Button>
            <Button type="button" variant="tertiary" size="small" onClick={avbrytEditing}>
              Avbryt
            </Button>
          </HStack>
        )}
      </div>

      {dataUri && (
        <div className={styles.pdf}>
          <object data={`${dataUri}#toolbar=0`} type="application/pdf" width="100%" height="100%">
            <p>Visning av dokument</p>
          </object>
        </div>
      )}
    </div>
  );
};
