import {
  Gjenopptak,
  GjenopptakKravLøsning,
  KlageKravLøsning,
  KravVurdering,
  KravVurderingLøsning,
  NyttKrav,
  NyttKravLøsning,
  OverstyrMuligRettFra,
  Søknadsdato,
  TilleggsopplysningKravLøsning,
  TrukketSøknadKravLøsning,
} from 'lib/types/types';
import { KravType } from 'components/opprettsak/OpprettSakLocal';

export function finnSøknadsdato(vurdering: KravVurdering): Søknadsdato | null {
  switch (vurdering.type) {
    case 'NYTT_KRAV_AAP':
      return (vurdering as NyttKrav).søknadsdato;
    case 'GJENOPPTAK':
      return (vurdering as Gjenopptak).søknadsdato;
    default:
      return null;
  }
}

export function finnOverstyrMuligRettFra(vurdering: KravVurdering): OverstyrMuligRettFra | null {
  switch (vurdering.type) {
    case 'NYTT_KRAV_AAP':
      return (vurdering as NyttKrav).overstyrMuligRettFra ?? null;
    case 'GJENOPPTAK':
      return (vurdering as Gjenopptak).overstyrMuligRettFra ?? null;
    default:
      return null;
  }
}

export function finnSøknadsdatoFraLøsning(løsning: KravVurderingLøsning): Søknadsdato | null {
  if (løsning.kravType === 'NYTT_KRAV_AAP') return (løsning as NyttKravLøsning).søknadsdato;
  if (løsning.kravType === 'GJENOPPTAK') return (løsning as GjenopptakKravLøsning).søknadsdato;
  return null;
}

export function finnOverstyrMuligRettFraFraLøsning(løsning: KravVurderingLøsning): OverstyrMuligRettFra | null {
  if (løsning.kravType === 'NYTT_KRAV_AAP') return (løsning as NyttKravLøsning).overstyrMuligRettFra ?? null;
  if (løsning.kravType === 'GJENOPPTAK') return (løsning as GjenopptakKravLøsning).overstyrMuligRettFra ?? null;
  return null;
}

export function formaterKravtype(type: KravType) {
  switch (type) {
    case 'NYTT_KRAV_AAP':
      return 'Nytt krav';
    case 'KLAGE':
      return 'Klage';
    case 'GJENOPPTAK':
      return 'Gjenopptak';
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
    case 'NYTT_KRAV_AAP': {
      const v = vurdering as NyttKrav;
      return {
        kravType: 'NYTT_KRAV_AAP',
        journalpostId: v.journalpostId,
        begrunnelse: v.begrunnelse,
        søknadsdato: v.søknadsdato,
        overstyrMuligRettFra: v.overstyrMuligRettFra,
        referanse: undefined,
      } satisfies NyttKravLøsning;
    }
    case 'GJENOPPTAK': {
      const v = vurdering as Gjenopptak;
      return {
        kravType: 'GJENOPPTAK',
        journalpostId: v.journalpostId,
        begrunnelse: v.begrunnelse,
        søknadsdato: v.søknadsdato,
        overstyrMuligRettFra: v.overstyrMuligRettFra,
        referanse: undefined,
      } satisfies GjenopptakKravLøsning;
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
