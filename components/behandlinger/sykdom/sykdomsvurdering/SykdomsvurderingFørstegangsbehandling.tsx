import { Alert } from '@navikt/ds-react';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { FormFields } from 'components/form/FormHook';
import { JaEllerNei } from 'lib/utils/form';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormField } from 'components/form/FormField';
import type { Sykdomsvurderinger } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { Periode } from 'lib/types/types';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';

interface Props {
  index: number;
  form: UseFormReturn<Sykdomsvurderinger>;
  readonly: boolean;
  ikkeRelevantePerioder?: Periode[];
  skalVurdereYrkesskade: boolean;
}

export const SykdomsvurderingFørstegangsbehandling = ({ form, skalVurdereYrkesskade, index, readonly }: Props) => {
  return (
    <>
      {form.watch(`vurderinger.${index}.erArbeidsevnenNedsatt`) === JaEllerNei.Nei && (
        <Alert variant={'info'} size={'small'} className={'fit-content'}>
          Brukeren vil få vedtak om at de ikke har rett på AAP. De kvalifiserer ikke for sykepengeerstatning.
        </Alert>
      )}

      {form.watch(`vurderinger.${index}.erArbeidsevnenNedsatt`) === JaEllerNei.Ja && (
        <>
          <RadioGroupJaNei
            name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`}
            control={form.control}
            label={'Er arbeidsevnen nedsatt med minst halvparten?'}
            horisontal={true}
            rules={{ required: 'Du må svare på om arbeidsevnen er nedsatt med minst halvparten' }}
            readOnly={readonly}
          />

          {skalVurdereYrkesskade &&
            form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`) === JaEllerNei.Nei && (
              <>
                <TextAreaWrapper
                  name={`vurderinger.${index}.yrkesskadeBegrunnelse`}
                  control={form.control}
                  label={'§ 11-22 AAP ved yrkesskade'}
                  description={
                    'Brukeren har en yrkesskade som kan ha betydning for retten til AAP. Du må derfor vurdere om arbeidsevnen er nedsatt med minst 30 prosent. NAY vil vurdere om arbeidsevnen er nedsatt på grunn av yrkesskaden.'
                  }
                  rules={{
                    required: 'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30 prosent',
                  }}
                  className={'begrunnelse'}
                  readOnly={readonly}
                />

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
              </>
            )}

          {(form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`) === JaEllerNei.Ja ||
            (form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`) === JaEllerNei.Nei &&
              form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense`) === JaEllerNei.Ja &&
              skalVurdereYrkesskade)) && (
            <>
              <RadioGroupJaNei
                name={`vurderinger.${index}.erSkadeSykdomEllerLyteVesentligdel`}
                control={form.control}
                label={'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?'}
                horisontal={true}
                rules={{
                  required:
                    'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
                }}
                readOnly={readonly}
              />

              {form.watch(`vurderinger.${index}.erSkadeSykdomEllerLyteVesentligdel`) === JaEllerNei.Ja && (
                <RadioGroupJaNei
                  name={`vurderinger.${index}.erNedsettelseIArbeidsevneAvEnVissVarighet`}
                  control={form.control}
                  label={'Er den nedsatte arbeidsevnen av en viss varighet?'}
                  horisontal={true}
                  rules={{
                    required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet',
                  }}
                  readOnly={readonly}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
