import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingFelter.module.css';
import { BodyShort, HStack, Label, Radio, Tag, VStack } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { ValuePair } from 'components/form/FormField';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import React from 'react';

interface Props {
  readOnly: boolean;
  index: number;
  form: UseFormReturn<FormFieldsToTrinnsVurdering>;
}

export const TotrinnsvurderingHastemarkering = ({ readOnly, form, index }: Props) => {
  const beholdIkkeBeholdOptions: ValuePair[] = [
    { label: 'Ja, viderefør til NAY', value: JaEllerNei.Ja },
    { label: 'Nei, fjern markering', value: JaEllerNei.Nei },
  ];

  return (
    <div className={styles.totrinnsvurderingform}>
      <div className={styles.headingKvalitetssikrer}>
        <HStack align={'center'} gap={'space-8'}>
          <Tag data-color="danger" icon={<ExclamationmarkTriangleIcon />} variant={'moderate'} size={'medium'}>
            {''}
          </Tag>

          <Label>Behandlingen er hastemarkert</Label>
        </HStack>
      </div>
      <div className={styles.felter}>
        <VStack paddingBlock={'space-4'} gap={'space-4'}>
          <BodyShort weight={'semibold'}>Årsak</BodyShort>
          <BodyShort size={'small'}>{form.watch(`totrinnsvurderinger.${index}.begrunnelse`)}</BodyShort>
        </VStack>
        <RadioGroupWrapper
          label={'Skal hastemarkeringen følge behandlingen videre?'}
          control={form.control}
          name={'skalHastemarkeringFjernes'}
          readOnly={readOnly}
        >
          {beholdIkkeBeholdOptions.map((option) => (
            <Radio value={option.value} key={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      </div>
    </div>
  );
};
