import {
  hentMellomlagring,
  hentSykepengerErstatningGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { SykepengeerstatningOld } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykeoengeerstatingOld';
import { unleash } from 'lib/services/unleash';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const SykepengeerstatningMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSykepengerErstatningGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.VURDER_SYKEPENGEERSTATNING_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (
    !skalViseSteg(
      stegData,
      grunnlag.data.sisteVedtatteVurderinger.length > 0 || grunnlag.data.nyeVurderinger.length > 0
    )
  ) {
    return null;
  }

  if (!unleash.isEnabled('PeriodisertSPEFrontend')) {
    return (
      <SykepengeerstatningOld
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    );
  }

  return (
    <Sykepengeerstatning
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
