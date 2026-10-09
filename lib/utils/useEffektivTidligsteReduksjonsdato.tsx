import { UseFormReturn } from 'react-hook-form';
import { addMonths, format, startOfMonth } from 'date-fns';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering } from 'lib/types/types';
import { Dato } from 'lib/types/Dato';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import {
  beregnStandardTidligsteReduksjonsdato,
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  erReduksjonMuligForOpphold,
  erReduksjonUtIFraFormFields,
  forrigeOppholdHarIngenReduksjonLengre,
} from 'lib/utils/institusjonopphold';

export function useEffektivTidligsteReduksjonsdato(
  form: UseFormReturn<HelseinstitusjonsFormFields>,
  oppholdIndex: number,
  opphold: HelseinstitusjonGrunnlag['opphold'][0],
  forrigeOppholdAvsluttetDato?: string | null,
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null
) {
  const forrigeOppholdVurderinger =
    oppholdIndex > 0 ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.vurderinger`) : undefined;

  const forrigeGaReduksjonNå = forrigeOppholdVurderinger?.some((v) => erReduksjonUtIFraFormFields(v)) ?? false;

  const innenforTreMåneder =
    !!forrigeOppholdAvsluttetDato &&
    erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdAvsluttetDato, opphold.oppholdFra);

  const bruker1Månedsregelen = (forrigeGaReduksjonNå && innenforTreMåneder) satisfies boolean;

  let effektivTidligsteReduksjonsdato: string | null | undefined;

  if (bruker1Månedsregelen) {
    effektivTidligsteReduksjonsdato = format(
      startOfMonth(addMonths(new Dato(opphold.oppholdFra).dato, 1)),
      'yyyy-MM-dd'
    );
    // Backend sin opphold.tidligsteReduksjonsdato er beregnet ut fra VEDTATTE vurderinger på
    // forrige opphold. Hvis saksbehandler nå (live i skjemaet) har endret forrige opphold slik at
    // det ikke lenger gir reduksjon noe sted, er backend-verdien utdatert (kan fortsatt reflektere
    // 1-månedsregelen fra forrige behandling). I så fall må vi regne ut standard 3/4-månedersregel
    // selv, i stedet for å stole på backend.
  } else if (forrigeOppholdHarIngenReduksjonLengre(forrigeOppholdVurderinger, forrigeOppholdVedtatteVurderinger)) {
    effektivTidligsteReduksjonsdato = beregnStandardTidligsteReduksjonsdato(opphold.oppholdFra);
  } else {
    effektivTidligsteReduksjonsdato = opphold.tidligsteReduksjonsdato;
  }

  const reduksjonErMulig = erReduksjonMuligForOpphold(opphold.avsluttetDato, effektivTidligsteReduksjonsdato);

  return { bruker1Månedsregelen, effektivTidligsteReduksjonsdato, reduksjonErMulig };
}
