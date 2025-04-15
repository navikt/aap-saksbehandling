import React from 'react';
import { GruppeSteg } from '../../gruppesteg/GruppeSteg';
import { hentFlyt } from '../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { VurderRettighetsperiodeMedDataFetching } from './VurderRettighetsperiodeMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Rettighetsperiode = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <VurderRettighetsperiodeMedDataFetching
        behandlingsreferanse={behandlingsReferanse}
        readOnly={flyt.visning.saksbehandlerReadOnly}
        behandlingVersjon={flyt.behandlingVersjon}
      />
    </GruppeSteg>
  );
};
