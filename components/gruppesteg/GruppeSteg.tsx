import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering, FlytVisning, StegType } from 'lib/types/types';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';

interface Props {
  prosessering: FlytProsessering;
  visning: FlytVisning;
  behandlingReferanse: string;
  behandlingVersjon: number;
  children: ReactNode;
  aktivtSteg: StegType;
}

export const GruppeSteg = ({
  children,
  visning,
  behandlingReferanse,
  behandlingVersjon,
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
      {visning.visBrevkort && aktivtSteg !== 'BREV' && (
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
