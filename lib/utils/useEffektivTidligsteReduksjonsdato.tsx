import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { beregnReduksjonskjede, grupperVedtattePerOppholdId } from 'lib/utils/institusjonopphold';
import { useFeatureFlag } from 'context/UnleashContext';

export function useEffektivTidligsteReduksjonsdato(
  form: UseFormReturn<HelseinstitusjonsFormFields>,
  oppholdIndex: number,
  vedtatteVurderinger: HelseinstitusjonGrunnlag['vedtatteVurderinger']
) {
  const enManedsregelEnabled = useFeatureFlag('Helseinstitusjon1Manedsregel');
  const alleOpphold = form.watch('helseinstitusjonsvurderinger');

  const kjede = beregnReduksjonskjede(
    alleOpphold,
    grupperVedtattePerOppholdId(vedtatteVurderinger),
    enManedsregelEnabled,
    oppholdIndex
  );

  return { ...kjede[oppholdIndex], enManedsregelEnabled };
}
