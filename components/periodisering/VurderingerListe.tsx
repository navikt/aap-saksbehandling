import { add, parseISO, sub } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { DatePeriode, parsePeriode } from 'lib/utils/datePeriode';
import { IkkeVurderbarPeriode } from './IkkeVurderbarPeriode';
import { JSX } from 'react';
import { Periode } from 'lib/types/types';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props<VedtattVurdering, NyVurdering> {
  ikkeRelevantBeskjed?: string;
  startDato: Date;
  ikkeRelevantePerioder: Periode[];
  vedtatteVurderinger: VedtattVurdering[];
  nyeVurderinger: NyVurdering[];
  renderVedtattVurdering: (v: VedtattVurdering) => JSX.Element;
  renderNyVurdering: (v: NyVurdering, index: number) => JSX.Element;
}

/* Fletter inn "ikke relevant" mellom vedtatte og nye vurderinger. */
export const VurderingerListe = <VedtattVurdering extends { fom: string }, NyVurdering extends { fraDato?: string }>({
  ikkeRelevantBeskjed = "Det er ikke nødvendig å vurdere denne perioden.",
  startDato,
  ikkeRelevantePerioder,
  vedtatteVurderinger,
  nyeVurderinger,
  renderVedtattVurdering,
  renderNyVurdering,
}: Props<VedtattVurdering, NyVurdering>): JSX.Element[] => {
  const visIkkeRelevantPeriode = useFeatureFlag('VisIkkeRelevantPeriode');
  let perioderIkkeRelevant = visIkkeRelevantPeriode ? ikkeRelevantePerioder.map(parsePeriode) : [];

  let result: (JSX.Element | null)[] = [];
  let index = 0;

  while (vedtatteVurderinger.length > 0 || perioderIkkeRelevant.length > 0 || nyeVurderinger.length > 0) {
    console.log('info', {
      sisteVedtatteVurderinger: vedtatteVurderinger,
      perioderIkkeRelevant,
      nyeVurderingerFields: nyeVurderinger,
    });
    const ikkeRelevant = perioderIkkeRelevant[0]?.fom;
    const vedtattVurdering = vedtatteVurderinger[0];
    const nyVurdering = nyeVurderinger[0];

    if (ikkeRelevant && vedtattVurdering && ikkeRelevant <= parseISO(vedtattVurdering.fom)) {
      result.push(periodeIkkeRelevant(ikkeRelevantBeskjed, perioderIkkeRelevant[0]));
      perioderIkkeRelevant = perioderIkkeRelevant.slice(1);
      continue;
    }

    if (vedtattVurdering) {
      result.push(renderVedtattVurdering(vedtattVurdering));
      vedtatteVurderinger = vedtatteVurderinger.slice(1);
      continue;
    }

    const nyVurderingFra = nyVurdering?.fraDato ? parseDatoFraDatePicker(nyVurdering?.fraDato)!! : startDato;
    if (nyVurderingFra && ikkeRelevant <= nyVurderingFra) {
      result.push(periodeIkkeRelevant(ikkeRelevantBeskjed, perioderIkkeRelevant[0]));
      perioderIkkeRelevant = perioderIkkeRelevant.slice(1);
      continue;
    }

    if (nyVurdering) {
      result.push(renderNyVurdering(nyeVurderinger[0], index));
      index += 1;
      nyeVurderinger = nyeVurderinger.slice(1);
      continue;
    }

    result.push(periodeIkkeRelevant(ikkeRelevantBeskjed, perioderIkkeRelevant[0]));
    perioderIkkeRelevant = perioderIkkeRelevant.slice(1);
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
