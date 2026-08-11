import {
  KlageKravLøsning,
  KravGrunnlag,
  KravVurdering,
  KravVurderingLøsning,
  RelevantKrav,
  OverstyrMuligRettFra,
  Søknadsdato,
  TilleggsopplysningKravLøsning,
  TrukketSøknadKravLøsning,
  RelevantKravLøsning,
} from 'lib/types/types';
import { KravType } from 'components/opprettsak/OpprettSakLocal';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';

export function finnSøknadsdato(vurdering: KravVurdering): Søknadsdato | null {
  switch (vurdering.type) {
    case 'RELEVANT_KRAV':
      return (vurdering as RelevantKrav).søknadsdato;
    default:
      return null;
  }
}

export function finnOverstyrMuligRettFra(vurdering: KravVurdering): OverstyrMuligRettFra | null {
  switch (vurdering.type) {
    case 'RELEVANT_KRAV':
      return (vurdering as RelevantKrav).overstyrMuligRettFra ?? null;
    default:
      return null;
  }
}

export function finnSøknadsdatoFraLøsning(løsning: KravVurderingLøsning): Søknadsdato | null {
  if (løsning.kravType === 'RELEVANT_KRAV') return (løsning as RelevantKravLøsning).søknadsdato;
  return null;
}

export function finnOverstyrMuligRettFraFraLøsning(løsning: KravVurderingLøsning): OverstyrMuligRettFra | null {
  if (løsning.kravType === 'RELEVANT_KRAV') return (løsning as RelevantKravLøsning).overstyrMuligRettFra ?? null;
  return null;
}

export function formaterKravtype(type: KravType) {
  switch (type) {
    case 'RELEVANT_KRAV':
      return 'Relevant krav';
    case 'KLAGE':
      return 'Klage';
    case 'TILLEGGSOPPLYSNING':
      return 'Tilleggsopplysning';
    case 'TRUKKET_SØKNAD':
      return 'Trukket søknad';
    default:
      return 'Ukjent';
  }
}

/**
 * Konverterer en KravVurdering (grunnlag-DTO) til KravVurderingLøsning (løsnings-DTO).
 * Brukes for nyeVurderinger som alltid skal sendes ved løs-behov.
 * referanse settes til undefined – vurderingen overstyrer ikke et vedtatt krav.
 */
export function kravVurderingTilLøsning(vurdering: KravVurdering): KravVurderingLøsning {
  switch (vurdering.type) {
    case 'RELEVANT_KRAV': {
      const v = vurdering as RelevantKrav;
      return {
        kravType: 'RELEVANT_KRAV',
        journalpostId: v.journalpostId,
        begrunnelse: v.begrunnelse,
        søknadsdato: v.søknadsdato,
        overstyrMuligRettFra: v.overstyrMuligRettFra,
        referanse: undefined,
      } satisfies RelevantKravLøsning;
    }
    case 'KLAGE':
      return {
        kravType: 'KLAGE',
        journalpostId: vurdering.journalpostId,
        begrunnelse: vurdering.begrunnelse,
        referanse: undefined,
      } satisfies KlageKravLøsning;
    case 'TILLEGGSOPPLYSNING':
      return {
        kravType: 'TILLEGGSOPPLYSNING',
        journalpostId: vurdering.journalpostId,
        begrunnelse: vurdering.begrunnelse,
        referanse: undefined,
      } satisfies TilleggsopplysningKravLøsning;
    case 'TRUKKET_SØKNAD':
      return {
        kravType: 'TRUKKET_SØKNAD',
        journalpostId: vurdering.journalpostId,
        begrunnelse: vurdering.begrunnelse,
        referanse: undefined,
      } satisfies TrukketSøknadKravLøsning;
  }
}

/**
 * Konverterer et vedtatt krav til en løsning som overstyrer det.
 * referanse settes til vurderingens referanse, slik at backend vet hva som endres.
 */
export function vedtattKravTilEndring(vurdering: KravVurdering): KravVurderingLøsning {
  const løsning = kravVurderingTilLøsning(vurdering);
  return { ...løsning, referanse: vurdering.referanse };
}

// ---------------------------------------------------------------------------
// Skjemafelter for KravBoks (VurderKravV2) – samme felter som lå i
// KravVurderingModal/LeggTilKravModal, men nøstet under krav-referansen i det
// delte KravFormFields-skjemaet (se VurderKravV2) slik at mellomlagring får
// dem med seg automatisk uten egen lagre/avbryt-håndtering per krav.
// ---------------------------------------------------------------------------

