import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingFelter.module.css';
import { Checkbox, Radio } from '@navikt/ds-react';
import Link from 'next/link';
import { ToTrinnsVurderingGrunn } from 'lib/types/types';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { ValuePair } from 'components/form/FormField';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { CheckboxWrapper } from 'components/form/checkboxwrapper/CheckboxWrapper';

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
    { label: 'Mangler i utredning før vilkårsvurderingen', value: 'MANGLENDE_UTREDNING' },
    { label: 'Mangler i vilkårsvurderingen', value: 'MANGELFULL_BEGRUNNELSE' },
    { label: 'Feil resultat i vedtaket', value: 'FEIL_LOVANVENDELSE' },
    { label: 'Annen returgrunn', value: 'ANNET' },
  ];

  const vurderingErIkkeGodkjent = form.watch(`totrinnsvurderinger.${index}.godkjent`) === 'false';
  const annetGrunnErValgt =
    form.watch(`totrinnsvurderinger.${index}.grunner`) &&
    form.watch(`totrinnsvurderinger.${index}.grunner`)?.includes('ANNET');

  return (
    <div className={styles.totrinnsvurderingform}>
      <div
        className={`${styles.heading} ${erKvalitetssikring ? styles.headingKvalitetssikrer : styles.headingBeslutter}`}
      >
        <Link href={link}>{mapBehovskodeTilBehovstype(field.definisjon as Behovstype)}</Link>
      </div>
      <div className={styles.felter}>
        <RadioGroupWrapper
          label={'Godkjenner du vilkårsvurderingen?'}
          control={form.control}
          name={`totrinnsvurderinger.${index}.godkjent`}
          readOnly={readOnly}
        >
          <Radio value={'true'}>Ja</Radio>
          <Radio value={'false'}>Nei</Radio>
        </RadioGroupWrapper>

        {vurderingErIkkeGodkjent && (
          <>
            <TextAreaWrapper
              label={'Beskriv returårsak'}
              readOnly={readOnly}
              control={form.control}
              name={`totrinnsvurderinger.${index}.begrunnelse`}
              rules={{ required: 'Du må gi en begrunnelse' }}
              className={'begrunnelse'}
            />
            <CheckboxWrapper
              label={'Returårsak'}
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
                label={'Annen returgrunn'}
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
