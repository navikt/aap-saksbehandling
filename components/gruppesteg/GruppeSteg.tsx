import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering, FlytVisning, StegGruppe, StegType } from 'lib/types/types';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';

interface Props {
  prosessering: FlytProsessering;
  visning: FlytVisning;
  behandlingReferanse: string;
  behandlingVersjon: number;
  children: ReactNode;
  aktivtSteg: StegType;
  aktivGruppe?: StegGruppe;
}

export const GruppeSteg = ({
  children,
  visning,
  behandlingReferanse,
  behandlingVersjon,
  aktivGruppe,
  aktivtSteg,
  prosessering,
}: Props) => {
  return (
    <div className={'flex-column'}>
      {prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={prosessering} />}
      {visning.visVentekort && (
        <BehandlingPåVentKortMedDataFetching
          behandlingReferanse={behandlingReferanse}
          behandlingVersjon={behandlingVersjon}
        />
      )}
      {visning.visBrevkort && aktivGruppe !== 'BREV' && (
        <BrevKortMedDataFetching
          behandlingReferanse={behandlingReferanse}
          behandlingVersjon={behandlingVersjon}
          aktivtSteg={aktivtSteg}
        />
      )}
      {children}
    </div>
  );
};
