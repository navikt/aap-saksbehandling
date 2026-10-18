import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering } from 'lib/types/types';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import {
  beregnEffektivTidligsteReduksjonsdatoFraSkjema,
  erReduksjonMuligForOpphold,
} from 'lib/utils/institusjonopphold';
import { useFeatureFlag } from 'context/UnleashContext';

export function useEffektivTidligsteReduksjonsdato(
  form: UseFormReturn<HelseinstitusjonsFormFields>,
  oppholdIndex: number,
  opphold: HelseinstitusjonGrunnlag['opphold'][0],
  forrigeOppholdAvsluttetDato?: string | null,
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null
) {
  const enManedsregelEnabled = useFeatureFlag('Helseinstitusjon1Manedsregel');

  const forrigeOppholdVurderinger =
    oppholdIndex > 0 ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.vurderinger`) : undefined;

  const { bruker1Månedsregelen, effektivTidligsteReduksjonsdato } = beregnEffektivTidligsteReduksjonsdatoFraSkjema({
    oppholdFra: opphold.oppholdFra,
    tidligsteReduksjonsdato: opphold.tidligsteReduksjonsdato,
    forrigeOppholdAvsluttetDato,
    forrigeOppholdVurderinger,
    forrigeOppholdVedtatteVurderinger,
    enManedsregelEnabled,
  });

  const reduksjonErMulig =
    !enManedsregelEnabled || erReduksjonMuligForOpphold(opphold.avsluttetDato, effektivTidligsteReduksjonsdato);

  return { bruker1Månedsregelen, effektivTidligsteReduksjonsdato, reduksjonErMulig, enManedsregelEnabled };
}
