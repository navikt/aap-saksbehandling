import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksInfo } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  sak: SaksInfo;
}

export const RefusjonMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly, sak }: Props) => {
  const refusjonGrunnlag = await hentRefusjonGrunnlag(behandlingsReferanse);
  if (refusjonGrunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }

  return (
    <Refusjon
      grunnlag={refusjonGrunnlag.data}
      readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      søknadstidspunkt={sak.periode.fom}
    />
  );
};
