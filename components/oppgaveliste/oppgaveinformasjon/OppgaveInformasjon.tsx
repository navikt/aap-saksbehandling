'use client';

import { HStack } from '@navikt/ds-react';
import { useFeatureFlag } from 'context/UnleashContext';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';

import { MarkeringInfoboks } from 'components/markeringinfoboks/MarkeringInfoboks';
import { AdressebeskyttelseInfoBoks } from 'components/oppgaveliste/adressebeskyttelse/AdressebeskyttelseInfoBoks';
import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { SvarFraBehandler } from 'components/oppgaveliste/svarfrabehandler/SvarFraBehandler';
import { UtløptVentefristBoks } from 'components/oppgaveliste/utløptventefristboks/UtløptVentefristBoks';

import { Returboks } from '../returboks/Returboks';

interface Props {
  oppgave: OppgaveMedKontekst;
}

export const OppgaveInformasjon = ({ oppgave }: Props) => {
  const adressebeskyttelser = utledAdressebeskyttelse(oppgave.oppgavelisteTags.skjermingInfo);
  const ventStatusForTilbakekreving = useFeatureFlag('VentStatusForTilbakekreving');

  const mottattDialogmelding = oppgave.vurderingsbehov.some((x) => x == 'MOTTATT_DIALOGMELDING');
  const mottattLegeerklæring = oppgave.vurderingsbehov.some((x) => x == 'MOTTATT_LEGEERKLÆRING');
  const mottattAnnenMelding =
    oppgave.oppgavelisteTags.harUlesteDokumenter && !mottattDialogmelding && !mottattLegeerklæring;

  return (
    <HStack gap={'space-4'}>
      {oppgave.oppgavelisteTags.påVentInfo &&
        (oppgave.behandlingskontekst.behandlingstype !== 'TILBAKEKREVING' || ventStatusForTilbakekreving) && (
          <PåVentInfoboks
            frist={oppgave.oppgavelisteTags.påVentInfo.påVentTil}
            årsak={oppgave.oppgavelisteTags.påVentInfo.påVentÅrsak}
            begrunnelse={oppgave.oppgavelisteTags.påVentInfo.venteBegrunnelse}
          />
        )}
      {oppgave.oppgavelisteTags.forrigePåVentInfo &&
        (oppgave.behandlingskontekst.behandlingstype !== 'TILBAKEKREVING' || ventStatusForTilbakekreving) && (
          <UtløptVentefristBoks
            frist={oppgave.oppgavelisteTags.forrigePåVentInfo.påVentTil}
            årsak={oppgave.oppgavelisteTags.forrigePåVentInfo.påVentÅrsak}
            begrunnelse={oppgave.oppgavelisteTags.forrigePåVentInfo.venteBegrunnelse}
          />
        )}
      {mottattDialogmelding && <SvarFraBehandler dokumenttype={'Melding eller tilleggsopplysninger'} />}
      {mottattLegeerklæring && <SvarFraBehandler dokumenttype={'Legeerklæring'} />}
      {mottattAnnenMelding && <SvarFraBehandler dokumenttype={'Dokument'} />}
      {oppgave.oppgavelisteTags.returInformasjon && (
        <Returboks
          returInformasjon={oppgave.oppgavelisteTags.returInformasjon}
          forrigeKvalitetssikrerInfo={oppgave.oppgavelisteTags.forrigeKvalitetssikrerInfo}
        />
      )}
      {adressebeskyttelser.map((adressebeskyttelse) => (
        <AdressebeskyttelseInfoBoks key={adressebeskyttelse} adressebeskyttelseGrad={adressebeskyttelse} />
      ))}
      {oppgave.oppgavelisteTags.markeringer.map((markering) => (
        <MarkeringInfoboks
          markering={markering}
          key={markering.markeringType}
          referanse={oppgave.behandlingskontekst.behandlingsreferanse}
          size={'xsmall'}
        />
      ))}
    </HStack>
  );
};
