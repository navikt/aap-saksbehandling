import { Helseinstitusjon } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjon';
import { hentHelseInstitusjonsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

type Props = {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const HelseinstitusjonMedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentHelseInstitusjonsVurdering(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Helseinstitusjon
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
