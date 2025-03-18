import { ReactNode } from 'react';
import { BehandlingPåVentKortMedDataFetching } from 'components/sideprosesser/BehandlingPåVentKortMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { FlytProsessering, FlytVisning, StegGruppe } from 'lib/types/types';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';
import { Alert } from '@navikt/ds-react';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';

interface Props {
  prosessering: FlytProsessering;
  visning: FlytVisning;
  behandlingReferanse: string;
  avklaringsbehovKode: string;
  behandlingVersjon: number;
  aktivGruppe?: StegGruppe;
  children: ReactNode;
}

export const GruppeSteg = async ({
  children,
  visning,
  behandlingReferanse,
  avklaringsbehovKode,
  behandlingVersjon,
  aktivGruppe,
  prosessering,
}: Props) => {
  const harTilgang = await sjekkTilgang(behandlingReferanse, avklaringsbehovKode);
  console.log(harTilgang);
  return (
    <div className={'flex-column'}>
      {!harTilgang.tilgang && <Alert variant={'error'}>NEINEIHENEI</Alert>}
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
