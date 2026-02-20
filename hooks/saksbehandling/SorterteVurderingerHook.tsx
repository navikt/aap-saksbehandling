import { Periode } from 'lib/types/types';
import { FieldArrayWithId, UseFormReturn, useWatch } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import { Dato } from 'lib/types/Dato';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { useMemo } from 'react';

interface BaseSortertVurdering {
  fom: string;
}

interface TidligereVurdering<TidligereVurderingType> extends BaseSortertVurdering {
  type: 'TIDLIGERE_VURDERING';
  vurdering: TidligereVurderingType;
}

interface NyVurdering<NyVurderingType extends FieldValues> extends BaseSortertVurdering {
  type: 'NY_VURDERING';
  index: number;
  id: string;
  vurderingForm: FieldArrayWithId<NyVurderingType>;
}

interface IkkeRelevantePerioder extends BaseSortertVurdering {
  type: 'IKKE_RELEVANT_PERIODE';
  periode: Periode;
}

type SortertVurdering<NyVurderingType extends FieldValues, TidligereVurderingType> =
  | TidligereVurdering<TidligereVurderingType>
  | NyVurdering<NyVurderingType>
  | IkkeRelevantePerioder;

type SorterteVurderinger<NyVurderingType extends FieldValues, TidligereVurderingType> = SortertVurdering<
  NyVurderingType,
  TidligereVurderingType
>[];

export function useSorterteVurderinger<NyVurderingType extends FieldValues, TidligereVurderingType>(
  nyeVurderinger: NyVurderingType[],
  tidligereVurderinger: TidligereVurderingType[],
  ikkeRelevantePerioder: Periode[],
  form: UseFormReturn<any>
): SorterteVurderinger<NyVurderingType, TidligereVurderingType> {
  const watch = useWatch({ control: form.control, name: 'vurderinger' });

  // @ts-expect-error
  const sorterteVurderinger: SorterteVurderinger<NyVurderingType, TidligereVurderingType> = useMemo(() => {
    return [
      ...(nyeVurderinger ?? []).map((field, index) => {
        const values = watch?.[index] ?? field;
        return {
          type: 'NY_VURDERING',
          index: index,
          id: field.id,
          vurderingForm: field,
          fom: gyldigDatoEllerNull(values?.fraDato) ? new Dato(values.fraDato).formaterForBackend() : '',
        };
      }),
      ...(tidligereVurderinger ?? []).map((vurdering) => {
        return {
          type: 'TIDLIGERE_VURDERING',
          vurdering: vurdering,
          // @ts-expect-error
          fom: vurdering.fom,
        };
      }),
      ...(ikkeRelevantePerioder ?? []).map((periode) => {
        return {
          type: 'IKKE_RELEVANT_PERIODE',
          periode: periode,
          fom: periode.fom,
        };
      }),
    ];
  }, [ikkeRelevantePerioder, nyeVurderinger, tidligereVurderinger, watch]);

  return sorterteVurderinger.sort((a, b) => {
    const aDato = a.fom ? new Date(a.fom).getTime() : Infinity;
    const bDato = b.fom ? new Date(b.fom).getTime() : Infinity;
    return aDato - bDato;
  });
}
