import { addMonths, format, isAfter, isBefore, isEqual, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend } from 'lib/utils/date';
import { Dato } from 'lib/types/Dato';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering } from 'lib/types/types';

import { JaEllerNei } from 'lib/utils/form';
import {
  OppholdMedVurderinger,
  OppholdVurdering,
} from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';

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

export function harKorrigertReduksjonsdato(
  vurderinger: OppholdVurdering[] | undefined,
  standardTidligsteReduksjonsdato: string
): boolean {
  return (
    vurderinger?.some((v) => {
      if (!erReduksjonUtIFraFormFields(v)) return false;
      const fom = v.periode?.fom;
      if (!erGyldigDatoFormat(fom)) return false;
      return !isBefore(new Dato(fom).dato, new Dato(standardTidligsteReduksjonsdato).dato);
    }) ?? false
  );
}

export function erGyldigDatoFormat(dato: string | undefined): dato is string {
  return !!dato && /^\d{2}\.\d{2}\.\d{4}$/.test(dato);
}

export function forrigeOppholdHarIngenReduksjonLengre(
  forrigeOppholdVurderinger: OppholdVurdering[] | undefined,
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null
): boolean {
  if (forrigeOppholdVurderinger == null || forrigeOppholdVurderinger.length === 0) return false;

  const forrigeErBesvart = forrigeOppholdVurderinger.every((v) => v.faarFriKostOgLosji !== undefined);
  if (!forrigeErBesvart) return false;

  const harVurderingerMedReduksjon = forrigeOppholdVurderinger.some((v) => erReduksjonUtIFraFormFields(v));
  if (harVurderingerMedReduksjon) return false;

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

  return !harKorrigertReduksjonsdato(oppholdVurderinger, standardTidligsteReduksjonsdato);
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

export function beregnEffektivTidligsteReduksjonsdatoFraSkjema({
  oppholdFra,
  tidligsteReduksjonsdato,
  forrigeOppholdAvsluttetDato,
  forrigeOppholdVurderinger,
  forrigeGirReduksjon,
  enManedsregelEnabled,
}: {
  oppholdFra: string;
  tidligsteReduksjonsdato?: string | null;
  forrigeOppholdAvsluttetDato?: string | null;
  forrigeOppholdVurderinger?: OppholdVurdering[];
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null;
  forrigeGirReduksjon?: boolean;
  enManedsregelEnabled: boolean;
}): { effektivTidligsteReduksjonsdato: string | null | undefined; bruker1Månedsregelen: boolean } {
  const forrigeGaReduksjonNå =
    forrigeGirReduksjon ?? forrigeOppholdVurderinger?.some((v) => erReduksjonUtIFraFormFields(v)) ?? false;

  const innenforTreMåneder =
    !!forrigeOppholdAvsluttetDato &&
    erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdAvsluttetDato, oppholdFra);

  const bruker1Månedsregelen = enManedsregelEnabled ? forrigeGaReduksjonNå && innenforTreMåneder : innenforTreMåneder;

  if (bruker1Månedsregelen) {
    return {
      bruker1Månedsregelen,
      effektivTidligsteReduksjonsdato: format(startOfMonth(addMonths(new Dato(oppholdFra).dato, 1)), 'yyyy-MM-dd'),
    };
  }

  if (enManedsregelEnabled) {
    return {
      bruker1Månedsregelen,
      effektivTidligsteReduksjonsdato: beregnStandardTidligsteReduksjonsdato(oppholdFra),
    };
  }

  return { bruker1Månedsregelen, effektivTidligsteReduksjonsdato: tidligsteReduksjonsdato };
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

export function erVurderingHistorisk(
  vurdering: OppholdVurdering,
  reduksjonErMulig: boolean,
  enManedsregelEnabled: boolean
): boolean {
  return enManedsregelEnabled && erReduksjonUtIFraFormFields(vurdering) && !reduksjonErMulig;
}

export function grupperVedtattePerOppholdId(
  vedtatte: HelseinstitusjonGrunnlag['vedtatteVurderinger']
): Record<string, HelseInstiusjonVurdering[]> {
  return vedtatte.reduce<Record<string, HelseInstiusjonVurdering[]>>((acc, v) => {
    const id = v.oppholdId ?? '';
    acc[id] = [...(acc[id] ?? []), ...(v.vurderinger ?? [])];
    return acc;
  }, {});
}

export interface OppholdReduksjonsstatus {
  effektivTidligsteReduksjonsdato: string | null | undefined;
  bruker1Månedsregelen: boolean;
  reduksjonErMulig: boolean;
  girReduksjon: boolean;
}

function girOppholdReduksjon(
  opphold: OppholdMedVurderinger,
  vedtatte: HelseInstiusjonVurdering[] | undefined,
  reduksjonErMulig: boolean,
  enManedsregelEnabled: boolean
): boolean {
  if (opphold.vurderinger.length > 0) {
    return opphold.vurderinger.some(
      (v) => erReduksjonUtIFraFormFields(v) && !erVurderingHistorisk(v, reduksjonErMulig, enManedsregelEnabled)
    );
  }

  const oppholdTil = new Dato(opphold.periode.tom).dato;
  return (vedtatte ?? []).some(
    (v) =>
      !v.erHistoriskUtenReduksjonsberegning &&
      erReduksjonUtIFraVurdering(v) &&
      !isAfter(new Dato(v.periode.fom).dato, oppholdTil)
  );
}

export function beregnReduksjonskjede(
  opphold: OppholdMedVurderinger[],
  vedtattePerOppholdId: Record<string, HelseInstiusjonVurdering[]>,
  enManedsregelEnabled: boolean,
  tilOgMedIndex: number
): OppholdReduksjonsstatus[] {
  const resultat: OppholdReduksjonsstatus[] = [];

  opphold.slice(0, tilOgMedIndex + 1).forEach((o, i) => {
    const forrige = i > 0 ? opphold[i - 1] : undefined;

    const { effektivTidligsteReduksjonsdato, bruker1Månedsregelen } = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
      oppholdFra: o.periode.fom,
      tidligsteReduksjonsdato: o.tidligsteReduksjonsdato,
      forrigeOppholdAvsluttetDato: forrige?.periode.tom,
      forrigeOppholdVurderinger: forrige?.vurderinger,
      forrigeOppholdVedtatteVurderinger: forrige ? vedtattePerOppholdId[forrige.oppholdId] : undefined,
      forrigeGirReduksjon: i > 0 ? resultat[i - 1].girReduksjon : undefined,
      enManedsregelEnabled,
    });

    const reduksjonErMulig =
      !enManedsregelEnabled || erReduksjonMuligForOpphold(o.periode.tom, effektivTidligsteReduksjonsdato);

    const girReduksjon = girOppholdReduksjon(
      o,
      vedtattePerOppholdId[o.oppholdId],
      reduksjonErMulig,
      enManedsregelEnabled
    );

    resultat.push({ effektivTidligsteReduksjonsdato, bruker1Månedsregelen, reduksjonErMulig, girReduksjon });
  });

  return resultat;
}
