import { addMonths, format, isAfter, isBefore, parse, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { validerDato } from 'lib/validation/dateValidation';
import { formaterDatoForFrontend } from 'lib/utils/date';

/**
 * Beregner tidligste dato for reduksjon av AAP ved institusjonsopphold.
 *
 * Regel: AAP gis uten reduksjon for innleggelsesmåneden og de tre påfølgende månedene.
 * Reduksjon starter tidligst første dag i 4. måneden etter innleggelsesmåneden.
 *
 * Eksempel:
 * - Opphold starter: 15.01.2025
 * - Innleggelsesmåned: Januar 2025
 * - Uten reduksjon: Januar, Februar, Mars, April
 * - Tidligste reduksjon: 01.05.2025
 *
 * @param oppholdFra Dato for når oppholdet startet (YYYY-MM-DD)
 * @returns Tidligste tillatte dato for reduksjon (dd.MM.yyyy)
 */
export function beregnTidligsteReduksjonsdato(oppholdFra: string): string {
  // Parse oppholdFra (format: YYYY-MM-DD eller dd.MM.yyyy)
  const opphold = oppholdFra.includes('-') ? new Date(oppholdFra) : parse(oppholdFra, 'dd.MM.yyyy', new Date());

  // Finn første dag i innleggelsesmåneden
  const innleggelsesmåned = startOfMonth(opphold);

  // Legg til 4 måneder (innleggelsesmåned + 3 påfølgende måneder)
  const tidligsteReduksjonsdato = addMonths(innleggelsesmåned, 4);

  return format(tidligsteReduksjonsdato, 'dd.MM.yyyy');
}

/**
 * Formatterer beskrivelse av reduksjonsperioden
 */
export function lagReduksjonsBeskrivelse(oppholdFra: string): string {
  const opphold = oppholdFra.includes('-') ? new Date(oppholdFra) : parse(oppholdFra, 'dd.MM.yyyy', new Date());

  const innleggelsesmåned = format(startOfMonth(opphold), 'MMMM yyyy', { locale: nb });
  const tidligsteReduksjon = beregnTidligsteReduksjonsdato(oppholdFra);

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjon kan tidligst starte: ${tidligsteReduksjon}`;
}

/**
 * Beregner reduksjonsdato ved nytt opphold innen tre måneder etter utskrivelse.
 * @param utskrevetDato Dato for utskrivelse (YYYY-MM-DD)
 * @param nyttOppholdFra Dato for nytt opphold (YYYY-MM-DD)
 * @returns Reduksjonsdato (dd.MM.yyyy) eller undefined hvis regelen ikke gjelder
 */
export function beregnReduksjonsdatoVedNyttOpphold(
  utskrevetDato: string,
  nyttOppholdFra: string
): string | undefined {
  const utskrevet = utskrevetDato.includes('-') ? new Date(utskrevetDato) : parse(utskrevetDato, 'dd.MM.yyyy', new Date());
  const nyttOpphold = nyttOppholdFra.includes('-') ? new Date(nyttOppholdFra) : parse(nyttOppholdFra, 'dd.MM.yyyy', new Date());

  // Sjekk om nytt opphold starter innen 3 måneder etter utskrivelse
  const treMndEtterUtskrivelse = addMonths(utskrevet, 3);
  if (nyttOpphold <= treMndEtterUtskrivelse) {
    // Reduksjon fra og med måneden etter nytt opphold
    const nesteMnd = addMonths(startOfMonth(nyttOpphold), 1);
    return format(nesteMnd, 'dd.MM.yyyy');
  }
  return undefined;
}

/**
 * Beregner tidligste mulige reduksjonsdatoer for en liste med institusjonsopphold.
 *
 * For første opphold brukes standard reduksjonsregel. For påfølgende opphold, dersom forrige opphold har sluttdato,
 * sjekkes det om nytt opphold starter innen tre måneder etter utskrivelse, og eventuell spesiell reduksjonsregel benyttes.
 *
 * @param oppholdsliste Array av objekter med `oppholdFra` (startdato) og `avsluttetDato` (sluttdato eller null/undefined)
 * @returns Array av reduksjonsdatoer (format dd.MM.yyyy) eller undefined hvis regelen ikke gjelder
 */
export function beregnReduksjonsdatoerForOpphold(
  oppholdsliste: { oppholdFra: string; avsluttetDato: string | null | undefined }[]
): (string | undefined)[] {
  if (oppholdsliste.length === 0) return [];

  const result: (string | undefined)[] = [];
  // Første opphold
  result.push(beregnTidligsteReduksjonsdato(oppholdsliste[0].oppholdFra));

  // Påfølgende opphold
  for (let i = 1; i < oppholdsliste.length; i++) {
    const forrige = oppholdsliste[i - 1];
    const opphold = oppholdsliste[i];
    if (forrige.avsluttetDato) {
      result.push(
        beregnReduksjonsdatoVedNyttOpphold(forrige.avsluttetDato, opphold.oppholdFra)
      );
    } else {
      result.push(undefined);
    }
  }
  return result;
}

/**
 * Validerer at en reduksjonsdato er innenfor oppholdsperioden.
 *
 * @param value Dato som skal valideres (dd.MM.yyyy)
 * @param oppholdFra Startdato for oppholdet (yyyy-MM-dd)
 * @param avsluttetDato Sluttdato for oppholdet (yyyy-MM-dd), valgfri
 * @returns Feilmelding som string hvis ugyldig, ellers true
 */
export const validerReduksjonsdatoInnenforOpphold = (
  value: unknown,
  oppholdFra: string,
  avsluttetDato?: string | null
): string | true => {
  if (typeof value !== 'string') {
    return true;
  }

  if (!value) {
    return true;
  }

  const datoValidering = validerDato(value);
  if (datoValidering) {
    return datoValidering;
  }

  // Sjekk om value er innenfor oppholdsperioden
  try {
    const valgtDato = parse(value, 'dd.MM.yyyy', new Date());
    const oppholdFraDato = parse(oppholdFra, 'yyyy-MM-dd', new Date());
    const oppholdSluttDato = avsluttetDato
      ? parse(avsluttetDato, 'yyyy-MM-dd', new Date())
      : '';

    if (isBefore(valgtDato, oppholdFraDato)) {
      return `Reduksjonsdato kan ikke være før innleggelsesdato: ${formaterDatoForFrontend(oppholdFraDato)}`;
    } else if (avsluttetDato && isAfter(valgtDato, oppholdSluttDato)) {
      return `Reduksjonsdato kan ikke være etter oppholdets sluttdato: ${formaterDatoForFrontend(oppholdSluttDato)}`;
    }

    return true;
  } catch {
    return 'Ugyldig datoformat';
  }
};
