import { Vurder11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9';
import {
  hentAktivitetsplikt11_9Grunnlag,
  hentMellomlagringMedStatus,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Brudd } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export type Vurdering11_9 = {
  id: string;
  begrunnelse: string;
  dato: string;
  brudd: Brudd;
  grunn: Grunn;
};

export type Grunn = 'IKKE_RIMELIG_GRUNN' | 'RIMELIG_GRUNN';

export const Vurder11_9MedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentAktivitetsplikt11_9Grunnlag(behandlingsreferanse),
    hentMellomlagringMedStatus(behandlingsreferanse, Behovstype.VURDER_BRUDD_11_9_KODE),
  ]);

  if (isError(grunnlag) || isError(initialMellomlagretVurdering)) {
    return <ApiException apiResponses={[grunnlag, initialMellomlagretVurdering]} />;
  }

  return (
    <Vurder11_9
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering.data.mellomlagretVurdering}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
