import React from 'react';
import { GruppeSteg } from '../../gruppesteg/GruppeSteg';
import { hentFlyt } from '../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { VurderRettighetsperiodeMedDataFetching } from './VurderRettighetsperiodeMedDataFetching';
import { isError } from '../../../lib/utils/api';
import { ApiException } from '../../saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
}

export const Rettighetsperiode = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <VurderRettighetsperiodeMedDataFetching
        behandlingsreferanse={behandlingsReferanse}
        readOnly={flyt.data.visning.saksbehandlerReadOnly}
        behandlingVersjon={flyt.data.behandlingVersjon}
      />
    </GruppeSteg>
  );
};
