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
}: Props) => {
  const [grunnlag, sak] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentSak(behandlingsReferanse),
  ]);
  return (
    <Bistandsbehov
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      typeBehandling={typeBehandling}
      søknadstidspunkt={sak.opprettetTidspunkt}
    />
  );
};
