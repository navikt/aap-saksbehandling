import {
  hentMellomlagring,
  hentSykdomsvurderingBrevGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';
import { TypeBehandling } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

export const SykdomsvurderingBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  typeBehandling,
  readOnly,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSykdomsvurderingBrevGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.SYKDOMSVURDERING_BREV_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SykdomsvurderingBrev
      grunnlag={grunnlag.data}
      typeBehandling={typeBehandling}
      readOnly={readOnly || !grunnlag.data.kanSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
