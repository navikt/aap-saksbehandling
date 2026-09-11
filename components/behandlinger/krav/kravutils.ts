import {
  KlageKravLøsning,
  KravGrunnlag,
  KravVurdering,
  KravVurderingForSøknad,
  KravVurderingLøsning,
  MigrertKravLøsning,
  MigrertKravVurdering,
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
import { JaEllerNei, MuligRettFraTilbakedateresValg, SøknadsdatoEndresValg } from 'lib/utils/form';

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

export function kravVurderingIsKravVurderingForSøknad(
  kravVurdering: KravVurdering
): kravVurdering is KravVurderingForSøknad {
  return kravVurdering.type !== 'MIGRERT_KRAV';
}

export function kravVurderingIsKMigrertKrav(kravVurdering: KravVurdering): kravVurdering is MigrertKravVurdering {
  return kravVurdering.type === 'MIGRERT_KRAV';
}

export function getKravVurderingerForSøknad(
  kravVurderinger: KravVurdering[] | null | undefined
): KravVurderingForSøknad[] {
  if (kravVurderinger == null) {
    return [];
  }
  return kravVurderinger.filter(kravVurderingIsKravVurderingForSøknad);
}

export function finnMigrertKrav(kravVurderinger: KravVurdering[] | null | undefined): MigrertKravVurdering | undefined {
  return kravVurderinger?.find(kravVurderingIsKMigrertKrav);
}

export interface MigrertKravFormFields {
  arenaSaksnummer: string;
  rettighetstype: string;
  muligRettFra: string;
  virkningstidspunktArena: string;
  resterendeKvoteOrdinær: string;
  begrunnelse: string;
}

export function migrertKravTilFormFields(vurdering: MigrertKravVurdering): MigrertKravFormFields {
  return {
    arenaSaksnummer: vurdering.arenaSaksnummer,
    rettighetstype: vurdering.rettighetstype,
    muligRettFra: formaterDatoForFrontend(vurdering.muligRettFra),
    virkningstidspunktArena: formaterDatoForFrontend(vurdering.virkningstidspunktArena),
    resterendeKvoteOrdinær: String(vurdering.resterendeKvoteOrdinær),
    begrunnelse: vurdering.begrunnelse,
  };
}

export function emptyMigrertKravFormFields(): MigrertKravFormFields {
  return {
    arenaSaksnummer: '',
    rettighetstype: '',
    muligRettFra: '',
    virkningstidspunktArena: '',
    resterendeKvoteOrdinær: '',
    begrunnelse: '',
  };
}

export function byggInitiellMigrertKravVurdering(grunnlag?: KravGrunnlag): MigrertKravFormFields {
  const migrertKrav = finnMigrertKrav([...(grunnlag?.nyeVurderinger ?? []), ...(grunnlag?.vedtatteVurderinger ?? [])]);
  return migrertKrav ? migrertKravTilFormFields(migrertKrav) : emptyMigrertKravFormFields();
}

export function harIngenKravvurderinger(grunnlag?: KravGrunnlag): boolean {
  return (grunnlag?.nyeVurderinger.length ?? 0) + (grunnlag?.vedtatteVurderinger.length ?? 0) === 0;
}

function byggMigrertKravLøsning(
  migrertKravVurdering: MigrertKravFormFields,
  referanse: string | undefined
): MigrertKravLøsning {
  const muligRettFraParsed = parseDatoFraDatePicker(migrertKravVurdering.muligRettFra);
  const virkningstidspunktArenaParsed = parseDatoFraDatePicker(migrertKravVurdering.virkningstidspunktArena);

  if (!muligRettFraParsed) {
    throw new Error(`Mangler gyldig "mulig rett fra"-dato for migrert krav ${migrertKravVurdering.arenaSaksnummer}`);
  }
  if (!virkningstidspunktArenaParsed) {
    throw new Error(
      `Mangler gyldig virkningstidspunkt på sak for migrert krav ${migrertKravVurdering.arenaSaksnummer}`
    );
  }

  return {
    kravType: 'MIGRERT_KRAV',
    arenaSaksnummer: migrertKravVurdering.arenaSaksnummer,
    rettighetstype: migrertKravVurdering.rettighetstype as MigrertKravLøsning['rettighetstype'],
    muligRettFra: formaterDatoForBackend(muligRettFraParsed),
    virkningstidspunktArena: formaterDatoForBackend(virkningstidspunktArenaParsed),
    resterendeKvoteOrdinær: Number(migrertKravVurdering.resterendeKvoteOrdinær),
    begrunnelse: migrertKravVurdering.begrunnelse,
    referanse,
  } satisfies MigrertKravLøsning;
}

export function byggMigrertKravLøsningFraSkjema(
  grunnlag: KravGrunnlag | undefined,
  migrertKravVurdering: MigrertKravFormFields,
  migrertKravÅpen: boolean
): MigrertKravLøsning | undefined {
  const migrertKravFraNye = finnMigrertKrav(grunnlag?.nyeVurderinger);
  const migrertKravFraVedtatt = finnMigrertKrav(grunnlag?.vedtatteVurderinger);
  const original = migrertKravFraNye ?? migrertKravFraVedtatt;

  // Hvis migrert-krav-skjemaet er åpent skal denne ALLTID sendes inn, brukes referanse på eksisterende krav (hvis eksisterer)
  if (migrertKravÅpen) {
    return byggMigrertKravLøsning(migrertKravVurdering, original?.referanse);
  }

  // Hvis skjema ikke er åpent, men vi har et eksisterende migrert krav sendes vi inn dette igjen som en løsning
  if (migrertKravFraNye != null) {
    return byggMigrertKravLøsning(migrertKravTilFormFields(migrertKravFraNye), migrertKravFraNye.referanse);
  }

  // Skjemaet er ikke åpent, og vi har IKKE noen nyeVurderinger: Ikke send ikk noe
  return undefined;
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
    case 'MIGRERT_KRAV':
      return 'Migrert krav';
  }
}

