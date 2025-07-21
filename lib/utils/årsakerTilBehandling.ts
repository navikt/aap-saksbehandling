import { ValuePair } from '../../components/form/FormField';
import type { ÅrsakTilBehandling } from '../types/types';

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