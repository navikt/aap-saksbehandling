'use client'

import { BodyShort, List } from '@navikt/ds-react';
import {DokumentContext} from 'components/dokumentprovider/DokumentProvider';
import { useContext, useEffect, useMemo } from 'react';
interface Props {
  dokumenter?: string[];
}

export const TilknyttedeDokumenter = ({ dokumenter }: Props) => {
  const dokumenterFraContext = useContext(DokumentContext);
  return (
    <List as={'ul'} title={'Tilknyttede dokumenter'} size={'small'}>
      {dokumenterFraContext && dokumenterFraContext.length > 0 ? (
        dokumenterFraContext?.map((dokument) => <List.Item key={dokument.dokumentId}>{dokument.tittel}</List.Item>)
      ) : (
        <BodyShort as={'p'} size={'small'}>
          Ingen dokumenter er valgt
        </BodyShort>
      )}
    </List>
  );
};
