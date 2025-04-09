import { hentBistandsbehovGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';
import { SaksInfo, TypeBehandling } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  sak: SaksInfo;
}

export const BistandsbehovMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
  sak,
}: Props) => {
  const grunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse);
  if (grunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Bistandsbehov
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      typeBehandling={typeBehandling}
      søknadstidspunkt={sak.periode.fom}
    />
  );
};
