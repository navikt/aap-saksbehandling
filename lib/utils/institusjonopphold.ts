import { addMonths, format, isAfter, isBefore, isEqual, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend } from 'lib/utils/date';
import { Dato } from 'lib/types/Dato';
import { HelseInstiusjonVurdering } from 'lib/types/types';

import { JaEllerNei } from 'lib/utils/form';
import { OppholdVurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';

/**
 * Formatterer beskrivelse av reduksjonsperioden
 */
export function lagReduksjonsBeskrivelse(oppholdFra: string, tidligsteReduksjonsdato?: string | null): string {
  const opphold = new Dato(oppholdFra).dato;

  const innleggelsesmåned = format(startOfMonth(opphold), 'MMMM yyyy', { locale: nb });
  const tidligsteReduksjon = tidligsteReduksjonsdato
    ? formatDatoMedMånedsnavn(new Dato(tidligsteReduksjonsdato).dato)
    : '';

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjon kan tidligst starte: ${tidligsteReduksjon}`;
}

export function lagReduksjonBeskrivelseNyttOpphold(oppholdFra: string): string {
  const oppholdDato = new Dato(oppholdFra).dato;

  const innleggelsesmåned = format(startOfMonth(oppholdDato), 'MMMM yyyy', { locale: nb });

  const énMånedEtterInnleggelsesmåned = startOfMonth(addMonths(oppholdDato, 1));
  const fireMånederEtterInnleggelsesmåned = startOfMonth(addMonths(oppholdDato, 4));

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjonen bør som regel starte ${formatDatoMedMånedsnavn(énMånedEtterInnleggelsesmåned)} ved reduksjon i forrige opphold, ellers ${formatDatoMedMånedsnavn(fireMånederEtterInnleggelsesmåned)}. Det finnes likevel unntak.`;
}

/**
 * Validerer at en dato er innenfor oppholdsperioden når det er reduksjon.
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

export const validerDatoForStoppAvReduksjon = (reduksjonDato: string, tidligsteReduksjonsdato?: string | null) => {
  const dato = new Dato(reduksjonDato).dato;

  const tidligsteReduksjonsdato2 = tidligsteReduksjonsdato ? new Dato(tidligsteReduksjonsdato).dato : '';

  if (isBefore(dato, tidligsteReduksjonsdato2)) {
    return `Tidligste dato for reduksjon er: ${formaterDatoForFrontend(tidligsteReduksjonsdato2)}`;
  }
};

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
