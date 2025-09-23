import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { AvbrytRevurderingVurdering } from 'components/behandlinger/revurdering/avbrytVurdering/vurdering/AvbrytRevurderingVurdering';
import { hentAvbruttRevurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const AvbrytRevurderingMedDatafetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const avbrytRevurderingGrunnlag = await hentAvbruttRevurdering(behandlingsreferanse);

  if (isError(avbrytRevurderingGrunnlag)) {
    return <ApiException apiResponses={[avbrytRevurderingGrunnlag]} />;
  }

  return (
    <AvbrytRevurderingVurdering
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      grunnlag={avbrytRevurderingGrunnlag.data}
    />
  );
};
