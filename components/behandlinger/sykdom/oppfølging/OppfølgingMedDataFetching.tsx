import { hentBistandsbehovGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const OppfølgingMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse);

  return (
    <Oppfølging
      behandlingsReferanse={behandlingsReferanse}
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
