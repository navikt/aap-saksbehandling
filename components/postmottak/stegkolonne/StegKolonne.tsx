import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { AvklarTemaMedDataFetching } from '../avklartema/AvklarTemaMedDataFetching';
import { StegGruppe } from 'lib/types/postmottakTypes';
import { FinnSakMedDataFetching } from '../finnsak/FinnSakMedDataFetching';
import { DigitaliserDokumentMedDatafetching } from '../digitaliserdokument/DigitaliserDokumentMedDatafetching';
import React from 'react';
import { OverleveringMedDataFetching } from '../overlevering/OverleveringMedDataFetching';
import { Alert, VStack } from '@navikt/ds-react';

interface Props {
  aktivGruppe: StegGruppe;
  behandlingsreferanse: string;
}

export const StegKolonne = ({ aktivGruppe, behandlingsreferanse }: Props) => {
  // Det er her vi gjør datafetching og rendering av stegene
  return (
    <div>
      {aktivGruppe === 'AVKLAR_TEMA' && (
        <StegSuspense>
          <AvklarTemaMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
      {aktivGruppe === 'AVKLAR_SAK' && (
        <StegSuspense>
          <FinnSakMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
      {aktivGruppe === 'VIDERESEND' && (
        <VStack padding={'4'} gap={'4'}>
          <Alert variant={'success'}>Dokumentet er journalført.</Alert>
        </VStack>
      )}
      {aktivGruppe === 'IVERKSETTES' && (
        <VStack padding={'4'} gap={'4'}>
          <Alert variant={'success'}>Dokumentet er kategorisert og sendt.</Alert>
        </VStack>
      )}
      {aktivGruppe === 'DIGITALISER' && (
        <StegSuspense>
          <DigitaliserDokumentMedDatafetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
      {aktivGruppe === 'OVERLEVER_TIL_FAGSYSTEM' && (
        <StegSuspense>
          <OverleveringMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
    </div>
  );
};
