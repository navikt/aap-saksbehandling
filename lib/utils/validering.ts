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
          message: `Vurderingene du har laget starter før perioden du kan vurdere. Tidligste vurderte dato er ${formaterDatoForFrontend(tidligsteDato)} men tidligste dato som kan vurderes er ${formaterDatoForFrontend(tidligsteDatoSomKanVurderes)}.`,
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
          message: `Periodene du har lagt inn dekker ikke hele perioden som må vurderes. Tidligste vurderte dato er ${formaterDatoForFrontend(tidligsteDato)} men hele perioden fra ${formaterDatoForFrontend(tidligsteDatoSomMåVurderes)} behøver vurdering.`,
        });
      });
      return false;
    }
  }

  return true;
}
