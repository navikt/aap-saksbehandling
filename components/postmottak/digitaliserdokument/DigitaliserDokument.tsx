'use client';

import { Kategoriser } from './kategoriser/Kategoriser';
import { DigitaliseringsGrunnlag, KategoriserDokumentKategori } from 'lib/types/postmottakTypes';
import { useState } from 'react';
import { DigitaliserSøknad } from './søknad/DigitaliserSøknad';
import { DigitaliserMeldekort } from './meldekort/DigitaliserMeldekort';
import { Behovstype } from 'lib/postmottakForm';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { formaterDatoForBackend } from 'lib/utils/date';
import { DigitaliserAnnetRelevantDokument } from './annetrelevantdokument/DigitaliserAnnetRelevantDokument';
import { VStack } from '@navikt/ds-react';
import { DigitaliserKlage } from 'components/postmottak/digitaliserdokument/klage/DigitaliserKlage';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  registrertDato?: string | null;
  grunnlag: DigitaliseringsGrunnlag;
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
      // @ts-ignore
      referanse: behandlingsreferanse,
    });
  }

  return (
    <VStack gap={'4'}>
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
      {kategori === 'MELDEKORT' && (
        <DigitaliserMeldekort submit={handleSubmit} readOnly={readOnly} isLoading={isLoading} />
      )}
      {kategori === 'KLAGE' && (
        <DigitaliserKlage
          submit={handleSubmit}
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
        />
      )}
    </VStack>
  );
};
