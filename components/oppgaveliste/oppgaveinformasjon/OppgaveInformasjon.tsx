import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { LegeerklæringInfoboks } from 'components/oppgaveliste/legeerklæring/LegeerklæringInfoboks';
import { HStack } from '@navikt/ds-react';
import { Oppgave } from 'lib/types/oppgaveTypes';

interface Props {
  oppgave: Oppgave;
}

export const OppgaveInformasjon = ({ oppgave }: Props) => {
  const mottatSvarFraBehandler = oppgave.årsakerTilBehandling.some((element) =>
    ['MOTTATT_LEGEERKLÆRING', 'MOTTATT_AVVIST_LEGEERKLÆRING'].includes(element)
  );

  return (
    <HStack gap={'1'}>
      {oppgave.påVentTil && (
        <PåVentInfoboks frist={oppgave.påVentTil} årsak={oppgave.påVentÅrsak} begrunnelse={oppgave.venteBegrunnelse} />
      )}
      {mottatSvarFraBehandler && <LegeerklæringInfoboks />}
    </HStack>
  );
};
