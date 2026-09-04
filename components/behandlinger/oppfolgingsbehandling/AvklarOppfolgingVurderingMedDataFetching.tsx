import { AvklaroppfolgingVurdering } from './AvklarOppfolgingVurdering';
import {
  hentMellomlagring,
  hentOppfølgingsoppgaveGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from '../../saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  erIkkePåVent: boolean;
}

export const AvklarOppfolgingVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  erIkkePåVent,
}: Props) => {
  const grunnlag = await hentOppfølgingsoppgaveGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const behovsType =
    grunnlag.data.hvemSkalFølgeOpp == 'NasjonalEnhet'
      ? Behovstype.AVKLAR_OPPFØLGINGSBEHOV_NAY
      : Behovstype.AVKLAR_OPPFØLGINGSBEHOV_LOKALKONTOR;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    behovsType,
    readOnly,
    erIkkePåVent
  );

  return (
    <AvklaroppfolgingVurdering
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
