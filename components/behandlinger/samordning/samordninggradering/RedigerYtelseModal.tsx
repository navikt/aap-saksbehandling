import { Button, HStack, Modal } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ValuePair } from 'components/form/FormField';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SamordningYtelsestype } from 'lib/types/types';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { useForm } from 'react-hook-form';
import { SamordnetYtelse } from './SamordningGradering';

export interface SamordnetYtelseFormFields {
  tom: string;
  fom: string;
  gradering?: string;
  ytelseType?: SamordningYtelsestype | undefined;
}

export const ytelsesoptions: ValuePair<SamordningYtelsestype | undefined>[] = [
  {
    value: undefined,
    label: 'Velg',
  },
  {
    value: 'SYKEPENGER',
    label: 'Sykepenger',
  },
  {
    value: 'FORELDREPENGER',
    label: 'Foreldrepenger',
  },
  {
    value: 'PLEIEPENGER',
    label: 'Pleiepenger',
  },
  {
    value: 'SVANGERSKAPSPENGER',
    label: 'Svangerskapspenger',
  },
  {
    value: 'OMSORGSPENGER',
    label: 'Omsorgspenger',
  },
  {
    value: 'OPPLÆRINGSPENGER',
    label: 'Opplæringspenger',
  },
  {
    value: 'FERIE_I_SYKEPENGEPERIODE',
    label: 'Ferie i sykepengeperiode',
  },
];

const tomRad: SamordnetYtelseFormFields = {
  ytelseType: undefined,
  fom: '',
  tom: '',
  gradering: undefined,
};

interface Props {
  initialValues?: SamordnetYtelse;
  onLagre: (verdier: SamordnetYtelseFormFields) => void;
  onLukk: () => void;
}

export const RedigerYtelseModal = ({ initialValues, onLagre, onLukk }: Props) => {
  const radForm = useForm<SamordnetYtelseFormFields>({
    defaultValues: initialValues
      ? {
          tom: initialValues?.periode.tom,
          fom: initialValues?.periode.fom,
          gradering: initialValues?.gradering?.toString(),
          ytelseType: initialValues?.ytelseType,
        }
      : tomRad,
  });
  const erFerieISykepengeperiode = radForm.watch('ytelseType') === 'FERIE_I_SYKEPENGEPERIODE';

  return (
    <Modal open onClose={onLukk} header={{ heading: initialValues ? 'Rediger periode' : 'Legg til periode' }}>
      <Modal.Body>
        <HStack gap={'space-12'}>
          <DateInputWrapper
            label="Fra og med"
            control={radForm.control}
            name={'fom'}
            rules={{
              required: 'Du må velge dato for periodestart',
              validate: {
                gyldigDato: (value) => validerDato(value),
                ikkeFoerStart: (value, formValues) =>
                  value && erDatoFoerDato(formValues.tom, value)
                    ? 'Fra og med dato kan ikke være etter til og med dato'
                    : undefined,
              },
            }}
          />
          <DateInputWrapper
            label="Til og med"
            control={radForm.control}
            name={'tom'}
            rules={{
              required: 'Du må velge dato for periodeslutt',
              validate: (value) => validerDato(value),
            }}
          />
          <SelectWrapper
            label="Ytelsestype"
            size={'small'}
            control={radForm.control}
            name={'ytelseType'}
            rules={{ required: 'Du må velge en ytelsetype' }}
          >
            {ytelsesoptions.map((ytelse, index) => (
              <option value={ytelse.value} key={index}>
                {ytelse.label}
              </option>
            ))}
          </SelectWrapper>
          {!erFerieISykepengeperiode &&
          <TextFieldWrapper
            name={'gradering'}
            label={'Samordningsgrad'}
            type={'text'}
            size={'small'}
            control={radForm.control}
            rules={{
              required: 'Du må velge samordningsgrad',
              validate: (value) => {
                if (Number.isNaN(Number(value))) {
                  return 'Prosent må angis med siffer';
                }
                if (Number(value) < 0) {
                  return 'Samordningsgrad kan ikke være mindre enn 0%';
                }
                if (Number(value) > 100) {
                  return 'Samordningsgrad kan ikke være mer enn 100%';
                }
              },
            }}
          />
          }
        </HStack>
      </Modal.Body>
      <Modal.Footer>
        <Button size={'small'} type={'button'} onClick={radForm.handleSubmit(onLagre)}>
          {initialValues ? 'Lagre endringer' : 'Legg til periode'}
        </Button>
        <Button size={'small'} type={'button'} variant={'secondary'} onClick={onLukk}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
