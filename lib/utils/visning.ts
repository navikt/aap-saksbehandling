import { VisningModus } from 'lib/types/visningTypes';
import { MellomlagretVurdering } from 'lib/types/types';

export function isFormReadOnly(visning: VisningModus): boolean {
  return visning === VisningModus.LÅST_MED_ENDRE || visning === VisningModus.LÅST_UTEN_ENDRE;
}

/**
 * Frontend antar at steget inneholder en tidligere vurdering dersom det har blitt rendret og ikke er aktivtSteg
 *
 * | readOnly | erAktivtSteg | mellomlagring  | resultat            |
 * |----------|--------------|----------------|----------------------
 * | False    | False        | True           | AKTIV_MED_AVBRYT    |
 * | True     | True         | True           | LÅST_UTEN_ENDRE     | // TODO Hva skal vi gjøre her?
 * | True     | False        | True           | LÅST_UTEN_ENDRE     |
 * | False    | True         | True           | AKTIV_UTEN_AVBRYT   |
 * | True     | True         | False          | LÅST_UTEN_ENDRE     |
 * | False    | True         | False          | AKTIV_UTEN_AVBRYT   |
 * | True     | False        | False          | LÅST_UTEN_ENDRE     |
 * | False    | False        | False          | LÅST__MED_ENDRE     |
 */

export function hentVisning(
  readOnly: boolean,
  erAktivtSteg: boolean,
  mellomlagring: MellomlagretVurdering | undefined
): VisningModus {
  if (readOnly) {
    return VisningModus.LÅST_UTEN_ENDRE;
  }

  if (erAktivtSteg) {
    return VisningModus.AKTIV_UTEN_AVBRYT;
  }

  if (mellomlagring) {
    return VisningModus.AKTIV_MED_AVBRYT;
  }

  return VisningModus.LÅST_MED_ENDRE;
}