export interface KravVurderingFormFields {
  kravtype: KravType;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  overstyrDato: string;
  overstyrÅrsak: string;
}

export function kravVurderingTilFormFields(vurdering: KravVurdering): KravVurderingFormFields {
  const søknadsdato = finnSøknadsdato(vurdering);
  const overstyr = finnOverstyrMuligRettFra(vurdering);

  return {
    kravtype: vurdering.type,
    journalpostId: vurdering.journalpostId.identifikator,
    begrunnelse: vurdering.begrunnelse,
    søknadsdatoDato: søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '',
    søknadsdatoÅrsak: søknadsdato?.årsak ?? '',
    overstyrDato: overstyr ? formaterDatoForFrontend(overstyr.dato) : '',
    overstyrÅrsak: overstyr?.årsak ?? '',
  };
}

export function byggInitielleVurderinger(grunnlag?: KravGrunnlag): Record<string, KravVurderingFormFields> {
  const alleVurderinger = [...(grunnlag?.nyeVurderinger ?? []), ...(grunnlag?.vedtatteVurderinger ?? [])];
  return Object.fromEntries(alleVurderinger.map((v) => [v.referanse, kravVurderingTilFormFields(v)]));
}

export function finnKravVurderingByReferanse(
  grunnlag: KravGrunnlag | undefined,
  referanse: string
): KravVurdering | undefined {
  return (
    grunnlag?.nyeVurderinger.find((v) => v.referanse === referanse) ??
    grunnlag?.vedtatteVurderinger.find((v) => v.referanse === referanse)
  );
}

export type KravKilde = 'VEDTATT' | 'NY' | 'LOKAL_NY';

export interface KravRadFormFields {
  /** Stabil id brukt for å spore hvilke rader som har åpen KravBoks, uavhengig av RHF sin interne field-id. */
  clientId: string;
  referanse?: string;
  kilde: KravKilde;
  /** Soft delete – kun aktuelt for NY/LOKAL_NY. Filtreres bort først når payload til løs-behov bygges. */
  slettet: boolean;
  kravType: KravType;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  overstyrDato: string;
  overstyrÅrsak: string;
}

export interface KravSkjemaFields {
  rader: KravRadFormFields[];
}

export function kravVurderingTilRad(vurdering: KravVurdering, kilde: 'NY' | 'VEDTATT'): KravRadFormFields {
  const søknadsdato = finnSøknadsdato(vurdering);
  const overstyr = finnOverstyrMuligRettFra(vurdering);

  return {
    clientId: vurdering.referanse,
    referanse: vurdering.referanse,
    kilde,
    slettet: false,
    kravType: vurdering.type,
    journalpostId: vurdering.journalpostId.identifikator,
    begrunnelse: vurdering.begrunnelse,
    søknadsdatoDato: søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '',
    søknadsdatoÅrsak: søknadsdato?.årsak ?? '',
    overstyrDato: overstyr ? formaterDatoForFrontend(overstyr.dato) : '',
    overstyrÅrsak: overstyr?.årsak ?? '',
  };
}

export function tomKravRad(): KravRadFormFields {
  return {
    clientId: crypto.randomUUID(),
    referanse: undefined,
    kilde: 'LOKAL_NY',
    slettet: false,
    kravType: 'RELEVANT_KRAV',
    journalpostId: '',
    begrunnelse: '',
    søknadsdatoDato: '',
    søknadsdatoÅrsak: '',
    overstyrDato: '',
    overstyrÅrsak: '',
  };
}

export function byggInitialeRader(grunnlag?: KravGrunnlag): KravRadFormFields[] {
  const nye = (grunnlag?.nyeVurderinger ?? []).map((v) => kravVurderingTilRad(v, 'NY'));
  const vedtatte = (grunnlag?.vedtatteVurderinger ?? []).map((v) => kravVurderingTilRad(v, 'VEDTATT'));
  return [...nye, ...vedtatte];
}

