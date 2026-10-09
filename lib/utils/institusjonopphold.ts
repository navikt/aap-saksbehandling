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

export function beregnStandardTidligsteReduksjonsdato(oppholdFra: string): string {
  return format(startOfMonth(addMonths(new Dato(oppholdFra).dato, 4)), 'yyyy-MM-dd');
}

function erGyldigDatoFormat(dato: string | undefined): dato is string {
  return !!dato && /^\d{2}\.\d{2}\.\d{4}$/.test(dato);
}

export function forrigeOppholdHarIngenReduksjonLengre(
  forrigeOppholdVurderinger: OppholdVurdering[] | undefined,
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null
): boolean {
  if (forrigeOppholdVurderinger == null || forrigeOppholdVurderinger.length === 0) return false;

  const forrigeErBesvart = forrigeOppholdVurderinger.every((v) => v.faarFriKostOgLosji !== undefined);
  if (!forrigeErBesvart) return false;

  const liveHarReduksjonNoeSted = forrigeOppholdVurderinger.some((v) => erReduksjonUtIFraFormFields(v));
  if (liveHarReduksjonNoeSted) return false;

  // Ingen live vurdering gir reduksjon. Sjekk om det finnes en vedtatt reduksjonsperiode som
  // fortsatt delvis gjaldt - dvs. den nye "stopp reduksjon fra"-datoen ligger etter vedtatt
  // reduksjon sin startdato. I så fall har det faktisk vært reduksjon en periode, og 1-månedsregelen
  // skal fortsatt gjelde for neste opphold.
  const vedtattReduksjon = forrigeOppholdVedtatteVurderinger?.find((v) => erReduksjonUtIFraVurdering(v));
  if (!vedtattReduksjon) return false;

  const tidligsteLiveFom = forrigeOppholdVurderinger
    .map((v) => v.periode?.fom)
    .filter(erGyldigDatoFormat)
    .map((fom) => new Dato(fom).dato)
    .sort((a, b) => a.getTime() - b.getTime())
    .at(0);

  // Ingen gyldig dato fylt ut ennå - vi vet ikke om reduksjonen faktisk stoppes før oppstart
  // av vedtatt reduksjon eller ikke. Ikke vis varsel før saksbehandler har fylt ut en dato.
  if (!tidligsteLiveFom) return false;

  const vedtattReduksjonFom = new Dato(vedtattReduksjon.periode.fom).dato;

  const fortsattReduksjonForEnPeriode = isAfter(tidligsteLiveFom, vedtattReduksjonFom);

  return !fortsattReduksjonForEnPeriode;
}

export function manglerKorrigertReduksjonsdato(
  oppholdFra: string,
  oppholdVurderinger: OppholdVurdering[],
  forrigeOppholdVurderinger: OppholdVurdering[] | undefined,
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null
): boolean {
  const forrigeIkkeLengerReduksjon = forrigeOppholdHarIngenReduksjonLengre(
    forrigeOppholdVurderinger,
    forrigeOppholdVedtatteVurderinger
  );
  if (!forrigeIkkeLengerReduksjon) return false;

  const standardTidligsteReduksjonsdato = beregnStandardTidligsteReduksjonsdato(oppholdFra);

  const harKorrigertEgenVurdering = oppholdVurderinger.some((v) => {
    if (!erReduksjonUtIFraFormFields(v)) return false;
    const fom = v.periode?.fom;
    if (!erGyldigDatoFormat(fom)) return false;
    return !isBefore(new Dato(fom).dato, new Dato(standardTidligsteReduksjonsdato).dato);
  });

  return !harKorrigertEgenVurdering;
}

export function lagReduksjonBeskrivelseNyttOpphold(oppholdFra: string, oppholdTil: string): string {
  const oppholdDato = new Dato(oppholdFra).dato;
  const oppholdTilDato = new Dato(oppholdTil).dato;

  const innleggelsesmåned = format(startOfMonth(oppholdDato), 'MMMM yyyy', { locale: nb });

  const énMånedEtterInnleggelsesmåned = startOfMonth(addMonths(oppholdDato, 1));
  const fireMånederEtterInnleggelsesmåned = startOfMonth(addMonths(oppholdDato, 4));

  const visFireMånederRegel =
    isAfter(oppholdTilDato, fireMånederEtterInnleggelsesmåned) ||
    isEqual(oppholdTilDato, fireMånederEtterInnleggelsesmåned);

  const fireMånederTekst = visFireMånederRegel
    ? `, ellers ${formatDatoMedMånedsnavn(fireMånederEtterInnleggelsesmåned)}`
    : '';

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjonen bør som regel starte ${formatDatoMedMånedsnavn(
    énMånedEtterInnleggelsesmåned
  )} ved reduksjon i forrige opphold${fireMånederTekst}. Det finnes likevel unntak.`;
}

export function lagReduksjonBeskrivelseNyttOppholdGammel(oppholdFra: string): string {
  const oppholdDato = new Dato(oppholdFra).dato;

  const innleggelsesmåned = format(startOfMonth(oppholdDato), 'MMMM yyyy', { locale: nb });

  const énMånedEtterInnleggelsesmåned = startOfMonth(addMonths(oppholdDato, 1));
  const fireMånederEtterInnleggelsesmåned = startOfMonth(addMonths(oppholdDato, 4));

  return `Innleggelsesmåned: ${innleggelsesmåned}. Reduksjonen bør som regel starte ${formatDatoMedMånedsnavn(énMånedEtterInnleggelsesmåned)} ved reduksjon i forrige opphold, ellers ${formatDatoMedMånedsnavn(fireMånederEtterInnleggelsesmåned)}. Det finnes likevel unntak.`;
}

/**
 * Sjekker om reduksjon i det hele tatt er mulig for oppholdet, gitt tidligste reduksjonsdato.
 * Hvis tidligste reduksjonsdato er etter oppholdets sluttdato, rekker oppholdet aldri å bli redusert.
 */
export function erReduksjonMuligForOpphold(oppholdTil: string, tidligsteReduksjonsdato?: string | null): boolean {
  if (!tidligsteReduksjonsdato) return true;
  const tilDato = new Dato(oppholdTil).dato;
  const reduksjonDato = new Dato(tidligsteReduksjonsdato).dato;
  return !isAfter(reduksjonDato, tilDato);
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

export function beregnEffektivTidligsteReduksjonsdato(
  opphold: { oppholdFra: string; tidligsteReduksjonsdato?: string | null },
  forrigeOppholdAvsluttetDato?: string | null,
  tidligereVurderingerForrigeOpphold?: HelseInstiusjonVurdering[] | null
): { effektivTidligsteReduksjonsdato: string | null | undefined; bruker1Månedsregelen: boolean } {
  const forrigeGaReduksjon = tidligereVurderingerForrigeOpphold?.some(
    (v) => erReduksjonUtIFraVurdering(v) && !v.erHistoriskUtenReduksjonsberegning
  );

  const innenforTreMåneder =
    !!forrigeOppholdAvsluttetDato &&
    erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdAvsluttetDato, opphold.oppholdFra);

  const bruker1Månedsregelen = Boolean(forrigeGaReduksjon && innenforTreMåneder);

  const effektivTidligsteReduksjonsdato = bruker1Månedsregelen
    ? format(startOfMonth(addMonths(new Dato(opphold.oppholdFra).dato, 1)), 'yyyy-MM-dd')
    : opphold.tidligsteReduksjonsdato;

  return { bruker1Månedsregelen, effektivTidligsteReduksjonsdato };
}

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
