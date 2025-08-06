import { FullmektigVurdering, Mottaker } from 'lib/types/types';

export function mapGrunnlagTilMottakere(
  bruker: { ident: string; navn: string },
  fullmektigVurdering?: FullmektigVurdering
): {
  bruker: Mottaker;
  fullmektig?: Mottaker;
} {
  const fullmektigIdentMedType = fullmektigVurdering?.fullmektigIdentMedType;
  const fullmektigIdent = fullmektigIdentMedType?.type === 'FNR_DNR' ? 'FNR' : fullmektigIdentMedType?.type;
  const fullmektigNavnOgAdresse = fullmektigVurdering?.fullmektigNavnOgAdresse;

  return {
    bruker: { ident: bruker.ident, identType: 'FNR' },
    fullmektig: fullmektigVurdering?.harFullmektig
      ? {
          ident: fullmektigIdentMedType?.ident,
          identType: fullmektigIdent,
          ...(fullmektigNavnOgAdresse && {
            navnOgAdresse: {
              navn: fullmektigNavnOgAdresse?.navn,
              adresse: {
                adresselinje1: fullmektigNavnOgAdresse?.adresse?.adresselinje1,
                adresselinje2: fullmektigNavnOgAdresse?.adresse?.adresselinje2,
                adresselinje3: fullmektigNavnOgAdresse?.adresse?.adresselinje3,
                postnummer: fullmektigNavnOgAdresse?.adresse?.postnummer,
                poststed: fullmektigNavnOgAdresse?.adresse?.poststed,
                landkode: fullmektigNavnOgAdresse?.adresse?.landkode,
              },
            },
          }),
        }
      : undefined,
  };
}
