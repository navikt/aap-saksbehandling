'use client';

import { useEffect, useState } from 'react';
import { Button, HStack, Tabs, VStack } from '@navikt/ds-react';
import { Dokument } from 'lib/types/postmottakTypes';
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';

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
      fetch(`/postmottak/api/post/dokumenter/${journalpostId}/${dokumentInfoId}`, { method: 'GET' })
        .then((res) => res.blob())
        .then((blob: Blob) => {
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
    <VStack paddingBlock={'4'}>
      <HStack>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={isExpanded ? <ExpandIcon /> : <ShrinkIcon />}
          type={'button'}
          onClick={() => setIsExpandedAction(!isExpanded)}
        />
        <Tabs defaultValue="0" size="small">
          <Tabs.List>
            {dokumenter.map((dokument, index) => (
              <Tabs.Tab
                key={dokument.dokumentInfoId}
                value={`${index}`}
                label={`${dokument.tittel}`}
                onClick={() => setValgtDokumentInfoId(dokument.dokumentInfoId)}
              />
            ))}
          </Tabs.List>
        </Tabs>
      </HStack>
      {dataUri && (
        <object data={`${dataUri}#toolbar=0`} type="application/pdf" width="100%" height="100%">
          <p>
            Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a>
          </p>
        </object>
      )}
    </VStack>
  );
};
