import { EtableringAvEgenVirksomhet } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import {
  hentEtableringEgenVirksomhetGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegData, skalViseStegForPeriodisertGrunnlag } from 'lib/utils/steg';
import { Behovstype } from 'lib/utils/form';
import { EtableringAvEgenVirksomhetNy } from './EtableringAvEgenVirksomhetNy';
import { unleashService } from '../../../../lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const EtableringAvEgenVirksomhetMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentEtableringEgenVirksomhetGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseStegForPeriodisertGrunnlag(stegData.avklaringsbehov, grunnlag.data)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initalMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.ETABLERING_EGEN_VIRKSOMHET_KODE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  const skalViseNyFlyt = unleashService.isEnabled('NyFlytEtablerEgenVirksomhet');
  console.log('skalViseNyFlyt', skalViseNyFlyt);
  if (skalViseNyFlyt) {
    return (
      <EtableringAvEgenVirksomhetNy
        grunnlag={grunnlag.data}
        readOnly={totalReadOnly}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initalMellomlagretVurdering}
      />
    );
  }

  return (
    <EtableringAvEgenVirksomhet
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initalMellomlagretVurdering}
    />
  );
};
