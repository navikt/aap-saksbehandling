import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/BeslutterForm.module.css';
import { ToTrinnsvurderingError, ToTrinnsVurderingFormFields } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { Checkbox, CheckboxGroup, Radio, RadioGroup, Textarea, TextField } from '@navikt/ds-react';
import Link from 'next/link';
import { ValuePair } from 'components/input/formfield/FormField';

interface Props {
  toTrinnsvurdering: ToTrinnsVurderingFormFields;
  oppdaterVurdering: (index: number, name: keyof ToTrinnsVurderingFormFields, value: string | string[]) => void;
  link: string;
  index: number;
  errors: ToTrinnsvurderingError[];
  readOnly: boolean;
}

export const BeslutterForm = ({ toTrinnsvurdering, oppdaterVurdering, readOnly, link, index, errors }: Props) => {
  const grunnOptions: ValuePair[] = [
    { label: 'Mangelfull begrunnelse', value: 'MANGELFULL_BEGRUNNELSE' },
    { label: 'Manglende utredning', value: 'MANGLENDE_UTREDNING' },
    { label: 'Feil lovanvendelse', value: 'FEIL_LOVANVENDELSE' },
    { label: 'Annet', value: 'ANNET' },
  ];

  return (
    <div className={styles.form}>
      <Link href={link}>{mapBehovskodeTilBehovstype(toTrinnsvurdering.definisjon as Behovstype)}</Link>
      <RadioGroup
        legend={'Er du enig i vurderingen av vilkåret?'}
        onChange={(value) => oppdaterVurdering(index, 'godkjent', value)}
        size={'small'}
        hideLegend
        readOnly={readOnly}
        error={errors.find((error) => error.felt === 'godkjent')?.message}
      >
        <Radio value={'true'}>Godkjenn</Radio>
        <Radio value={'false'}>Vurdèr på nytt</Radio>
      </RadioGroup>
      {toTrinnsvurdering.godkjent === 'false' && (
        <>
          <Textarea
            label={'Begrunnelse'}
            size={'small'}
            readOnly={readOnly}
            onChange={(e) => oppdaterVurdering(index, 'begrunnelse', e.target.value)}
            error={errors.find((error) => error.felt === 'begrunnelse')?.message}
          />
          <CheckboxGroup
            legend={'Velg grunn'}
            description={'Du må minst velge èn grunn'}
            onChange={(value) => oppdaterVurdering(index, 'grunner', value)}
            size={'small'}
            readOnly={readOnly}
            error={errors.find((error) => error.felt === 'grunner')?.message}
          >
            {grunnOptions.map((option) => (
              <Checkbox value={option.value} key={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
          {toTrinnsvurdering.grunner?.find((grunn) => grunn === 'ANNET') && (
            <TextField
              label={'Beskriv returårsak'}
              size={'small'}
              readOnly={readOnly}
              onChange={(e) => oppdaterVurdering(index, 'årsakFritekst', e.target.value)}
              error={errors.find((error) => error.felt === 'årsakFritekst')?.message}
            />
          )}
        </>
      )}
    </div>
  );
};
