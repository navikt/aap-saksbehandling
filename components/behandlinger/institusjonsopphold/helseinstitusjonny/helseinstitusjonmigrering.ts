import { HelseinstitusjonGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import {
  HelseinstitusjonsFormFieldsNy,
  OppholdMedVurderinger,
  OppholdVurdering,
} from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/HelseinstitusjonNy';
import { getJaNeiEllerUndefined } from 'lib/utils/form';

export function parseOgMigrerHelseinstitusjonMellomlagretData(
  mellomlagretVurdering: MellomlagretVurdering,
  grunnlag: HelseinstitusjonGrunnlag
): HelseinstitusjonsFormFieldsNy {
  const parsedData = JSON.parse(mellomlagretVurdering.data);

  const vurdertDato = new Date(mellomlagretVurdering.vurdertDato);
  const dagensDato = new Date(); // TODO Endre denne til den dagen vi går i prod eller finn en bedre måte å returnere korrekt data på

  if (vurdertDato > dagensDato) {
    return parsedData;
  }

  // @ts-expect-error
  const oppholdVurderinger: OppholdVurdering[] = parsedData.helseinstitusjonsvurderinger.map((vurdering) => {
    const opphold = grunnlag.opphold.find((opphold) => opphold.oppholdFra === vurdering.periode.fom);

    return {
      begrunnelse: vurdering.begrunnelse,
      faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
      forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
      harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
      oppholdId: opphold?.oppholdId || '',
      periode: vurdering.periode,
    };
  });

  const gruppertOppholdVurderinger: Record<string, OppholdVurdering[]> = {};

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
