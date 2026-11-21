import { VStack } from '@navikt/ds-react';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { BekreftBrevSendt } from 'components/behandlinger/utenlandsopphold/BekreftBrevSendt';
import { VurderSøknadUtenlandsopphold } from 'components/behandlinger/utenlandsopphold/VurderSøknadUtenlandsopphold';
import {
  hentMellomlagring,
  hentSøknadUtenlandsoppholdGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  erIkkePåVent: boolean;
}

export const UtenlandsoppholdMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  erIkkePåVent,
}: Props) => {
  const grunnlag = await hentSøknadUtenlandsoppholdGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_SØKNAD_UTENLANDSOPPHOLD_KODE,
    readOnly,
    erIkkePåVent
  );

  return (
    <VStack gap="space-16">
      <VurderSøknadUtenlandsopphold
        grunnlag={grunnlag.data}
        behandlingVersjon={behandlingVersjon}
        readOnly={readOnly}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
      {grunnlag.data.vurdering && (
        <BekreftBrevSendt grunnlag={grunnlag.data} behandlingVersjon={behandlingVersjon} readOnly={readOnly} />
      )}
    </VStack>
  );
};
