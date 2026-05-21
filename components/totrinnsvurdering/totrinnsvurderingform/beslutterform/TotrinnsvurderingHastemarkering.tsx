import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingFelter.module.css';
import { Checkbox, Radio } from '@navikt/ds-react';
import { ToTrinnsVurderingGrunn } from 'lib/types/types';
import { UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { ValuePair } from 'components/form/FormField';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { CheckboxWrapper } from 'components/form/checkboxwrapper/CheckboxWrapper';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import React from 'react';

interface Props {
  readOnly: boolean;
  erKvalitetssikring: boolean;
  index: number;
  form: UseFormReturn<FormFieldsToTrinnsVurdering>;
}

export const TotrinnsvurderingHastemarkering = ({ readOnly, erKvalitetssikring, form, index }: Props) => {
  const grunnOptions: ValuePair<ToTrinnsVurderingGrunn>[] = [
    { label: 'Skrivefeil', value: 'SKRIVEFEIL' },
    { label: 'For detaljerte beskrivelser', value: 'FOR_DETALJERT' },
    { label: 'Ikke individuell og konkret nok', value: 'IKKE_INDIVIDUELL_OG_KONKRET' },
    { label: 'Annen returårsak', value: 'ANNET' },
  ];

  const beholdIkkeBeholdOptions: ValuePair[] = [
    { label: 'Ja, behold hastemarkeringen', value: JaEllerNei.Ja },
    { label: 'Nei, fjern hastemarkeringen', value: JaEllerNei.Nei },
  ];

  const vurderingErIkkeGodkjent = form.watch(`totrinnsvurderinger.${index}.godkjent`) === JaEllerNei.Nei;
  const annetGrunnErValgt =
    form.watch(`totrinnsvurderinger.${index}.grunner`) &&
    form.watch(`totrinnsvurderinger.${index}.grunner`)?.includes('ANNET');

  return (
    <div className={styles.totrinnsvurderingform}>
      <div
        className={`${styles.heading} ${erKvalitetssikring ? styles.headingKvalitetssikrer : styles.headingBeslutter}`}
      >
        <ExclamationmarkTriangleIcon /> <b>Behandlingen er hastemarkert</b>
      </div>
      <div className={styles.felter}>
        <RadioGroupWrapper
          label={'Skal hastemarkeringen følge behandlingen videre?'}
          control={form.control}
          name={`totrinnsvurderinger.${index}.godkjent`}
          readOnly={readOnly}
        >
          {beholdIkkeBeholdOptions.map((option) => (
            <Radio value={option.value} key={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>

        {vurderingErIkkeGodkjent && (
          <>
            <TextAreaWrapper
              label={'Beskriv returårsak'}
              readOnly={readOnly}
              control={form.control}
              name={`totrinnsvurderinger.${index}.begrunnelse`}
              rules={{
                required: 'Du må skrive en grunn for retur',
                validate: {
                  ikkeKunWhitespace: (value) =>
                    value && (value as string).trim().length === 0
                      ? 'Begrunnelse kan ikke være tom eller kun inneholde mellomrom'
                      : true,
                },
              }}
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
              <TextAreaWrapper
                label={'Annen returårsak'}
                description={'Kort beskrivelse (maks 50 tegn)'}
                readOnly={readOnly}
                control={form.control}
                maxLength={50}
                name={`totrinnsvurderinger.${index}.årsakFritekst`}
                rules={{
                  required: 'Annen returårsak må fylles ut',
                  maxLength: {
                    value: 50,
                    message: 'Kan bestå av maks 50 tegn. Utfyllende begrunnelse skal i feltet over.',
                  },
                }}
              />
            )}{' '}
          </>
        )}
      </div>
    </div>
  );
};
