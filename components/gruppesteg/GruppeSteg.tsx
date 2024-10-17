import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering } from 'lib/types/types';

interface Props {
  prosessering: FlytProsessering;
  visVenteKort: boolean;
  behandlingReferanse: string;
  behandlingVersjon: number;
  children: ReactNode;
}

export const GruppeSteg = ({ children, visVenteKort, behandlingReferanse, behandlingVersjon, prosessering }: Props) => {
  return (
    <div className={'flex-column'}>
      {prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={prosessering} />}
      {visVenteKort && (
        <BehandlingPåVentKortMedDataFetching
          behandlingReferanse={behandlingReferanse}
          behandlingVersjon={behandlingVersjon}
        />
      )}
      {children}
    </div>
  );
};
