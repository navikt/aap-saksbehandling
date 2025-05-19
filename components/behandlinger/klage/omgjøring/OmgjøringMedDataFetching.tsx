import { TypeBehandling } from 'lib/types/types';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { OmgjøringVurdering } from 'components/behandlinger/klage/omgjøring/OmgjøringVurdering';

export const OmgjøringMedDataFetching = async ({
  saksnummer,
}: {
  saksnummer: string;
  behandlingsreferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
  readOnly: boolean;
}) => {
  // const grunnlag = await hentOmgjøringGrunnlag(behandlingsreferanse);
  //
  // if (isError(grunnlag)) {
  //   return <ApiException apiResponses={[grunnlag]} />;
  // }

  const sak = await hentSak(saksnummer);

  return <OmgjøringVurdering sak={sak} />;
};
