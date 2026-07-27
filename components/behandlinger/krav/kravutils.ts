import {
  KlageKravLøsning,
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
