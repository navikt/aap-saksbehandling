'use client';

import { VStack } from '@navikt/ds-react';
import { useFeatureFlag } from 'context/UnleashContext';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/postmottakForm';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { DigitaliseringsGrunnlag, KategoriserDokumentKategori } from 'lib/types/postmottakTypes';
import { formaterDatoForBackend } from 'lib/utils/date';
import { useState } from 'react';

import { DigitaliserKlage } from 'components/postmottak/digitaliserdokument/klage/DigitaliserKlage';
import { DigitaliserMeldekort } from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekort';
import { DigitaliserMeldekortV2 } from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekortV2';

import { DigitaliserAnnetRelevantDokument } from './annetrelevantdokument/DigitaliserAnnetRelevantDokument';
import { Kategoriser } from './kategoriser/Kategoriser';
import { DigitaliserSøknad } from './søknad/DigitaliserSøknad';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  registrertDato?: string | null;
  grunnlag: DigitaliseringsGrunnlag;
  oppgave: Oppgave;
  readOnly: boolean;
}

export interface Submittable {
  submit: (kategori: KategoriserDokumentKategori, jsonString: string | null, søknadsdato: Date | null) => void;
}

export const DigitaliserDokument = ({
  behandlingsVersjon,
  behandlingsreferanse,
  grunnlag,
  readOnly,
  oppgave,
  registrertDato,
}: Props) => {
  const [kategori, setKategori] = useState<KategoriserDokumentKategori | undefined>(grunnlag.vurdering?.kategori);
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = usePostmottakLøsBehovOgGåTilNesteSteg('DIGITALISER_DOKUMENT');

  function handleSubmit(kategori: KategoriserDokumentKategori, jsonString: string | null, søknadsdato: Date | null) {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingsVersjon,
      behov: {
        behovstype: Behovstype.DIGITALISER_DOKUMENT,
        kategori: kategori,
        strukturertDokument: jsonString,
        søknadsdato: søknadsdato && formaterDatoForBackend(søknadsdato),
      },
      referanse: behandlingsreferanse,
    });
  }

  const erKravEnabled = useFeatureFlag('KravSteg');
  const erRevurdereFrivilligeEnabled = useFeatureFlag('RevurdereFrivillige');
  const erVarselNaarDetFinnesTimerPaaMeldeperiodeEnabled = useFeatureFlag('VarselNaarDetFinnesTimerPaaMeldeperiode');

  return (
    <VStack gap={'space-16'}>
      <Kategoriser
        submit={handleSubmit}
        kategori={kategori}
        readOnly={readOnly}
        onKategoriChange={setKategori}
        status={status}
      />
      {kategori === 'SØKNAD' && (
        <DigitaliserSøknad
          submit={handleSubmit}
          grunnlag={grunnlag}
          registrertDato={registrertDato}
          readOnly={readOnly}
          isLoading={isLoading}
        />
      )}
      {kategori === 'MELDEKORT' && !erVarselNaarDetFinnesTimerPaaMeldeperiodeEnabled && (
        <DigitaliserMeldekortV2 submit={handleSubmit} readOnly={readOnly} isLoading={isLoading} />
      )}
      {kategori === 'MELDEKORT' && erVarselNaarDetFinnesTimerPaaMeldeperiodeEnabled && (
        <DigitaliserMeldekort submit={handleSubmit} readOnly={readOnly} isLoading={isLoading} oppgave={oppgave} />
      )}

      {kategori === 'KLAGE' && (
        <DigitaliserKlage
          submit={handleSubmit}
          grunnlag={grunnlag}
          readOnly={readOnly}
          isLoading={isLoading}
          registrertDato={registrertDato}
        />
      )}
      {kategori === 'ANNET_RELEVANT_DOKUMENT' && (
        <DigitaliserAnnetRelevantDokument
          submit={handleSubmit}
          grunnlag={grunnlag}
          readOnly={readOnly}
          isLoading={isLoading}
          erKravEnabled={erKravEnabled}
          erRevurdereFrivilligeEnabled={erRevurdereFrivilligeEnabled}
        />
      )}
    </VStack>
  );
};