export interface KravVurderingFormFields {
  skalVurderesForNyEllerGjenopptattAAPRettighet: string;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoÅrsak: string;
  søknadsdatoEndres: string;
  søknadsdatoBegrunnelse: string;
  overstyrDato: string;
  overstyrÅrsak: string;
  muligRettFraTilbakedateres: string;
  muligRettFraBegrunnelse: string;
}

function utledSøknadsdatoEndres(årsak: string): string {
  switch (årsak) {
    case SøknadsdatoEndresValg.BrukerHarSøktTidligere:
    case SøknadsdatoEndresValg.FeilregistrertSøknadsdato:
      return årsak;
    default:
      return SøknadsdatoEndresValg.Nei;
  }
}

function utledMuligRettFraTilbakedateres(årsak: string): string {
  switch (årsak) {
    case MuligRettFraTilbakedateresValg.IkkeIStandTilÅSøkeTidligere:
    case MuligRettFraTilbakedateresValg.MisvisendeOpplysninger:
      return årsak;
    default:
      return MuligRettFraTilbakedateresValg.Nei;
  }
}

export function kravVurderingTilFormFields(vurdering: KravVurderingForSøknad): KravVurderingFormFields {
  const søknadsdato = finnSøknadsdato(vurdering);
  const overstyr = finnOverstyrMuligRettFra(vurdering);

  return {
    skalVurderesForNyEllerGjenopptattAAPRettighet: vurdering.type === 'RELEVANT_KRAV' ? JaEllerNei.Ja : JaEllerNei.Nei,
    journalpostId: vurdering.journalpostId.identifikator,
    begrunnelse: vurdering.begrunnelse,
    søknadsdatoDato: søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '',
    søknadsdatoÅrsak: søknadsdato?.årsak ?? '',
    søknadsdatoEndres: utledSøknadsdatoEndres(søknadsdato?.årsak ?? ''),
    søknadsdatoBegrunnelse: søknadsdato?.begrunnelse ?? '',
    overstyrDato: overstyr ? formaterDatoForFrontend(overstyr.dato) : '',
    overstyrÅrsak: overstyr?.årsak ?? '',
    muligRettFraTilbakedateres: utledMuligRettFraTilbakedateres(overstyr?.årsak ?? ''),
    muligRettFraBegrunnelse: overstyr?.begrunnelse ?? '',
  };
}

