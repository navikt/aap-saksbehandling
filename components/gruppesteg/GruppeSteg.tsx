import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering, FlytVisning } from 'lib/types/types';

interface Props {
  prosessering: FlytProsessering;
  visning: FlytVisning;
  behandlingReferanse: string;
  behandlingVersjon: number;
  children: ReactNode;
}

export const GruppeSteg = ({ children, visning, behandlingReferanse, behandlingVersjon, prosessering }: Props) => {
  return (
    <div className={'flex-column'}>
      {prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={prosessering} />}
      {visning.visVentekort && (
        <BehandlingPåVentKortMedDataFetching
          behandlingReferanse={behandlingReferanse}
          behandlingVersjon={behandlingVersjon}
        />
      )}
      {/*visning.visBrevkort && <BrevKortMedDataFetching behandlingReferanse={behandlingReferanse} />*/}
      {children}
    </div>
  );
};
