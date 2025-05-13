import { SamordningTjenestePensjon } from 'components/samordningtjenestepensjon/SamordningTjenestePensjon';
import { SamordningTjenestePensjonGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningTjenestePensjonMedDataFetching = async ({ behandlingVersjon, readOnly }: Props) => {
  // const grunnlag = await hentSamordningTjenestePensjonGrunnlag(behandlingsreferanse);
  // if (isError(grunnlag)) {
  //   return <ApiException apiResponses={[grunnlag]} />;
  // }

  const grunnlag: SamordningTjenestePensjonGrunnlag = {
    harTilgangTilÅSaksbehandle: false,
    tjenestepensjonForhold: [
      {
        ytelser: [
          {
            ytelseId: 1,
            innmeldtYtelseFom: 'hei',
            ytelseIverksattFom: '2020-01-01',
            ytelseIverksattTom: '2020-02-02',
            ytelseType: 'ALDER',
          },
        ],
        ordning: { navn: 'Thomas', tpNr: '1234', orgNr: '1235' },
      },
    ],
  };

  return (
    <SamordningTjenestePensjon
      grunnlag={grunnlag}
      behandlingVersjon={behandlingVersjon}
      // readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      readOnly={readOnly}
    />
  );
};
