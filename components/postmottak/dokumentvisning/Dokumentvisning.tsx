'use client';

import { useEffect, useState } from 'react';
import { BodyShort, Button, HStack, Tabs, Tooltip } from '@navikt/ds-react';
import { Dokument } from 'lib/types/postmottakTypes';
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';

import styles from './Dokumentvisning.module.css';
import { postmottakHentDokumentClient } from 'lib/postmottakClientApi';

interface Props {
  journalpostId: number;
  dokumenter: Dokument[];
  setIsExpandedAction: (isExpanded: boolean) => void;
  isExpanded: boolean;
}

export const Dokumentvisning = ({ journalpostId, dokumenter, setIsExpandedAction, isExpanded }: Props) => {
  const [valgtDokumentInfoId, setValgtDokumentInfoId] = useState<string | undefined>(
    dokumenter && dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : undefined
  );

  const [dataUri, setDataUri] = useState<string>();

  useEffect(() => {
    const hentDokument = async (dokumentInfoId: string) => {
      postmottakHentDokumentClient(journalpostId, dokumentInfoId).then((blob: Blob) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        new Promise((res) => {
          reader.onloadend = function () {
            res(reader.result);
          };
        }).then((dataUri) => setDataUri(dataUri as string));
      });
    };

    if (valgtDokumentInfoId) {
      hentDokument(valgtDokumentInfoId);
    }
  }, [valgtDokumentInfoId, journalpostId]);

  return (
    <div className={styles.dokumentvisning}>
      <HStack gap={'2'} align={'center'}>
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
            {dokumenter.map((dokument, index) => (
              <Tooltip key={dokument.dokumentInfoId} content={dokument.tittel || ''}>
                <Tabs.Tab
                  value={`${index}`}
                  label={
                    <div style={{ maxWidth: '200px' }}>
                      <BodyShort truncate>{dokument.tittel}</BodyShort>
                    </div>
                  }
                  onClick={() => setValgtDokumentInfoId(dokument.dokumentInfoId)}
                />
              </Tooltip>
            ))}
          </Tabs.List>
        </Tabs>
      </HStack>
      {dataUri && (
        <div className={styles.pdf}>
          <object data={`${dataUri}#toolbar=0`} type="application/pdf" width="100%" height="100%">
            <p>
              Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a>
            </p>
          </object>
        </div>
      )}
    </div>
  );
};
