import { Behovstype, JaEllerNei, mapBehovskodeTilBehovstype } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingFelter.module.css';
import { Checkbox, Radio } from '@navikt/ds-react';
import Link from 'next/link';
import { ToTrinnsVurderingGrunn } from 'lib/types/types';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { ValuePair } from 'components/form/FormField';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
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

export const TotrinnsvurderingVedtaksbrevFelter = ({
  readOnly,
  link,
  erKvalitetssikring,
  form,
  index,
  field,
}: Props) => {
  const grunnOptions: ValuePair<ToTrinnsVurderingGrunn>[] = [
    { label: 'Skrivefeil', value: 'SKRIVEFEIL' },
    { label: 'For detaljerte beskrivelser', value: 'FOR_DETALJERT' },
    { label: 'Ikke individuell og konkret nok', value: 'IKKE_INDIVIDUELL_OG_KONKRET' },
  ];

  const vurderingErIkkeGodkjent = form.watch(`totrinnsvurderinger.${index}.godkjent`) === JaEllerNei.Nei;

  return (
    <div className={styles.totrinnsvurderingform}>
      <div
        className={`${styles.heading} ${erKvalitetssikring ? styles.headingKvalitetssikrer : styles.headingBeslutter}`}
      >
        <Link href={link}>{mapBehovskodeTilBehovstype(field.definisjon as Behovstype)}</Link>
      </div>
      <div className={styles.felter}>
        <RadioGroupWrapper
          label={'Godkjenner du begrunnelsen?'}
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
              rules={{ required: 'Du må skrive en grunn for retur' }}
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
          </>
        )}
      </div>
    </div>
  );
};
