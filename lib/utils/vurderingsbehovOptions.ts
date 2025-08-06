import { ValuePair } from 'components/form/FormField';
import type { Vurderingsbehov } from '../types/types';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';

export const vurderingsbehovOptions: ValuePair<Vurderingsbehov>[] = [
  { label: 'Helhetlig vurdering', value: 'HELHETLIG_VURDERING' },
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
  { label: 'Rimelig grunn til ikke overholdt meldeplikt', value: 'REVURDER_MELDEPLIKT_RIMELIG_GRUNN' },
  // TODO: For at denne skal fungere må det gjøres litt justering i data som sendes i melding.
  // { label: 'Utenlandsopphold før søknadstidspunkt', value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT' },
];

export const alleVurderingsbehovOptions: ValuePair<Vurderingsbehov>[] = [
  { value: 'MOTTATT_SØKNAD', label: formaterVurderingsbehov('MOTTATT_SØKNAD') },
  { value: 'MOTTATT_AKTIVITETSMELDING', label: formaterVurderingsbehov('MOTTATT_AKTIVITETSMELDING') },
  { value: 'MOTTATT_MELDEKORT', label: formaterVurderingsbehov('MOTTATT_MELDEKORT') },
  { value: 'MOTTATT_LEGEERKLÆRING', label: formaterVurderingsbehov('MOTTATT_LEGEERKLÆRING') },
  { value: 'MOTTATT_AVVIST_LEGEERKLÆRING', label: formaterVurderingsbehov('MOTTATT_AVVIST_LEGEERKLÆRING') },
  { value: 'MOTTATT_DIALOGMELDING', label: formaterVurderingsbehov('MOTTATT_DIALOGMELDING') },
  { value: 'MOTATT_KLAGE', label: formaterVurderingsbehov('MOTATT_KLAGE') },
  { value: 'SØKNAD_TRUKKET', label: formaterVurderingsbehov('SØKNAD_TRUKKET') },
  { value: 'KLAGE_TRUKKET', label: formaterVurderingsbehov('KLAGE_TRUKKET') },
  { value: 'REVURDER_MEDLEMSKAP', label: formaterVurderingsbehov('REVURDER_MEDLEMSKAP') },
  { value: 'REVURDER_SAMORDNING', label: formaterVurderingsbehov('REVURDER_SAMORDNING') },
  { value: 'REVURDER_LOVVALG', label: formaterVurderingsbehov('REVURDER_LOVVALG') },
  { value: 'REVURDER_BEREGNING', label: formaterVurderingsbehov('REVURDER_BEREGNING') },
  { value: 'REVURDER_YRKESSKADE', label: formaterVurderingsbehov('REVURDER_YRKESSKADE') },
  { value: 'REVURDER_MANUELL_INNTEKT', label: formaterVurderingsbehov('REVURDER_MANUELL_INNTEKT') },
  { value: 'G_REGULERING', label: formaterVurderingsbehov('G_REGULERING') },
  { value: 'LOVVALG_OG_MEDLEMSKAP', label: formaterVurderingsbehov('LOVVALG_OG_MEDLEMSKAP') },
  { value: 'FORUTGAENDE_MEDLEMSKAP', label: formaterVurderingsbehov('FORUTGAENDE_MEDLEMSKAP') },
  { value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND', label: formaterVurderingsbehov('SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND') },
  { value: 'BARNETILLEGG', label: formaterVurderingsbehov('BARNETILLEGG') },
  { value: 'INSTITUSJONSOPPHOLD', label: formaterVurderingsbehov('INSTITUSJONSOPPHOLD') },
  { value: 'SAMORDNING_OG_AVREGNING', label: formaterVurderingsbehov('SAMORDNING_OG_AVREGNING') },
  { value: 'REFUSJONSKRAV', label: formaterVurderingsbehov('REFUSJONSKRAV') },
  {
    value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT',
    label: formaterVurderingsbehov('UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT'),
  },
  { value: 'FASTSATT_PERIODE_PASSERT', label: formaterVurderingsbehov('FASTSATT_PERIODE_PASSERT') },
  { value: 'FRITAK_MELDEPLIKT', label: formaterVurderingsbehov('FRITAK_MELDEPLIKT') },
  { value: 'VURDER_RETTIGHETSPERIODE', label: formaterVurderingsbehov('VURDER_RETTIGHETSPERIODE') },
  { value: 'MOTTATT_KABAL_HENDELSE', label: formaterVurderingsbehov('MOTTATT_KABAL_HENDELSE') },
  { value: 'OPPFØLGINGSOPPGAVE', label: formaterVurderingsbehov('OPPFØLGINGSOPPGAVE') },
];
