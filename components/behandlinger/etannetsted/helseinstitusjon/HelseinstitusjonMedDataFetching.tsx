import { Helseinstitusjon } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjon';
import { hentHelseInstitusjonsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const HelseinstitusjonMedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentHelseInstitusjonsVurdering(behandlingsreferanse);
  return (
    <Helseinstitusjon
      grunnlag={grunnlag}
      readOnly={readOnly || !grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
