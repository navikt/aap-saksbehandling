import { hentAvbruttAktivitetspliktbehandling } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { AvbrytAktivitetspliktbehandlingVurdering } from 'components/behandlinger/aktivitetsplikt/avbryt/vurdering/AvbrytAktivitetspliktbehandlingVurdering';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const AvbrytAktivitetspliktbehandlingMedDatafetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const avbrytAktivitetspliktbehandlingGrunnlag = await hentAvbruttAktivitetspliktbehandling(behandlingsreferanse);

  if (isError(avbrytAktivitetspliktbehandlingGrunnlag)) {
    return <ApiException apiResponses={[avbrytAktivitetspliktbehandlingGrunnlag]} />;
  }

  return (
    <AvbrytAktivitetspliktbehandlingVurdering
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      grunnlag={avbrytAktivitetspliktbehandlingGrunnlag.data}
    />
  );
};
