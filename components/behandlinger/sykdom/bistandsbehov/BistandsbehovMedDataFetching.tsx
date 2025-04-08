import { hentBistandsbehovGrunnlag, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';
import { TypeBehandling } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  saksId: string;
}

export const BistandsbehovMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
  saksId,
}: Props) => {
  const [grunnlag, sak] = await Promise.all([hentBistandsbehovGrunnlag(behandlingsReferanse), hentSak(saksId)]);

  if (sak.type === 'ERROR') {
    return <div>Kunne ikke finne sak.</div>;
  }

  return (
    <Bistandsbehov
      grunnlag={grunnlag}
      readOnly={readOnly || !grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      typeBehandling={typeBehandling}
      søknadstidspunkt={sak.data.periode.fom}
    />
  );
};
