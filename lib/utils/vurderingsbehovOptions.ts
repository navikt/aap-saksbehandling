import { ValuePair } from 'components/form/FormField';
import type { Vurderingsbehov, VurderingsbehovIntern } from '../types/types';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';

export const vurderingsbehovOptions = (isRevurderingStarttidspunktEnabled: boolean): ValuePair<Vurderingsbehov>[] =>
  [
    // TODO fjerner denne inntil det er avklart om denne skal brukes { label: 'Helhetlig vurdering', value: 'HELHETLIG_VURDERING' },
    { label: '§ 22-13 syvende ledd', value: 'VURDER_RETTIGHETSPERIODE' },
    { label: 'Lovvalg og medlemskap', value: 'LOVVALG_OG_MEDLEMSKAP' },
    { label: '§ 11-14 Student', value: 'REVURDER_STUDENT' },
    { label: '§§ 11-5 og 11-6 Sykdom, arbeidsevne og behov for bistand', value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND' },
    { label: '§ 11-22 Yrkesskade', value: 'REVURDER_YRKESSKADE' },
    { label: '§ 11-13 Sykepengeerstatning', value: 'REVURDER_SYKEPENGEERSTATNING' },
    { label: '§ 11-19 Beregningstidspunkt', value: 'REVURDER_BEREGNING' },
    { label: 'Manuell inntekt', value: 'REVURDER_MANUELL_INNTEKT' },
    { label: '§ 11-2 Forutgående medlemskap', value: 'FORUTGAENDE_MEDLEMSKAP' },
    { label: '§ 11-3 Oppholdskrav', value: 'OPPHOLDSKRAV' },
    { label: '§ 11-20 Barnetillegg', value: 'BARNETILLEGG' },
    { label: 'Dødsfall barn', value: 'DØDSFALL_BARN' },
    { label: '§ 11-25 Institusjonsopphold', value: 'INSTITUSJONSOPPHOLD' },
    { label: '§§ 11-27 og 11-28 Folketrygdytelser', value: 'REVURDER_SAMORDNING_ANDRE_FOLKETRYGDYTELSER' },
    { label: '§ 11-28 Samordning med delvis uføre', value: 'REVURDER_SAMORDNING_UFØRE' },
    { label: '§ 11-10 Overstyr perioder uten overholdt meldeplikt', value: 'REVURDER_MELDEPLIKT_RIMELIG_GRUNN' },
    { label: '§ 11-15 Etablering av egen virksomhet', value: 'ETABLERING_EGEN_VIRKSOMHET' },
    { label: 'Fradrag ved andre statlige ytelser', value: 'REVURDER_SAMORDNING_ANDRE_STATLIGE_YTELSER' },
    {
      label: '§ 11-24 Reduksjon av AAP på grunn av ytelse fra arbeidsgiver',
      value: 'REVURDER_SAMORDNING_ARBEIDSGIVER',
    },
    { label: '§ 11-29 Refusjonskrav tjenestepensjonsordning', value: 'REVURDER_SAMORDNING_TJENESTEPENSJON' },
    { label: 'Dødsfall bruker', value: 'DØDSFALL_BRUKER' },
  ].filter(
    (option) => isRevurderingStarttidspunktEnabled || option.value !== 'VURDER_RETTIGHETSPERIODE'
  ) as ValuePair<Vurderingsbehov>[];

export const alleVurderingsbehovOptions: ValuePair<Vurderingsbehov | VurderingsbehovIntern>[] = [
  { value: 'SØKNAD', label: formaterVurderingsbehov('MOTTATT_SØKNAD') },
  { value: 'MOTTATT_AKTIVITETSMELDING', label: formaterVurderingsbehov('MOTTATT_AKTIVITETSMELDING') },
  { value: 'MOTTATT_MELDEKORT', label: formaterVurderingsbehov('MOTTATT_MELDEKORT') },
  { value: 'MOTTATT_LEGEERKLÆRING', label: formaterVurderingsbehov('MOTTATT_LEGEERKLÆRING') },
  { value: 'MOTTATT_AVVIST_LEGEERKLÆRING', label: formaterVurderingsbehov('MOTTATT_AVVIST_LEGEERKLÆRING') },
  { value: 'MOTTATT_DIALOGMELDING', label: formaterVurderingsbehov('MOTTATT_DIALOGMELDING') },
  { value: 'MOTATT_KLAGE', label: formaterVurderingsbehov('MOTATT_KLAGE') },
  { value: 'SØKNAD_TRUKKET', label: formaterVurderingsbehov('SØKNAD_TRUKKET') },
  { value: 'KLAGE_TRUKKET', label: formaterVurderingsbehov('KLAGE_TRUKKET') },
  { value: 'REVURDERING_AVBRUTT', label: formaterVurderingsbehov('REVURDERING_AVBRUTT') },
  { value: 'REVURDER_MEDLEMSKAP', label: formaterVurderingsbehov('REVURDER_MEDLEMSKAP') },
  { value: 'REVURDER_SAMORDNING', label: formaterVurderingsbehov('REVURDER_SAMORDNING') },
  { value: 'REVURDER_LOVVALG', label: formaterVurderingsbehov('REVURDER_LOVVALG') },
  { value: 'REVURDER_BEREGNING', label: formaterVurderingsbehov('REVURDER_BEREGNING') },
  { value: 'REVURDER_YRKESSKADE', label: formaterVurderingsbehov('REVURDER_YRKESSKADE') },
  { value: 'REVURDER_MANUELL_INNTEKT', label: formaterVurderingsbehov('REVURDER_MANUELL_INNTEKT') },
  { value: 'REVURDER_STUDENT', label: formaterVurderingsbehov('REVURDER_STUDENT') },
  { value: 'G_REGULERING', label: formaterVurderingsbehov('G_REGULERING') },
  { value: 'LOVVALG_OG_MEDLEMSKAP', label: formaterVurderingsbehov('LOVVALG_OG_MEDLEMSKAP') },
  { value: 'FORUTGAENDE_MEDLEMSKAP', label: formaterVurderingsbehov('FORUTGAENDE_MEDLEMSKAP') },
  { value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND', label: formaterVurderingsbehov('SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND') },
  { value: 'BARNETILLEGG', label: formaterVurderingsbehov('BARNETILLEGG') },
  { value: 'INSTITUSJONSOPPHOLD', label: formaterVurderingsbehov('INSTITUSJONSOPPHOLD') },
  { value: 'SAMORDNING_OG_AVREGNING', label: formaterVurderingsbehov('SAMORDNING_OG_AVREGNING') },
  { value: 'REFUSJONSKRAV', label: formaterVurderingsbehov('REFUSJONSKRAV') },
  { value: 'OVERGANG_UFORE', label: formaterVurderingsbehov('OVERGANG_UFORE') },
  { value: 'OVERGANG_ARBEID', label: formaterVurderingsbehov('OVERGANG_ARBEID') },
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
