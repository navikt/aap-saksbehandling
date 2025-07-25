import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { SvarFraBehandler } from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler';
import { HStack } from '@navikt/ds-react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Returboks } from '../returboks/Returboks';
import { AdressebeskyttelseInfoBoks } from 'components/oppgaveliste/adressebeskyttelse/AdressebeskyttelseInfoBoks';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';
import { MarkeringInfoboks } from 'components/markeringinfoboks/MarkeringInfoboks';

interface Props {
  oppgave: Oppgave;
}

export const OppgaveInformasjon = ({ oppgave }: Props) => {
  const adressebeskyttelser = utledAdressebeskyttelse(oppgave);

  return (
    <HStack gap={'1'}>
      {oppgave.påVentTil && (
        <PåVentInfoboks frist={oppgave.påVentTil} årsak={oppgave.påVentÅrsak} begrunnelse={oppgave.venteBegrunnelse} />
      )}
      {oppgave.harUlesteDokumenter && <SvarFraBehandler />}
      {oppgave.returInformasjon && <Returboks oppgave={oppgave} />}
      {adressebeskyttelser.map((adressebeskyttelse) => (
        <AdressebeskyttelseInfoBoks key={adressebeskyttelse} adressebeskyttelseGrad={adressebeskyttelse} />
      ))}
      {oppgave.markeringer.map((markering) => (
        <MarkeringInfoboks
          markering={markering}
          key={markering.markeringType}
          referanse={oppgave.behandlingRef}
          size={'xsmall'}
        />
      ))}
    </HStack>
  );
};
