import {
  KlageKravLøsning,
  KravGrunnlag,
  KravVurdering,
  KravVurderingLøsning,
  OverstyrMuligRettFra,
  RelevantKrav,
  RelevantKravLøsning,
  Søknadsdato,
  SøknadUtenKrav,
  TilleggsopplysningKravLøsning,
  TrukketSøknadKravLøsning,
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
  }
}

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

/**
 * Bygger default-verdiene for en søknad som ennå ikke har noen kravvurdering.
 * Brukes til å opprette et nytt RELEVANT_KRAV via KravBoks – søknadsdato/årsak
 * forhåndsutfylles ut fra når søknaden ble mottatt, men kan endres av saksbehandler.
 */
export function søknadUtenKravTilFormFields(søknad: SøknadUtenKrav): KravVurderingFormFields {
  return {
    kravtype: 'RELEVANT_KRAV',
    journalpostId: søknad.journalpostId.identifikator,
    begrunnelse: '',
    søknadsdatoDato: formaterDatoForFrontend(søknad.mottattTidspunkt),
    søknadsdatoÅrsak: 'SøknadMottatt',
    overstyrDato: '',
    overstyrÅrsak: '',
  };
}

export function byggInitielleVurderinger(grunnlag?: KravGrunnlag): Record<string, KravVurderingFormFields> {
  const alleVurderinger = [...(grunnlag?.nyeVurderinger ?? []), ...(grunnlag?.vedtatteVurderinger ?? [])];
  const fraVurderinger = Object.fromEntries(alleVurderinger.map((v) => [v.referanse, kravVurderingTilFormFields(v)]));
  const fraSøknaderUtenKrav = Object.fromEntries(
    (grunnlag?.søknaderUtenKravvurdering ?? []).map((s) => [
      s.journalpostId.identifikator,
      søknadUtenKravTilFormFields(s),
    ])
  );
  return { ...fraVurderinger, ...fraSøknaderUtenKrav };
}

/**
 * Referansen som brukes i skjemaet (valgteKrav/vurderinger) for en søknad uten krav er
 * journalpostens id, siden søknaden ennå ikke har en kravvurdering med egen referanse.
 */
export function finnKravVurderingByReferanse(
  grunnlag: KravGrunnlag | undefined,
  referanse: string
): KravVurdering | undefined {
  return (
    grunnlag?.nyeVurderinger.find((v) => v.referanse === referanse) ??
    grunnlag?.vedtatteVurderinger.find((v) => v.referanse === referanse)
  );
}

export function finnSøknadUtenKravByReferanse(
  grunnlag: KravGrunnlag | undefined,
  referanse: string
): SøknadUtenKrav | undefined {
  return grunnlag?.søknaderUtenKravvurdering.find((s) => s.journalpostId.identifikator === referanse);
}

/**
 * Henter originalverdiene et felt i skjemaet skal nullstilles til når det lukkes, uavhengig
 * av om referansen peker på et eksisterende krav eller en søknad som ennå ikke er vurdert.
 */
export function hentOriginaleFormFelter(
  grunnlag: KravGrunnlag | undefined,
  referanse: string
): KravVurderingFormFields | undefined {
  const krav = finnKravVurderingByReferanse(grunnlag, referanse);
  if (krav) return kravVurderingTilFormFields(krav);

  const søknad = finnSøknadUtenKravByReferanse(grunnlag, referanse);
  if (søknad) return søknadUtenKravTilFormFields(søknad);

  return undefined;
}

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

function erFelterEndret(original: KravVurderingFormFields, gjeldende: KravVurderingFormFields): boolean {
  return (
    original.kravtype !== gjeldende.kravtype ||
    original.begrunnelse !== gjeldende.begrunnelse ||
    original.søknadsdatoDato !== gjeldende.søknadsdatoDato ||
    original.søknadsdatoÅrsak !== gjeldende.søknadsdatoÅrsak ||
    original.overstyrDato !== gjeldende.overstyrDato ||
    original.overstyrÅrsak !== gjeldende.overstyrÅrsak
  );
}

export function byggKravVurderingerFraSkjema(
  grunnlag: KravGrunnlag | undefined,
  vurderinger: Record<string, KravVurderingFormFields>
): KravVurderingLøsning[] {
  const eksisterendeReferanser = new Set([
    ...(grunnlag?.nyeVurderinger ?? []).map((v) => v.referanse),
    ...(grunnlag?.vedtatteVurderinger ?? []).map((v) => v.referanse),
  ]);

  return Object.entries(vurderinger)
    .filter(([referanse, felt]) => {
      const original = hentOriginaleFormFelter(grunnlag, referanse);
      // Ukjent referanse (verken eksisterende krav eller søknad i grunnlaget) - ta ikke med.
      if (!original) return false;
      return erFelterEndret(original, felt);
    })
    .map(([referanse, felt]) =>
      byggLøsningFraFelter({
        kravType: felt.kravtype,
        journalpostId: felt.journalpostId,
        begrunnelse: felt.begrunnelse,
        søknadsdatoDato: felt.søknadsdatoDato,
        søknadsdatoÅrsak: felt.søknadsdatoÅrsak,
        overstyrDato: felt.overstyrDato,
        overstyrÅrsak: felt.overstyrÅrsak,
        referanse: eksisterendeReferanser.has(referanse) ? referanse : undefined,
      })
    );
}
