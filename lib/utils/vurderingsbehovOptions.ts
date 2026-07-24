import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';

import { ValuePair } from 'components/form/FormField';

import type { Vurderingsbehov, VurderingsbehovIntern } from '../types/types';

export const vurderingsbehovOptions = (
  erKravEnabled: boolean,
  erAvslag11_27Enabled: boolean | undefined,
  erRevurdereFrivilligeEnabled: boolean | undefined = false
): ValuePair<Vurderingsbehov>[] => {
  const behov: Vurderingsbehov[] = (
    [
      'VURDER_RETTIGHETSPERIODE',
      'LOVVALG_OG_MEDLEMSKAP',
      'REVURDER_STUDENT',
      'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
      'OVERGANG_ARBEID',
      'OVERGANG_UFORE',
      'VURDER_FRITAK_MELDEPLIKT',
      'VURDER_ARBEIDSOPPTRAPPING',
      'FASTSETT_ARBEIDSEVNE',
      'REFUSJONSKRAV',
      'REVURDER_YRKESSKADE',
      'REVURDER_SYKEPENGEERSTATNING',
      'REVURDER_BEREGNING',
      'REVURDER_MANUELL_INNTEKT',
      'REVURDER_INNTEKTSBORTFALL',
      'FORUTGAENDE_MEDLEMSKAP',
      'OPPHOLDSKRAV',
      'BARNETILLEGG',
      'DØDSFALL_BARN',
      'INSTITUSJONSOPPHOLD',
      'INSTITUSJONSOPPHOLD_HELSEINSTITUSJON',
      'INSTITUSJONSOPPHOLD_SONING',
      'REVURDER_SAMORDNING_ANDRE_FOLKETRYGDYTELSER',
      'REVURDER_SAMORDNING_UFØRE',
      'REVURDER_MELDEPLIKT_RIMELIG_GRUNN',
      'ETABLERING_EGEN_VIRKSOMHET',
      'REVURDER_SAMORDNING_ANDRE_STATLIGE_YTELSER',
      'REVURDER_SAMORDNING_ARBEIDSGIVER',
      'REVURDER_SAMORDNING_TJENESTEPENSJON',
      'REVURDER_SYKESTIPEND',
      'DØDSFALL_BRUKER',
      'REVURDER_SAMORDNING_BARNEPENSJON',
      'VEDTAKSLENGDE_MANUELT',
      'VURDER_AVSLAG_11_27',
      'VURDER_KRAV',
    ] satisfies Vurderingsbehov[]
  ).filter(
    (option) =>
      (erKravEnabled || option !== 'VURDER_KRAV') &&
      (erAvslag11_27Enabled || option !== 'VURDER_AVSLAG_11_27') &&
      (erRevurdereFrivilligeEnabled ||
        (option !== 'VURDER_FRITAK_MELDEPLIKT' &&
          option !== 'FASTSETT_ARBEIDSEVNE' &&
          option !== 'VURDER_ARBEIDSOPPTRAPPING'))
  );

  return behov.map((behov) => ({
    value: behov,
    label: formaterVurderingsbehov(behov),
  }));
};

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
  { value: 'REVURDER_INNTEKTSBORTFALL', label: formaterVurderingsbehov('REVURDER_INNTEKTSBORTFALL') },
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
