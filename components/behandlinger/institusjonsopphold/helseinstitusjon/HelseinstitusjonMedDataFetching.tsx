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
  const [grunnlagGammel, grunnlagNy, initialMellomlagretVurdering] = await Promise.all([
    hentHelseInstitusjonsGrunnlagGammel(behandlingsreferanse),
    hentHelseInstitusjonsGrunnlagNy(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_HELSEINSTITUSJON),
  ]);
  if (isError(grunnlagGammel) || isError(grunnlagNy)) {
    return <ApiException apiResponses={[grunnlagGammel]} />;
  }

  const vurderinger = unleashService.isEnabled('PeriodiseringHelseinstitusjonOpphold')
    ? grunnlagNy.data.vurderinger
    : grunnlagGammel.data.vurderinger;

  if (!skalViseSteg(stegData, vurderinger.length > 0)) {
    return null;
  }

  return unleashService.isEnabled('PeriodiseringHelseinstitusjonOpphold') ? (
    <HelseinstitusjonNy
      grunnlag={grunnlagNy.data}
      readOnly={stegData.readOnly || !grunnlagNy.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Helseinstitusjon
      grunnlag={grunnlagGammel.data}
      readOnly={stegData.readOnly || !grunnlagGammel.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
