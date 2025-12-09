import { JaEllerNei } from 'lib/utils/form';
import { UseFormReturn } from 'react-hook-form';
import type { Sykdomsvurderinger } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';

interface Props {
  index: number;
  form: UseFormReturn<Sykdomsvurderinger>;
  readonly: boolean;
  erÅrsakssammenhengYrkesskade: boolean;
}

export const SykdomsvurderingRevurdering = ({ form, index, erÅrsakssammenhengYrkesskade, readonly }: Props) => {
  return (
    form.watch(`vurderinger.${index}.erArbeidsevnenNedsatt`) === JaEllerNei.Ja && (
      <>
        {!erÅrsakssammenhengYrkesskade && (
          <RadioGroupJaNei
            name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnFørtiProsent`}
            control={form.control}
            label={'Er arbeidsevnen nedsatt med minst 40 prosent?'}
            horisontal={true}
            rules={{
              required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 40 prosent.',
            }}
            readOnly={readonly}
          />
        )}

        {erÅrsakssammenhengYrkesskade && (
          <RadioGroupJaNei
            name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense`}
            control={form.control}
            label={'Er arbeidsevnen nedsatt med minst 30 prosent?'}
            horisontal={true}
            rules={{
              required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.',
            }}
            readOnly={readonly}
          />
        )}

        {form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnFørtiProsent`) === JaEllerNei.Ja && (
          <RadioGroupJaNei
            name={`vurderinger.${index}.erSkadeSykdomEllerLyteVesentligdel`}
            control={form.control}
            label={'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?'}
            horisontal={true}
            rules={{
              required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
            }}
            readOnly={readonly}
          />
        )}
      </>
    )
  );
};