/**
 * Bygger default-verdiene for en søknad som ennå ikke har noen kravvurdering.
 * Brukes til å opprette et nytt RELEVANT_KRAV via KravBoks – søknadsdato/årsak
 * forhåndsutfylles ut fra når søknaden ble mottatt, men kan endres av saksbehandler.
 */
export function søknadUtenKravTilFormFields(søknad: SøknadUtenKrav): KravVurderingFormFields {
  return {
    skalVurderesForNyEllerGjenopptattAAPRettighet: '',
    journalpostId: søknad.journalpostId.identifikator,
    begrunnelse: '',
    søknadsdatoDato: formaterDatoForFrontend(søknad.mottattTidspunkt),
    søknadsdatoÅrsak: 'SøknadMottatt',
    søknadsdatoEndres: SøknadsdatoEndresValg.Nei,
    søknadsdatoBegrunnelse: '',
    overstyrDato: '',
    overstyrÅrsak: '',
    muligRettFraTilbakedateres: MuligRettFraTilbakedateresValg.Nei,
    muligRettFraBegrunnelse: '',
  };
}

export function byggInitielleVurderinger(grunnlag?: KravGrunnlag): Record<string, KravVurderingFormFields> {
  const alleVurderinger = getKravVurderingerForSøknad([
    ...(grunnlag?.nyeVurderinger ?? []),
    ...(grunnlag?.vedtatteVurderinger ?? []),
  ]);
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
): KravVurderingForSøknad | undefined {
  return (
    getKravVurderingerForSøknad(grunnlag?.nyeVurderinger).find((v) => v.referanse === referanse) ??
    getKravVurderingerForSøknad(grunnlag?.vedtatteVurderinger).find((v) => v.referanse === referanse)
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
  if (krav && kravVurderingIsKravVurderingForSøknad(krav)) return kravVurderingTilFormFields(krav);

  const søknad = finnSøknadUtenKravByReferanse(grunnlag, referanse);
  if (søknad) return søknadUtenKravTilFormFields(søknad);

  return undefined;
}

function byggLøsningFraFelter(felter: {
  kravType: KravType;
  journalpostId: string;
  begrunnelse: string;
  søknadsdatoDato: string;
  søknadsdatoEndres: string;
  søknadsdatoBegrunnelse: string;
  overstyrDato: string;
  muligRettFraTilbakedateres: string;
  muligRettFraBegrunnelse: string;
  referanse: string | undefined;
}): KravVurderingLøsning {
  const journalpostId = { identifikator: felter.journalpostId };

  if (felter.kravType === 'RELEVANT_KRAV') {
    const søknadsdatoParsed = parseDatoFraDatePicker(felter.søknadsdatoDato);
    const overstyrParsed = felter.overstyrDato ? parseDatoFraDatePicker(felter.overstyrDato) : undefined;
    const søknadsdatoEndres = felter.søknadsdatoEndres || SøknadsdatoEndresValg.Nei;
    const muligRettFraTilbakedateres = felter.muligRettFraTilbakedateres || MuligRettFraTilbakedateresValg.Nei;

    // Skjemaet krever søknadsdato for RELEVANT_KRAV (se KravBoks), så denne skal alltid finnes ved submit.
    if (!søknadsdatoParsed) {
      throw new Error(`Mangler gyldig søknadsdato for krav med journalpost ${felter.journalpostId}`);
    }

    // Begrunnelsen for §22-13 femte ledd er obligatorisk i skjemaet uansett Ja/Nei-svar (se
    // KravBoks), og sendes derfor alltid – uavhengig av søknadsdatoEndres.
    const søknadsdato: Søknadsdato = {
      dato: formaterDatoForBackend(søknadsdatoParsed),
      årsak: (søknadsdatoEndres === SøknadsdatoEndresValg.Nei
        ? 'SøknadMottatt'
        : søknadsdatoEndres) as Søknadsdato['årsak'],
      begrunnelse: felter.søknadsdatoBegrunnelse,
    };

    // overstyrMuligRettFra sendes kun når bruker har svart Ja (§22-13 syvende ledd), og har da
    // alltid begrunnelse siden feltet er obligatorisk i skjemaet når bolken er i bruk.
    const overstyrMuligRettFra: OverstyrMuligRettFra | undefined =
      muligRettFraTilbakedateres !== MuligRettFraTilbakedateresValg.Nei && overstyrParsed
        ? {
            dato: formaterDatoForBackend(overstyrParsed),
            årsak: muligRettFraTilbakedateres as NonNullable<OverstyrMuligRettFra>['årsak'],
            begrunnelse: felter.muligRettFraBegrunnelse,
          }
        : undefined;

    return {
      kravType: 'RELEVANT_KRAV',
      journalpostId,
      begrunnelse: felter.begrunnelse,
      søknadsdato,
      overstyrMuligRettFra,
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
    original.skalVurderesForNyEllerGjenopptattAAPRettighet !==
      gjeldende.skalVurderesForNyEllerGjenopptattAAPRettighet ||
    original.begrunnelse !== gjeldende.begrunnelse ||
    original.søknadsdatoDato !== gjeldende.søknadsdatoDato ||
    original.søknadsdatoEndres !== gjeldende.søknadsdatoEndres ||
    original.søknadsdatoBegrunnelse !== gjeldende.søknadsdatoBegrunnelse ||
    original.overstyrDato !== gjeldende.overstyrDato ||
    original.muligRettFraTilbakedateres !== gjeldende.muligRettFraTilbakedateres ||
    original.muligRettFraBegrunnelse !== gjeldende.muligRettFraBegrunnelse
  );
}

function feltTilLøsning(felt: KravVurderingFormFields, referanse: string | undefined): KravVurderingLøsning {
  return byggLøsningFraFelter({
    kravType:
      felt.skalVurderesForNyEllerGjenopptattAAPRettighet === JaEllerNei.Ja ? 'RELEVANT_KRAV' : 'TILLEGGSOPPLYSNING',
    journalpostId: felt.journalpostId,
    begrunnelse: felt.begrunnelse,
    søknadsdatoDato: felt.søknadsdatoDato,
    søknadsdatoEndres: felt.søknadsdatoEndres,
    søknadsdatoBegrunnelse: felt.søknadsdatoBegrunnelse,
    overstyrDato: felt.overstyrDato,
    muligRettFraTilbakedateres: felt.muligRettFraTilbakedateres,
    muligRettFraBegrunnelse: felt.muligRettFraBegrunnelse,
    referanse,
  });
}

export function byggKravVurderingerFraSkjema(
  grunnlag: KravGrunnlag | undefined,
  vurderinger: Record<string, KravVurderingFormFields>
): KravVurderingLøsning[] {
  const eksisterendeReferanser = new Set([
    ...(grunnlag?.nyeVurderinger ?? []).map((v) => v.referanse),
    ...(grunnlag?.vedtatteVurderinger ?? []).map((v) => v.referanse),
  ]);

  const endredeVurderinger = Object.entries(vurderinger).filter(([referanse, felt]) => {
    const original = hentOriginaleFormFelter(grunnlag, referanse);
    if (!original) return false;
    return erFelterEndret(original, felt);
  });

  /**
   * Ingen av vurderingene er endret eller overstyrt.
   * Saksbehandler skal derfor kun bekrefte de eksisterende nye vurderingene, uten at det er behov for å gjøre ytterligere endringer.
   */
  if (endredeVurderinger.length === 0) {
    return (grunnlag?.nyeVurderinger ?? []).map((v) => feltTilLøsning(kravVurderingTilFormFields(v), v.referanse));
  }

  return endredeVurderinger.map(([referanse, felt]) =>
    feltTilLøsning(felt, eksisterendeReferanser.has(referanse) ? referanse : undefined)
  );
}
