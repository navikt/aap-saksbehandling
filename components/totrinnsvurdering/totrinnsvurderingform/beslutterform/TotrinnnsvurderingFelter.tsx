import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingFelter.module.css';
import { Checkbox, Radio, RadioGroup } from '@navikt/ds-react';
import Link from 'next/link';
import {
  CheckboxWrapper,
  RadioGroupWrapper,
  TextAreaWrapper,
  TextFieldWrapper,
  ValuePair,
} from '@navikt/aap-felles-react';
import { ToTrinnsVurderingGrunn } from 'lib/types/types';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';

interface Props {
  link: string;
  readOnly: boolean;
  erKvalitetssikring: boolean;
  index: number;
  form: UseFormReturn<FormFieldsToTrinnsVurdering>;
  field: FieldArrayWithId<FormFieldsToTrinnsVurdering, 'totrinnsvurderinger'>;
}

export const TotrinnnsvurderingFelter = ({ readOnly, link, erKvalitetssikring, form, index, field }: Props) => {
  const grunnOptions: ValuePair<ToTrinnsVurderingGrunn>[] = [
    { label: 'Mangelfull begrunnelse', value: 'MANGELFULL_BEGRUNNELSE' },
    { label: 'Manglende utredning', value: 'MANGLENDE_UTREDNING' },
    { label: 'Feil lovanvendelse', value: 'FEIL_LOVANVENDELSE' },
    { label: 'Annet', value: 'ANNET' },
  ];

  const vurderingErIkkeGodkjent = form.watch(`totrinnsvurderinger.${index}.godkjent`) === 'false';
  const annetGrunnErValgt =
    form.watch(`totrinnsvurderinger.${index}.grunner`) &&
    form.watch(`totrinnsvurderinger.${index}.grunner`)?.includes('ANNET');

  return (
    <div className={styles.beslutterform}>
      <div
        className={`${styles.heading} ${erKvalitetssikring ? styles.headingKvalitetssikrer : styles.headingBeslutter}`}
      >
        <Link href={link}>{mapBehovskodeTilBehovstype(field.definisjon as Behovstype)}</Link>
      </div>
      <div className={styles.felter}>
        <RadioGroupWrapper
          label={'Er du enig i vurderingen av vilkåret?'}
          control={form.control}
          name={`totrinnsvurderinger.${index}.godkjent`}
          readOnly={readOnly}
        >
          <Radio value={'true'}>Godkjenn</Radio>
          <Radio value={'false'}>Send tilbake</Radio>
        </RadioGroupWrapper>

        {vurderingErIkkeGodkjent && (
          <>
            <TextAreaWrapper
              label={'Begrunnelse'}
              readOnly={readOnly}
              control={form.control}
              name={`totrinnsvurderinger.${index}.begrunnelse`}
              rules={{ required: 'Du må gi en begrunnelse' }}
            />
            <CheckboxWrapper
              label={'Velg grunn'}
              description={'Du må minst velge èn grunn'}
              readOnly={readOnly}
              control={form.control}
              name={`totrinnsvurderinger.${index}.grunner`}
              rules={{ required: 'Du må oppgi en grunn' }}
            >
              {grunnOptions.map((option) => (
                <Checkbox value={option.value} key={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxWrapper>

            {annetGrunnErValgt && (
              <TextFieldWrapper
                label={'Beskriv returårsak'}
                readOnly={readOnly}
                control={form.control}
                name={`totrinnsvurderinger.${index}.årsakFritekst`}
                type={'text'}
                rules={{ required: 'Du må skrive en grunn' }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
