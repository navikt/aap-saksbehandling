import { HelseinstitusjonGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import {
  HelseinstitusjonsFormFieldsNy,
  OppholdMedVurderinger,
  OppholdVurdering,
} from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/HelseinstitusjonNy';
import { Dato } from 'lib/types/Dato';
import { isEqual } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';

/**
 *
 * Vurder om vi i det hele tatt trenger å gjøre dette. Hvor mange har mellomlagring i helse i dag?
 *
 */
export function parseOgMigrerHelseinstitusjonMellomlagretData(
  mellomlagretVurdering: MellomlagretVurdering,
  grunnlag: HelseinstitusjonGrunnlag
): HelseinstitusjonsFormFieldsNy {
  const parsedData = JSON.parse(mellomlagretVurdering.data);

  // Hvis oppholdId har en verdi så er det ny versjon
  const erNyVersjon = parsedData?.helseinstitusjonsvurderinger?.some((v: any) => v.oppholdId != null);

  if (erNyVersjon) {
    return parsedData;
  }

  const oppholdVurderinger: OppholdVurdering[] = parsedData.helseinstitusjonsvurderinger.map((vurdering: any) => {
    const currentOpphold = grunnlag.opphold.find((opphold) => {
      // Datoene er ikke lik
      isEqual(new Dato(opphold.oppholdFra).dato, new Dato(vurdering.periode.fom).dato);
    });

    return {
      ...vurdering,
      oppholdId: currentOpphold?.oppholdId || '',
      periode: {
        fom: formaterDatoForFrontend(vurdering.periode.fom),
        tom: formaterDatoForFrontend(vurdering.periode.tom),
      },
    };
  });

  const gruppertOppholdVurderinger: Record<string, OppholdVurdering[]> = {};

  console.log(oppholdVurderinger);
  oppholdVurderinger.forEach((vurdering) => {
    if (!gruppertOppholdVurderinger[vurdering.oppholdId]) {
      gruppertOppholdVurderinger[vurdering.oppholdId] = [
        {
          ...vurdering,
        },
      ];
    } else {
      gruppertOppholdVurderinger[vurdering.oppholdId].push(vurdering);
    }
  });

  const oppholdMedVurderinger: OppholdMedVurderinger[] = grunnlag.opphold.map((opphold) => {
    const vurderinger = Object.values(gruppertOppholdVurderinger)
      .flat()
      .filter((x) => x.oppholdId === opphold.oppholdId);

    return {
      oppholdId: opphold.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
      periode: { fom: opphold.oppholdFra, tom: opphold.avsluttetDato || '' },
      vurderinger: vurderinger,
    };
  });

  return { helseinstitusjonsvurderinger: oppholdMedVurderinger };
}
