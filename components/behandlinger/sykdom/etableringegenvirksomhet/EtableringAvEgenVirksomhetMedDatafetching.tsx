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
  behandlingsReferanse: string;
  stegData: StegData;
}

export const EtableringAvEgenVirksomhetMedDatafetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, mellomlagring] = await Promise.all([
    hentEtableringEgenVirksomhetGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <EtableringAvEgenVirksomhet
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={mellomlagring}
    />
  );
};
