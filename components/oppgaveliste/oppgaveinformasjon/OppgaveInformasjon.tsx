import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { LegeerklæringInfoboks } from 'components/oppgaveliste/legeerklæring/LegeerklæringInfoboks';
import { HStack } from '@navikt/ds-react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Returboks } from '../returboks/Returboks';
import { AdressebeskyttelseInfoBoks } from 'components/oppgaveliste/adressebeskyttelse/AdressebeskyttelseInfoBoks';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';

interface Props {
  oppgave: Oppgave;
}

export const OppgaveInformasjon = ({ oppgave }: Props) => {
  const mottatSvarFraBehandler = oppgave.årsakerTilBehandling.some((element) =>
    ['MOTTATT_LEGEERKLÆRING', 'MOTTATT_AVVIST_LEGEERKLÆRING'].includes(element)
  );

  const adressebeskyttelser = utledAdressebeskyttelse(oppgave);

  return (
    <HStack gap={'1'}>
      {oppgave.påVentTil && (
        <PåVentInfoboks frist={oppgave.påVentTil} årsak={oppgave.påVentÅrsak} begrunnelse={oppgave.venteBegrunnelse} />
      )}
      {mottatSvarFraBehandler && <LegeerklæringInfoboks />}
      {oppgave.returInformasjon && <Returboks oppgave={oppgave} />}
      {adressebeskyttelser.map((adressebeskyttelse) => (
        <AdressebeskyttelseInfoBoks key={adressebeskyttelse} adressebeskyttelseGrad={adressebeskyttelse} />
      ))}
    </HStack>
  );
};
