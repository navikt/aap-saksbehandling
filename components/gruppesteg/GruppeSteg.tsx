import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering, FlytVisning, StegGruppe } from 'lib/types/types';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';

interface Props {
  prosessering: FlytProsessering;
  visning: FlytVisning;
  behandlingReferanse: string;
  behandlingVersjon: number;
  aktivGruppe?: StegGruppe;
  children: ReactNode;
}

export const GruppeSteg = async ({
  children,
  visning,
  behandlingReferanse,
  behandlingVersjon,
  aktivGruppe,
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
        <BrevKortMedDataFetching behandlingReferanse={behandlingReferanse} behandlingVersjon={behandlingVersjon} />
      )}
      {children}
    </div>
  );
};
