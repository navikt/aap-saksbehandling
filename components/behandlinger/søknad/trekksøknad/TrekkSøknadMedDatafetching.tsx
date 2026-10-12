import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import {
  hentMellomlagring,
  hentTrukketSøknad,
  hentUbesvarteForespørslerLegeerklæring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
  erIkkePåVent: boolean;
}

export const TrekkSøknadMedDatafetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
  erIkkePåVent,
}: Props) => {
  const viseVentendeLEToggle = unleashService.isEnabled('VisInfoTrekkSoknadForesporselOmLe');

  const [trukketSøknadGrunnlag] = await Promise.all([hentTrukketSøknad(behandlingsreferanse)]);

  const ubesvarteForespørsler = viseVentendeLEToggle
    ? await hentUbesvarteForespørslerLegeerklæring(behandlingsreferanse)
    : undefined;

  if (isError(trukketSøknadGrunnlag)) {
    return <ApiException apiResponses={[trukketSøknadGrunnlag]} />;
  }

  if (isError(ubesvarteForespørsler)) {
    return <ApiException apiResponses={[ubesvarteForespørsler]} />;
  }

  const skalViseVentendeLegeerklæringBeskjed =
    viseVentendeLEToggle &&
    ubesvarteForespørsler?.data?.forespørsler?.length !== undefined &&
    ubesvarteForespørsler?.data?.forespørsler?.length > 0;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
    readOnly,
    erIkkePåVent
  );

  return (
    <TrekkSøknad
      grunnlag={trukketSøknadGrunnlag.data}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      skalViseVentendeLegeerklæringBeskjed={skalViseVentendeLegeerklæringBeskjed}
    />
  );
};
