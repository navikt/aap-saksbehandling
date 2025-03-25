import { SamordningUføre } from 'components/behandlinger/underveis/samordninguføre/SamordningUføre';
import { hentSamordningUføreGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningUføreMedDatafetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentSamordningUføreGrunnlag(behandlingsreferanse);
  return (
    <SamordningUføre
      grunnlag={grunnlag}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly && !grunnlag.harTilgangTilÅSaksbehandle}
    />
  );
};
