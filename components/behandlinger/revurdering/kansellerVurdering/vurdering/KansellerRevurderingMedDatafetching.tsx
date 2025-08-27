import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { KansellerRevurderingVurdering } from './KansellerRevurderingVurdering';
import { hentKansellertRevurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const KansellerRevurderingMedDatafetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const kansellertRevurderingGrunnlag = await hentKansellertRevurdering(behandlingsreferanse);

  if (isError(kansellertRevurderingGrunnlag)) {
    return <ApiException apiResponses={[kansellertRevurderingGrunnlag]} />;
  }

  return (
    <KansellerRevurderingVurdering
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      grunnlag={kansellertRevurderingGrunnlag.data}
    />
  );
};
