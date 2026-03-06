import { parseISO } from 'date-fns';
import { DatePeriode, parsePeriode } from 'lib/utils/datePeriode';
import { IkkeVurderbarPeriode } from './IkkeVurderbarPeriode';
import { JSX } from 'react';
import { Periode } from 'lib/types/types';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props<VedtattVurdering> {
  grunnlag: undefined | {
    ikkeRelevantePerioder: Periode[];
    sisteVedtatteVurderinger: VedtattVurdering[];
  },
  ikkeRelevantBeskjed?: string;
  ikkeRelevantePerioder?: Periode[];
  vedtatteVurderinger?: VedtattVurdering[];
  renderVedtattVurdering: (v: VedtattVurdering) => JSX.Element;
}

/* Fletter inn "ikke relevant" mellom vedtatte og nye vurderinger. */
export const TidligereVurderingerListe = <VedtattVurdering extends { fom: string }>({
  ikkeRelevantBeskjed = "Det er ikke nødvendig å vurdere denne perioden.",
  // ikkeRelevantePerioder,
  // vedtatteVurderinger,
  grunnlag,
  renderVedtattVurdering,
}: Props<VedtattVurdering>): JSX.Element[] => {
  const visIkkeRelevantPeriode = useFeatureFlag('VisIkkeRelevantPeriode');
  let ikkeRelevantePerioder = grunnlag?.ikkeRelevantePerioder ?? [];
  let vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  console.log('TidligereVurderingerListe', {ikkeRelevantePerioder});
  let perioderIkkeRelevant = visIkkeRelevantPeriode ? ikkeRelevantePerioder.map(parsePeriode) : [];

  let result: (JSX.Element | null)[] = [];

  while (vedtatteVurderinger.length > 0 || perioderIkkeRelevant.length > 0) {
    const ikkeRelevantFom = perioderIkkeRelevant[0]?.fom;
    const vedtattVurdering = vedtatteVurderinger[0];

    if (ikkeRelevantFom && vedtattVurdering && ikkeRelevantFom < parseISO(vedtattVurdering.fom)) {
      result.push(periodeIkkeRelevant(ikkeRelevantBeskjed, perioderIkkeRelevant[0]));
      perioderIkkeRelevant = perioderIkkeRelevant.slice(1);
    } else if (vedtattVurdering) {
      result.push(renderVedtattVurdering(vedtattVurdering));
      vedtatteVurderinger = vedtatteVurderinger.slice(1);
    } else {
      result.push(periodeIkkeRelevant(ikkeRelevantBeskjed, perioderIkkeRelevant[0]));
      perioderIkkeRelevant = perioderIkkeRelevant.slice(1);
    }
  }

  return result.filter((x) => x !== null);
};

const periodeIkkeRelevant = (beskjed: string, p: DatePeriode) => {
  return (
    <IkkeVurderbarPeriode
      key={`ikke-relevant-${p.fom.toISOString()}`}
      fom={p.fom}
      tom={p.tom}
      alertMelding={beskjed}
      foersteNyePeriodeFraDato={undefined}
    ></IkkeVurderbarPeriode>
  );
};
