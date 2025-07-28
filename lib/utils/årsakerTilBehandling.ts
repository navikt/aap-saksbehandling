import { ValuePair } from '../../components/form/FormField';
import type { ÅrsakTilBehandling } from '../types/types';
import { formaterÅrsak } from 'lib/utils/årsaker';

export const årsakOptions: ValuePair<ÅrsakTilBehandling>[] = [
  { label: 'Lovvalg og medlemskap', value: 'LOVVALG_OG_MEDLEMSKAP' },
  { label: 'Forutgående medlemskap', value: 'FORUTGAENDE_MEDLEMSKAP' },
  { label: 'Sykdom, arbeidsevne og behov for bistand', value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND' },
  { label: 'Beregningstidspunkt', value: 'REVURDER_BEREGNING' },
  { label: 'Barnetillegg', value: 'BARNETILLEGG' },
  { label: 'Institusjonsopphold', value: 'INSTITUSJONSOPPHOLD' },
  { label: 'Samordning og avregning', value: 'SAMORDNING_OG_AVREGNING' },
  { label: 'Refusjonskrav', value: 'REFUSJONSKRAV' },
  { label: 'Yrkesskade', value: 'REVURDER_YRKESSKADE' },
  { label: 'Manuell inntekt', value: 'REVURDER_MANUELL_INNTEKT' },
  // TODO: For at denne skal fungere må det gjøres litt justering i data som sendes i melding.
  // { label: 'Utenlandsopphold før søknadstidspunkt', value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT' },
];

export const alleÅrsakerTilBehandlingOptions: ValuePair<ÅrsakTilBehandling>[] = [
  { value: 'MOTTATT_SØKNAD', label: formaterÅrsak('MOTTATT_SØKNAD') },
  { value: 'MOTTATT_AKTIVITETSMELDING', label: formaterÅrsak('MOTTATT_AKTIVITETSMELDING') },
  { value: 'MOTTATT_MELDEKORT', label: formaterÅrsak('MOTTATT_MELDEKORT') },
  { value: 'MOTTATT_LEGEERKLÆRING', label: formaterÅrsak('MOTTATT_LEGEERKLÆRING') },
  { value: 'MOTTATT_AVVIST_LEGEERKLÆRING', label: formaterÅrsak('MOTTATT_AVVIST_LEGEERKLÆRING') },
  { value: 'MOTTATT_DIALOGMELDING', label: formaterÅrsak('MOTTATT_DIALOGMELDING') },
  { value: 'MOTATT_KLAGE', label: formaterÅrsak('MOTATT_KLAGE') },
  { value: 'SØKNAD_TRUKKET', label: formaterÅrsak('SØKNAD_TRUKKET') },
  { value: 'KLAGE_TRUKKET', label: formaterÅrsak('KLAGE_TRUKKET') },
  { value: 'REVURDER_MEDLEMSKAP', label: formaterÅrsak('REVURDER_MEDLEMSKAP') },
  { value: 'REVURDER_SAMORDNING', label: formaterÅrsak('REVURDER_SAMORDNING') },
  { value: 'REVURDER_LOVVALG', label: formaterÅrsak('REVURDER_LOVVALG') },
  { value: 'REVURDER_BEREGNING', label: formaterÅrsak('REVURDER_BEREGNING') },
  { value: 'REVURDER_YRKESSKADE', label: formaterÅrsak('REVURDER_YRKESSKADE') },
  { value: 'REVURDER_MANUELL_INNTEKT', label: formaterÅrsak('REVURDER_MANUELL_INNTEKT') },
  { value: 'G_REGULERING', label: formaterÅrsak('G_REGULERING') },
  { value: 'LOVVALG_OG_MEDLEMSKAP', label: formaterÅrsak('LOVVALG_OG_MEDLEMSKAP') },
  { value: 'FORUTGAENDE_MEDLEMSKAP', label: formaterÅrsak('FORUTGAENDE_MEDLEMSKAP') },
  { value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND', label: formaterÅrsak('SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND') },
  { value: 'BARNETILLEGG', label: formaterÅrsak('BARNETILLEGG') },
  { value: 'INSTITUSJONSOPPHOLD', label: formaterÅrsak('INSTITUSJONSOPPHOLD') },
  { value: 'SAMORDNING_OG_AVREGNING', label: formaterÅrsak('SAMORDNING_OG_AVREGNING') },
  { value: 'REFUSJONSKRAV', label: formaterÅrsak('REFUSJONSKRAV') },
  { value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT', label: formaterÅrsak('UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT') },
  { value: 'FASTSATT_PERIODE_PASSERT', label: formaterÅrsak('FASTSATT_PERIODE_PASSERT') },
  { value: 'FRITAK_MELDEPLIKT', label: formaterÅrsak('FRITAK_MELDEPLIKT') },
  { value: 'VURDER_RETTIGHETSPERIODE', label: formaterÅrsak('VURDER_RETTIGHETSPERIODE') },
  { value: 'MOTTATT_KABAL_HENDELSE', label: formaterÅrsak('MOTTATT_KABAL_HENDELSE') },
  { value: 'OPPFØLGINGSOPPGAVE', label: formaterÅrsak('OPPFØLGINGSOPPGAVE') },
];