function radTilLøsning(rad: KravRadFormFields): KravVurderingLøsning {
  // Kun vedtatte krav skal overstyres via referanse – nye/lokale krav sendes uten referanse.
  const referanse = rad.kilde === 'VEDTATT' ? rad.referanse : undefined;

  return byggLøsningFraFelter({
    kravType: rad.kravType,
    journalpostId: rad.journalpostId,
    begrunnelse: rad.begrunnelse,
    søknadsdatoDato: rad.søknadsdatoDato,
    søknadsdatoÅrsak: rad.søknadsdatoÅrsak,
    overstyrDato: rad.overstyrDato,
    overstyrÅrsak: rad.overstyrÅrsak,
    referanse,
  });
}

/**
 * Bygger en KravVurderingLøsning fra et sett flate skjemafelter, felles for både
 * KravRadFormFields (V1) og KravVurderingFormFields (V2/KravBoks).
 */
function byggLøsningFraFelter(felter: {
  kravType: KravType;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  overstyrDato: string;
  overstyrÅrsak: string;
  referanse: string | undefined;
}): KravVurderingLøsning {
  const journalpostId = { identifikator: felter.journalpostId };

  if (felter.kravType === 'RELEVANT_KRAV') {
    const søknadsdatoParsed = parseDatoFraDatePicker(felter.søknadsdatoDato);
    const overstyrParsed = felter.overstyrDato ? parseDatoFraDatePicker(felter.overstyrDato) : undefined;

    // Skjemaet krever søknadsdato for RELEVANT_KRAV (se KravBoks), så denne skal alltid finnes ved submit.
    if (!søknadsdatoParsed) {
      throw new Error(`Mangler gyldig søknadsdato for krav med journalpost ${felter.journalpostId}`);
    }

    return {
      kravType: 'RELEVANT_KRAV',
      journalpostId,
      begrunnelse: felter.begrunnelse,
      søknadsdato: {
        dato: formaterDatoForBackend(søknadsdatoParsed),
        årsak: felter.søknadsdatoÅrsak as 'BrukerHarSøktTidligere' | 'FeilregistrertSøknadsdato' | 'SøknadMottatt',
      },
      overstyrMuligRettFra:
        overstyrParsed && felter.overstyrÅrsak
          ? {
              dato: formaterDatoForBackend(overstyrParsed),
              årsak: felter.overstyrÅrsak as 'IkkeIStandTilÅSøkeTidligere' | 'MisvisendeOpplysninger',
            }
          : undefined,
      referanse: felter.referanse,
    } satisfies RelevantKravLøsning;
  }

  const felles = { journalpostId, begrunnelse: felter.begrunnelse, referanse: felter.referanse };
  switch (felter.kravType) {
    case 'KLAGE':
      return { kravType: 'KLAGE', ...felles } satisfies KlageKravLøsning;
    case 'TRUKKET_SØKNAD':
      return { kravType: 'TRUKKET_SØKNAD', ...felles } satisfies TrukketSøknadKravLøsning;
    case 'TILLEGGSOPPLYSNING':
    default:
      return { kravType: 'TILLEGGSOPPLYSNING', ...felles } satisfies TilleggsopplysningKravLøsning;
  }
}

/** Bygger payloaden som sendes til løs-behov: filtrerer bort soft-slettede rader og mapper resten til KravVurderingLøsning. */
export function byggKravVurderinger(rader: KravRadFormFields[]): KravVurderingLøsning[] {
  return rader.filter((r) => !r.slettet).map(radTilLøsning);
}

/**
 * Bygger payloaden til løs-behov ut fra KravBoks (VurderKravV2) sitt skjema, som holder
 * feltene nøstet per krav-referanse i stedet for som flate rader. Kun vedtatte krav skal
 * overstyres via referanse – nye vurderinger sendes uten referanse (se radTilLøsning).
 */
export function byggKravVurderingerFraSkjema(
  grunnlag: KravGrunnlag | undefined,
  vurderinger: Record<string, KravVurderingFormFields>
): KravVurderingLøsning[] {
  const vedtatteReferanser = new Set((grunnlag?.vedtatteVurderinger ?? []).map((v) => v.referanse));

  return Object.entries(vurderinger).map(([referanse, felt]) =>
    byggLøsningFraFelter({
      kravType: felt.kravtype,
      journalpostId: felt.journalpostId,
      begrunnelse: felt.begrunnelse,
      søknadsdatoDato: felt.søknadsdatoDato,
      søknadsdatoÅrsak: felt.søknadsdatoÅrsak,
      overstyrDato: felt.overstyrDato,
      overstyrÅrsak: felt.overstyrÅrsak,
      referanse: vedtatteReferanser.has(referanse) ? referanse : undefined,
    })
  );
}
