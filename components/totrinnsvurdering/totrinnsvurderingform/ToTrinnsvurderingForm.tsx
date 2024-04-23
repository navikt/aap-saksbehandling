'use client';

import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/ToTrinnsvurderingForm.module.css';
import { ToTrinnsVurderingFormFields, ToTrinnsvurderingError } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { Checkbox, CheckboxGroup, Link, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { Veiledning } from 'components/veiledning/Veiledning';

interface Props {
  toTrinnsvurdering: ToTrinnsVurderingFormFields;
  oppdaterVurdering: (index: number, name: keyof ToTrinnsVurderingFormFields, value: any) => void;
  link: string;
  index: number;
  errors: ToTrinnsvurderingError[];
  readOnly: boolean;
}

export const ToTrinnsvurderingForm = ({
  toTrinnsvurdering,
  oppdaterVurdering,
  readOnly,
  link,
  index,
  errors,
}: Props) => {
  const grunnOptions = [
    'Mangelfull begrunnelse',
    'Manglende utredning',
    'Feil lovanvendelse',
    'Annet (Skriv i begrunnelsen)',
  ];

  return (
    <div className={styles.form}>
      <Link href={link}>{mapBehovskodeTilBehovstype(toTrinnsvurdering.definisjon as Behovstype)}</Link>
      <RadioGroup
        legend={'Er du enig?'}
        onChange={(value) => oppdaterVurdering(index, 'godkjent', value)}
        size={'small'}
        readOnly={readOnly}
        error={errors.find((error) => error.felt === 'godkjent')?.message}
      >
        <Radio value={'true'}>Ja</Radio>
        <Radio value={'false'}>Nei</Radio>
      </RadioGroup>
      {toTrinnsvurdering.godkjent === 'false' && (
        <>
          <Veiledning
            header={'Overskrift'}
            tekst={veiledningsTekstPåDefinisjon(toTrinnsvurdering.definisjon as Behovstype)}
            defaultOpen={!readOnly}
          />
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
            onChange={(value) => oppdaterVurdering(index, 'grunn', value)}
            size={'small'}
            readOnly={readOnly}
            error={errors.find((error) => error.felt === 'grunn')?.message}
          >
            {grunnOptions.map((value) => (
              <Checkbox value={value} key={value}>
                {value}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </>
      )}
    </div>
  );
};

function veiledningsTekstPåDefinisjon(definisjon: Behovstype): string {
  if (definisjon === '5003') {
    return 'Husk at du som beslutter ikke skal overprøve skjønnet knyttet til nedsatt arbeidsevne';
  } else if (definisjon === '5006') {
    return 'Husk at du som beslutter ikke skal overprøve skjønnet knyttet til bistandsbehovet';
  } else {
    return 'Her kommer noe veildeningstekst';
  }
}
