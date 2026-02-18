import { formaterDatoForFrontend, parseDatoFraDatePicker, stringToDate } from 'lib/utils/date';
import { isAfter, isBefore, min, parseISO, startOfDay } from 'date-fns';
import { PeriodiserteVurderingerDto, PeriodisertVurderingFormFields, VurderingDto } from 'lib/types/types';
import { UseFormReturn } from 'react-hook-form';
import { Dato } from 'lib/types/Dato';

export function erProsent(value: number): boolean {
  return value >= 0 && value <= 100;
}

export const isNullOrUndefined = (value: number | null | undefined) => value === null || value === undefined;

export function validerPeriodiserteVurderingerRekkefølge({
  form,
  grunnlag,
  nyeVurderinger,
  tidligsteDatoMåMatcheMedRettighetsperiode = true,
  vurderingerKanIkkeVæreFørKanVurderes = false,
}: {
  form: UseFormReturn<any>;
  grunnlag?: PeriodiserteVurderingerDto<VurderingDto>;
  nyeVurderinger: Array<PeriodisertVurderingFormFields>;
  tidligsteDatoMåMatcheMedRettighetsperiode?: boolean;
  vurderingerKanIkkeVæreFørKanVurderes?: boolean;
}) {
  const sorterteVurderinger = nyeVurderinger.toSorted((a, b) => {
    const aParsed = stringToDate(a.fraDato, 'dd.MM.yyyy')!;
    const bParsed = stringToDate(b.fraDato, 'dd.MM.yyyy')!;
    return aParsed.getTime() - bParsed.getTime();
  });
  const likRekkefølge = sorterteVurderinger.every((value, index) => value.fraDato === nyeVurderinger[index].fraDato);
  if (!likRekkefølge) {
    nyeVurderinger.forEach((_vurdering, index) => {
      form.setError(`vurderinger.${index}.fraDato`, {
        message: 'Vurderingene som legges til må være i kronologisk rekkefølge fra eldst til nyest',
        type: 'custom',
      });
    });
    return false;
  }

  if (vurderingerKanIkkeVæreFørKanVurderes) {
    const tidligsteDato = sorterteVurderinger[0]?.fraDato ? new Dato(sorterteVurderinger[0]?.fraDato).dato : null;

    const tidligsteDatoSomKanVurderes = new Date(grunnlag?.kanVurderes[0]?.fom!);
    if (
      tidligsteDato &&
      tidligsteDatoSomKanVurderes &&
      isBefore(tidligsteDato, startOfDay(tidligsteDatoSomKanVurderes))
    ) {
      nyeVurderinger.forEach((_, index) => {
        form.setError(`vurderinger.${index}.fraDato`, {
          message: `Datoen som er satt er tidligere enn perioden som skal vurderes. Vurderingen kan tidligst gjelde fra ${formaterDatoForFrontend(tidligsteDatoSomKanVurderes)}.`,
        });
      });
      return false;
    }
  }

  if (tidligsteDatoMåMatcheMedRettighetsperiode) {
    const tidligsteDato = min([
      ...sorterteVurderinger.map((i) => parseDatoFraDatePicker(i.fraDato)!),
      ...(grunnlag?.sisteVedtatteVurderinger.map((i) => parseISO(i.fom)) || []),
    ]);

    const tidligsteDatoSomMåVurderes = new Date(grunnlag?.behøverVurderinger[0]?.fom!);
    if (isAfter(tidligsteDato, tidligsteDatoSomMåVurderes)) {
      nyeVurderinger.forEach((_, index) => {
        form.setError(`vurderinger.${index}.fraDato`, {
          message: `Datoen som er satt dekker ikke hele perioden. Vurderingen kan senest gjelde fra ${formaterDatoForFrontend(tidligsteDatoSomMåVurderes)}.`,
        });
      });
      return false;
    }
  }

  return true;
}

export function validerPeriodiserteVurderingerMotIkkeRelevantePerioder({
  nyeVurderinger,
  form,
  grunnlag,
}: {
  form: UseFormReturn<any>;
  grunnlag: PeriodiserteVurderingerDto<VurderingDto>;
  nyeVurderinger: Array<PeriodisertVurderingFormFields>;
}) {
  let validering = true;
  grunnlag.ikkeRelevantePerioder.forEach((periode) => {
    const ikkeRelevantFra = startOfDay(new Dato(periode.fom).dato);
    const ikkeRelevantTil = startOfDay(new Dato(periode.tom).dato);

    nyeVurderinger.forEach((vurdering, index) => {
      const vurderingFra = startOfDay(new Dato(vurdering.fraDato!).dato);
      if (isAfter(vurderingFra, ikkeRelevantFra) && isBefore(vurderingFra, ikkeRelevantTil)) {
        form.setError(`vurderinger.${index}.fraDato`, {
          type: 'custom',
          message: 'Vurderingen overlapper med en ikke-relevant periode',
        });
        validering = false;
      }
    });
  });
  return validering;
}
