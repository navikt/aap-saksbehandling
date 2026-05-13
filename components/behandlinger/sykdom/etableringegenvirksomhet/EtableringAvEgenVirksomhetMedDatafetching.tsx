import { EtableringAvEgenVirksomhet } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import {
  hentEtableringEgenVirksomhetGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegData } from 'lib/utils/steg';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const EtableringAvEgenVirksomhetMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentEtableringEgenVirksomhetGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initalMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE,
    totalReadOnly
  );

  return (
    <EtableringAvEgenVirksomhet
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initalMellomlagretVurdering}
    />
  );
};
