import { addMonths, format, isAfter, isBefore, isEqual, parse, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend } from 'lib/utils/date';
import { Dato } from 'lib/types/Dato';
import { HelseInstiusjonVurdering } from 'lib/types/types';

import { JaEllerNei } from 'lib/utils/form';
import { OppholdVurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';

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
  const opphold = new Dato(oppholdFra).dato;

  // Finn første dag i innleggelsesmåneden
  const innleggelsesmåned = startOfMonth(opphold);

  // Legg til 4 måneder (innleggelsesmåned + 3 påfølgende måneder)
  const tidligsteReduksjonsdato = addMonths(innleggelsesmåned, 4);

  return formaterDatoForFrontend(tidligsteReduksjonsdato);
}

/**
 * Formatterer beskrivelse av reduksjonsperioden
 */
export function lagReduksjonsBeskrivelse(oppholdFra: string): string {
  const opphold = new Dato(oppholdFra).dato;

  const innleggelsesmåned = format(startOfMonth(opphold), 'MMMM yyyy', { locale: nb });
  const tidligsteReduksjon = formatDatoMedMånedsnavn(
    parse(beregnTidligsteReduksjonsdato(oppholdFra), 'dd.MM.yyyy', new Date())
  );

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjon kan tidligst starte: ${tidligsteReduksjon}`;
}

export function lagReduksjonBeskrivelseNyttOpphold(utskrevet: string, oppholdFra: string): string {
  const oppholdDato = new Dato(oppholdFra).dato;

  const innleggelsesmåned = format(startOfMonth(oppholdDato), 'MMMM yyyy', { locale: nb });
  const tidligsteReduksjon = new Dato(beregnReduksjonsdatoVedNyttOpphold(utskrevet, oppholdFra)).dato;

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjon kan tidligst starte: ${formatDatoMedMånedsnavn(tidligsteReduksjon)}`;
}

/**
 * Validerer at en dato er innenfor oppholdsperioden.
 *
 * @param value Dato som skal valideres (dd.MM.yyyy)
 * @param oppholdFra Startdato for oppholdet (yyyy-MM-dd)
 * @param avsluttetDato Sluttdato for oppholdet (yyyy-MM-dd), valgfri
 * @returns Feilmelding som string hvis ugyldig, ellers true
 */
export const validerDatoErInnenforOpphold = (
  value: string,
  oppholdFra: string,
  avsluttetDato?: string | null
): string | true => {
  const valgtDato = new Dato(value).dato;
  const oppholdFraDato = new Dato(oppholdFra).dato;
  const oppholdSluttDato = avsluttetDato ? new Dato(avsluttetDato).dato : undefined;

  if (isBefore(valgtDato, oppholdFraDato)) {
    return `Dato kan ikke være før innleggelsesdato: ${formaterDatoForFrontend(oppholdFraDato)}`;
  } else if (oppholdSluttDato && isAfter(valgtDato, oppholdSluttDato)) {
    return `Dato kan ikke være etter oppholdets sluttdato: ${formaterDatoForFrontend(oppholdSluttDato)}`;
  }

  return true;
};

export const validerDatoForStoppAvReduksjon = (reduksjonDato: string, oppholdfra: string) => {
  const dato = new Dato(reduksjonDato).dato;

  const tidligsteReduksjonsdato = new Dato(beregnTidligsteReduksjonsdato(oppholdfra)).dato;

  if (isBefore(dato, tidligsteReduksjonsdato)) {
    return `Tidligste dato for reduksjon er: ${formaterDatoForFrontend(tidligsteReduksjonsdato)}`;
  }
};

/**
 * Beregner reduksjonsdato ved nytt opphold innen tre måneder etter utskrivelse.
 * @param utskrevetDato Dato for utskrivelse (YYYY-MM-DD)
 * @param nyttOppholdFra Dato for nytt opphold (YYYY-MM-DD)
 * @returns Reduksjonsdato (dd.MM.yyyy) eller undefined hvis regelen ikke gjelder
 */
export function beregnReduksjonsdatoVedNyttOpphold(utskrevetDato: string, nyttOppholdFra: string): string {
  const utskrevet = new Dato(utskrevetDato).dato;
  const nyttOpphold = new Dato(nyttOppholdFra).dato;

  // Sjekk om nytt opphold starter innen 3 måneder etter utskrivelse
  const treMndEtterUtskrivelse = addMonths(utskrevet, 3);
  if (nyttOpphold <= treMndEtterUtskrivelse) {
    // Reduksjon fra og med måneden etter nytt opphold
    const nesteMnd = new Dato(addMonths(startOfMonth(nyttOpphold), 1));

    return nesteMnd.formaterForFrontend();
  }
  return formaterDatoForFrontend(nyttOppholdFra);
}

export const validerErIKronologiskRekkeFølge = (value: string, forrigeVurderingFom?: string) => {
  if (!forrigeVurderingFom) {
    return true;
  }

  const inputValue = new Dato(value);
  const forrigeVurderingFomValue = new Dato(forrigeVurderingFom);

  if (
    isBefore(inputValue.dato, forrigeVurderingFomValue.dato) ||
    isEqual(inputValue.dato, forrigeVurderingFomValue.dato)
  ) {
    return `Dato kan ikke være tidligere eller samme dato som forrige vurdering: ${forrigeVurderingFomValue.formaterForFrontend()}`;
  }

  return true;
};

export function erReduksjonUtIFraVurdering(data: HelseInstiusjonVurdering): boolean {
  return data.faarFriKostOgLosji && data.forsoergerEktefelle === false && data.harFasteUtgifter === false;
}

export function erReduksjonUtIFraFormFields(data: OppholdVurdering): boolean {
  return (
    data.faarFriKostOgLosji === JaEllerNei.Ja &&
    data.forsoergerEktefelle === JaEllerNei.Nei &&
    data.harFasteUtgifter === JaEllerNei.Nei
  );
}

export function erNyttOppholdInnenfor3MaanederEtterSistOpphold(utskrevetDato: string, nyttOppholdFra: string): boolean {
  const utskrevet = new Dato(utskrevetDato).dato;
  const nyttOpphold = new Dato(nyttOppholdFra).dato;

  const treMndEtterUtskrivelse = addMonths(utskrevet, 3);

  return nyttOpphold <= treMndEtterUtskrivelse;
}
