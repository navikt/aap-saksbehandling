import { Aktivitetsplikt } from 'components/behandlinger/underveis/aktivitetsplikt/Aktivitetsplikt';
import { hentAktivitetspliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const AktivitetspliktMedDatafetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentAktivitetspliktGrunnlag(behandlingsreferanse);
  return (
    <Aktivitetsplikt
      grunnlag={grunnlag}
      readOnly={readOnly && !grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
