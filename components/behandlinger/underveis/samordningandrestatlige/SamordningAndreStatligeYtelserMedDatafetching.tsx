import { SamordningAndreStatligeYtelser } from 'components/behandlinger/underveis/samordningandrestatlige/SamordningAndreStatligeYtelser';
import { hentSamordningAndreStatligeYtelseGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningAndreStatligeYtelserMedDatafetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingsreferanse,
}: Props) => {
  const grunnlag = await hentSamordningAndreStatligeYtelseGrunnlag(behandlingsreferanse);
  return (
    <SamordningAndreStatligeYtelser grunnlag={grunnlag} behandlingVersjon={behandlingVersjon} readOnly={readOnly} />
  );
};
