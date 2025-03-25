import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { hentRefusjonGrunnlag, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  saksId: string;
}

export const RefusjonMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly, saksId }: Props) => {
  const [refusjonGrunnlag, sak] = await Promise.all([hentRefusjonGrunnlag(behandlingsReferanse), hentSak(saksId)]);
  return (
    <Refusjon
      grunnlag={refusjonGrunnlag}
      readOnly={readOnly && !refusjonGrunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      søknadstidspunkt={sak.opprettetTidspunkt}
    />
  );
};
