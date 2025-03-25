import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { hentFastsettArbeidsevneGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const FastsettArbeidsevneMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentFastsettArbeidsevneGrunnlag(behandlingsReferanse);
  return (
    <FastsettArbeidsevne
      grunnlag={grunnlag}
      readOnly={readOnly && !grunnlag.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
