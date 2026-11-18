import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import {
  hentMellomlagring,
  hentTrukketSøknad,
  hentUbesvarteForespørslerLegeerklæring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

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
  const [trukketSøknadGrunnlag] = await Promise.all([hentTrukketSøknad(behandlingsreferanse)]);

  const ubesvarteForespørslerResponse = await hentUbesvarteForespørslerLegeerklæring(behandlingsreferanse);

  if (isError(trukketSøknadGrunnlag)) {
    return <ApiException apiResponses={[trukketSøknadGrunnlag]} />;
  }

  const ubesvarteForespørslerEllerUndefinedVedFeil =
    ubesvarteForespørslerResponse !== undefined && isError(ubesvarteForespørslerResponse)
      ? undefined
      : (ubesvarteForespørslerResponse?.data?.forespørsler ?? []);

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
      ubesvarteForespørslerEllerUndefinedVedFeil={ubesvarteForespørslerEllerUndefinedVedFeil}
    />
  );
};
