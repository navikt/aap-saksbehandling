import { Radio, VStack } from '@navikt/ds-react';
import { useFormContext } from 'react-hook-form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { isAfter } from 'date-fns';
import { StudentFormFields } from 'components/behandlinger/sykdom/student/studentvurdering/StudentVurdering';
import { diagnoseSøker, ingenDiagnoseCode } from 'lib/diagnosesøker/DiagnoseSøker';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import styles from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingDiagnosesøk.module.css';
import { DiagnoserDefaultOptions } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';

interface Props {
  index: number;
  readOnly: boolean;
  diagnoseDefaultOptions: DiagnoserDefaultOptions;
}

export const StudentVurderingFelter = ({ index, readOnly, diagnoseDefaultOptions }: Props) => {
  const form = useFormContext<StudentFormFields>();

  const kodeverkValue = form.watch(`vurderinger.${index}.kodeverk`) as keyof DiagnoserDefaultOptions;
  const defaultOptionsHoveddiagnose = kodeverkValue && diagnoseDefaultOptions[kodeverkValue].hoveddiagnoserOptions;
  const defaultOptionsBidiagnose = kodeverkValue && diagnoseDefaultOptions[kodeverkValue].bidiagnoserOptions;

  return (
    <VStack gap={'4'}>
      <DateInputWrapper
        name={`vurderinger.${index}.fraDato`}
        control={form.control}
        label={'Vurderingen gjelder fra'}
        rules={{ required: 'Du må sette en dato for når vurderinger gjelder fra' }}
        readOnly={readOnly}
      />

      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={'Vurder §11-14 og vilkårene i §7 i forskriften'}
        rules={{ required: 'Du må gjøre en vilkårsvurdering' }}
        className={'begrunnelse'}
        readOnly={readOnly}
      />

      <RadioGroupWrapper
        name={`vurderinger.${index}.harAvbruttStudie`}
        control={form.control}
        label={'Har brukeren avbrutt et studie?'}
        rules={{ required: 'Du må svare på om brukeren har avbrutt studie.' }}
        readOnly={readOnly}
      >
        {JaEllerNeiOptions.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </RadioGroupWrapper>

      {form.watch(`vurderinger.${index}.harAvbruttStudie`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.godkjentStudieAvLånekassen`}
          control={form.control}
          label={'Er studiet godkjent av Lånekassen?'}
          rules={{ required: 'Du må svare på om studiet er godkjent av Lånekassen.' }}
          readOnly={readOnly}
        >
          {JaEllerNeiOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}

      {form.watch(`vurderinger.${index}.godkjentStudieAvLånekassen`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.avbruttPgaSykdomEllerSkade`}
          control={form.control}
          label={'Er studie avbrutt pga sykdom eller skade?'}
          rules={{ required: 'Du må svare på om brukeren har avbrutt studie på grunn av sykdom eller skade.' }}
          readOnly={readOnly}
        >
          {JaEllerNeiOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}

      {form.watch(`vurderinger.${index}.avbruttPgaSykdomEllerSkade`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.harBehovForBehandling`}
          control={form.control}
          label={'Har brukeren behov for behandling for å gjenoppta studiet?'}
          rules={{ required: 'Du må svare på om brukeren har behov for behandling for å gjenoppta studiet.' }}
          readOnly={readOnly}
        >
          {JaEllerNeiOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}

      {form.watch(`vurderinger.${index}.harBehovForBehandling`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.avbruddMerEnn6Måneder`}
          control={form.control}
          label={'Er det forventet at brukeren kan gjenoppta studiet innen 6 måneder?'}
          rules={{ required: 'Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.' }}
          readOnly={readOnly}
        >
          {JaEllerNeiOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}

      {form.watch(`vurderinger.${index}.avbruddMerEnn6Måneder`) === JaEllerNei.Ja && (
        <DateInputWrapper
          name={`vurderinger.${index}.avbruttDato`}
          control={form.control}
          label={'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?'}
          rules={{
            required: 'Du må svare på når studieevnen ble 100% nedsatt, eller når studiet ble avbrutt.',
            validate: (value) => {
              const valideringsresultat = validerDato(value as string);
              if (valideringsresultat) {
                return valideringsresultat;
              }

              const inputDato = parseDatoFraDatePicker(value as string);
              if (inputDato) {
                return isAfter(inputDato, new Date())
                  ? 'Dato for når stuideevnen ble 100% nedsatt / avbrutt kan ikke være frem i tid.'
                  : true;
              }
            },
          }}
          readOnly={readOnly}
        />
      )}

      {form.watch(`vurderinger.${index}.avbruddMerEnn6Måneder`) === JaEllerNei.Ja && (
        <>
          <RadioGroupWrapper
            name={`vurderinger.${index}.kodeverk`}
            control={form.control}
            label={'Velg system for diagnoser'}
            rules={{ required: 'Du må velge et system for diagnoser.' }}
            readOnly={readOnly}
            size={'small'}
            horisontal={true}
            onChangeCustom={() => {
              form.setValue(`vurderinger.${index}.hoveddiagnose`, null);
              form.setValue(`vurderinger.${index}.bidiagnose`, null);
            }}
          >
            <Radio value={'ICPC2'}>{'Primærhelsetjenesten (ICPC2)'}</Radio>
            <Radio value={'ICD10'}>{'Spesialisthelsetjenesten (ICD10)'}</Radio>
          </RadioGroupWrapper>
          {kodeverkValue != null && (
            <>
              <AsyncComboSearch
                label={'Hoveddiagnose'}
                className={styles.diagnosesokContainer}
                form={form}
                name={`vurderinger.${index}.hoveddiagnose`}
                fetcher={async (value) => (kodeverkValue ? diagnoseSøker(kodeverkValue, value) : [])}
                defaultOptions={defaultOptionsHoveddiagnose}
                rules={{ required: 'Du må velge en hoveddiagnose.' }}
                readOnly={readOnly}
              />
              {form.watch(`vurderinger.${index}.hoveddiagnose`)?.value !== ingenDiagnoseCode && (
                <AsyncComboSearch
                  label={'Bidiagnoser'}
                  className={styles.diagnosesokContainer}
                  form={form}
                  isMulti={true}
                  name={`vurderinger.${index}.bidiagnose`}
                  fetcher={async (value) => (kodeverkValue ? diagnoseSøker(kodeverkValue, value) : [])}
                  defaultOptions={defaultOptionsBidiagnose}
                  readOnly={readOnly}
                />
              )}
            </>
          )}
        </>
      )}
    </VStack>
  );
};
