import { hentBistandsbehovGrunnlag, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';
import { TypeBehandling } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  saksId: string;
}

export const OppfølgingMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
  saksId,
}: Props) => {
  const [grunnlag, sak] = await Promise.all([hentBistandsbehovGrunnlag(behandlingsReferanse), hentSak(saksId)]);

  return (
    <Oppfølging
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      typeBehandling={typeBehandling}
      søknadstidspunkt={sak.opprettetTidspunkt}
    />
  );
};
