import { FullmektigVurdering, IdentOgNavn, Mottaker } from 'lib/types/types';
import { capitalize } from 'lodash';

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

export function formaterNavn(navn?: string): string | undefined {
  if (!navn) return undefined;
  else
    return navn
      .split(' ')
      .map((del) => capitalize(del))
      .join(' ');
}

export function mottakerErBrukerUtenAdresse(mottaker: Mottaker, bruker: IdentOgNavn): boolean {
  return mottaker.ident === bruker.ident && !mottaker.navnOgAdresse?.adresse;
}

function erSamme(mottaker1?: Mottaker, mottaker2?: Mottaker): boolean {
  if (!mottaker1 || !mottaker2) {
    return false;
  }
  return mottaker1.ident === mottaker2.ident || mottaker1.navnOgAdresse?.navn === mottaker2.navnOgAdresse?.navn;
}

export function erGyldigFullmektig(fullmektig?: Mottaker, hovedmottaker?: Mottaker, kopimottaker?: Mottaker): boolean {
  if (!fullmektig) return false;
  const fullmektigErHovedmottaker = erSamme(fullmektig, hovedmottaker);
  const fullmektigErKopimottaker = erSamme(fullmektig, kopimottaker);

  return !fullmektigErHovedmottaker && !fullmektigErKopimottaker;
}
