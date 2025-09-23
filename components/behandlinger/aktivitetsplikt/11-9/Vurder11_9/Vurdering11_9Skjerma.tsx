import styles from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/rimeliggrunn.module.css';
import { Heading, Radio, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { Control, FieldArrayWithId } from 'react-hook-form';
import { Vurdering11_9FormFields } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Brudd, Grunn } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { formaterBrudd, formaterGrunn } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

type Props = {
  control: Control<Vurdering11_9FormFields, any, any>;
  index: number;
  field: FieldArrayWithId<Vurdering11_9FormFields>;
  readOnly: boolean;
};

export const Vurdering11_9Skjema = ({ index, control, readOnly }: Props, key?: React.Key) => {
  return (
    <section key={key} className={styles.skjemaContainer}>
      <Heading size={'small'} level="3">
        Oppdater brudd på aktivitetsplikten
      </Heading>
      <VStack gap={'6'} style={{ marginTop: '1rem' }}>
        <TextAreaWrapper
          name={`vurderinger.${index}.begrunnelse`}
          label="Begrunnelse"
          control={control}
          size="small"
          rules={{ required: 'Du må skrive inn en begrunnelse' }}
          readOnly={readOnly}
        />
        <RadioGroupWrapper
          label={'Velg årsak'}
          name={`vurderinger.${index}.brudd`}
          control={control}
          readOnly={readOnly}
        >
          {bruddValg.map((valg) => (
            <Radio key={valg} value={valg}>
              {formaterBruddValg(valg)}
            </Radio>
          ))}
        </RadioGroupWrapper>
        <RadioGroupWrapper
          label={'Velg grunn for § 11-9 brudd'}
          name={`vurderinger.${index}.grunn`}
          control={control}
          readOnly={readOnly}
        >
          {grunnValg.map((valg) => (
            <Radio key={valg} value={valg}>
              {formaterGrunn(valg)}
            </Radio>
          ))}
        </RadioGroupWrapper>
        <DateInputWrapper
          name={`vurderinger.${index}.dato`}
          label="Dato for § 11-9 brudd"
          control={control}
          readOnly={readOnly}
        />
      </VStack>
    </section>
  );
};

function formaterBruddValg(brudd: Brudd): string {
  return `§ 11-9 ${formaterBrudd(brudd)}`;
}

const bruddValg: Brudd[] = [
  'IKKE_MØTT_TIL_TILTAK',
  'IKKE_MØTT_TIL_BEHANDLING',
  'IKKE_MØTT_TIL_MØTE',
  'IKKE_SENDT_DOKUMENTASJON',
];

const grunnValg: Grunn[] = ['IKKE_RIMELIG_GRUNN', 'RIMELIG_GRUNN'];
