import { Helseinstitusjon } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import {
  hentHelseInstitusjonsGrunnlagGammel,
  hentHelseInstitusjonsGrunnlagNy,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { HelseinstitusjonNy } from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/HelseinstitusjonNy';
import { unleashService } from 'lib/services/unleash/unleashService';

type Props = {
  behandlingsreferanse: string;
  stegData: StegData;
};

export const HelseinstitusjonMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    unleashService.isEnabled('PeriodiseringHelseinstitusjonOpphold')
      ? hentHelseInstitusjonsGrunnlagNy(behandlingsreferanse)
      : hentHelseInstitusjonsGrunnlagGammel(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_HELSEINSTITUSJON),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const vurderinger = grunnlag.data.vurderinger;
  const vedtatteVurderinger = grunnlag.data.vedtatteVurderinger;

  if (!skalViseSteg(stegData, vurderinger.length > 0 || vedtatteVurderinger.length > 0)) {
    return null;
  }

  return unleashService.isEnabled('PeriodiseringHelseinstitusjonOpphold') ? (
    <HelseinstitusjonNy
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Helseinstitusjon
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
