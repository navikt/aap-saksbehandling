import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering, FlytVisning, StegType } from 'lib/types/types';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  prosessering: FlytProsessering;
  visning: FlytVisning;
  behandlingReferanse: string;
  behandlingVersjon: number;
  brevForhåndsvisning?: boolean;
  children: ReactNode;
  aktivtSteg: StegType;
}

export const GruppeSteg = ({
  children,
  visning,
  behandlingReferanse,
  brevForhåndsvisning = true,
  behandlingVersjon,
  aktivtSteg,
  prosessering,
}: Props) => {
  const skalViseAlertForGjennomførtKvalitetssikring =
    aktivtSteg !== 'KVALITETSSIKRING' && aktivtSteg !== 'BREV' && visning.brukerHarKvalitetssikret;

  const skalViseAlertForGjennomførtBesluttet = visning.brukerHarBesluttet && aktivtSteg !== 'BREV';

  return (
    <div className={'flex-column'}>
      {skalViseAlertForGjennomførtBesluttet && (
        <KelvinAlert variant={'info'}>
          Som aktiv beslutter i denne behandlingen kan du ikke gjøre vilkårsvurderinger i denne behandlingen.
        </KelvinAlert>
      )}
      {skalViseAlertForGjennomførtKvalitetssikring && (
        <KelvinAlert variant={'info'}>
          Du har gjort kvalitetssikring og kan ikke gjøre vilkårsvurderinger i denne behandlingen.
        </KelvinAlert>
      )}
      {prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={prosessering} />}
      {visning.visVentekort && (
        <BehandlingPåVentKortMedDataFetching
          behandlingReferanse={behandlingReferanse}
          behandlingVersjon={behandlingVersjon}
        />
      )}
      {visning.visBrevkort && brevForhåndsvisning && aktivtSteg !== 'BREV' && (
        <BrevKortMedDataFetching
          behandlingReferanse={behandlingReferanse}
          behandlingVersjon={behandlingVersjon}
          aktivtSteg={aktivtSteg}
          behandlingstype={visning.typeBehandling}
        />
      )}
      {children}
    </div>
  );
};
