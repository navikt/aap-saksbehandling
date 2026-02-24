import { Periode } from 'lib/types/types';
import { useMemo } from 'react';
import { sorterEtterNyesteDato } from 'lib/utils/date';

interface TidligereVurdering<TidligereVurderingType> {
  type: 'TIDLIGERE_VURDERING';
  vurdering: TidligereVurderingType;
  fom: string;
}

interface IkkeRelevantePerioder {
  type: 'IKKE_RELEVANT_PERIODE';
  periode: Periode;
  fom: string;
}

type SortertVurdering<TidligereVurderingType> = TidligereVurdering<TidligereVurderingType> | IkkeRelevantePerioder;

type SorterteVurderinger<TidligereVurderingType> = SortertVurdering<TidligereVurderingType>[];

// Denne brukes for å sikre at alle typene vi sender inn har feltet fom
interface TidligereVurderingFom {
  fom: string;
}

export function useSorterteVurderinger<TidligereVurderingType extends TidligereVurderingFom>(
  tidligereVurderinger: TidligereVurderingType[],
  ikkeRelevantePerioder: Periode[]
): SorterteVurderinger<TidligereVurderingType> {
  const sorterteVurderinger = useMemo(() => {
    return [...tidligereVurderinger.map(lagTidligereVurdering), ...ikkeRelevantePerioder.map(lagIkkeRelevantPeriode)];
  }, [tidligereVurderinger, ikkeRelevantePerioder]);

  return sorterteVurderinger.toSorted((a, b) => sorterEtterNyesteDato(a.fom, b.fom));
}
function lagTidligereVurdering<T extends TidligereVurderingFom>(vurdering: T): TidligereVurdering<T> {
  return {
    type: 'TIDLIGERE_VURDERING',
    vurdering,
    fom: vurdering.fom,
  };
}

function lagIkkeRelevantPeriode(periode: Periode): IkkeRelevantePerioder {
  return {
    type: 'IKKE_RELEVANT_PERIODE',
    periode,
    fom: periode.fom,
  };
}
