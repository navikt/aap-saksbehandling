import { VStack } from '@navikt/ds-react';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentFlyt, hentUnder18Grunnlag } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { Under18Avklaring } from './Under18Avklaring';
import { Under18Oversikt } from './Under18Oversikt';

interface Props {
  behandlingsreferanse: string;
}

export const Under18MedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentUnder18Grunnlag(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag)) {
    return <ApiException apiResponses={[flyt, grunnlag]} />;
  }

  const situasjon = grunnlag.data.aldersgrunnlag?.aldersgruppe;
  const steg = flyt.data.flyt.find(({ stegGruppe }) => stegGruppe === 'UNDER18')?.steg ?? [];
  const aktivStegIndex = steg.findIndex(({ stegType }) => stegType === flyt.data.aktivtSteg);
  const readOnly = flyt.data.visning.readOnly || flyt.data.behandlingVersjon !== grunnlag.data.behandling.versjon;
  return (
    <VStack gap="space-16">
      {situasjon &&
        steg.map(
          ({ stegType, avklaringsbehov }, index) =>
            (stegType === 'AVKLAR_UNDER18' || stegType === 'AVKLAR_UNDER18_SAMTYKKE') && (
              <Under18Avklaring
                key={`${behandlingsreferanse}-${flyt.data.behandlingVersjon}-${stegType}`}
                behandlingsreferanse={behandlingsreferanse}
                behandlingsVersjon={flyt.data.behandlingVersjon}
                grunnlag={grunnlag.data}
                situasjon={situasjon}
                steg={stegType}
                readOnly={readOnly || (index > aktivStegIndex && avklaringsbehov.length === 0)}
              />
            )
        )}
      <Under18Oversikt grunnlag={grunnlag.data} />
    </VStack>
  );
};
