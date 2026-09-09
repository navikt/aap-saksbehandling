import { Button, HStack, Modal } from '@navikt/ds-react';
import { SamordningGraderingFormfields } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ValuePair } from 'components/form/FormField';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SamordningYtelsestype } from 'lib/types/types';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { useForm } from 'react-hook-form';

export type SamordnetYtelse = SamordningGraderingFormfields['vurderteSamordninger'][number];

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

export function ytelseLabel(ytelseType: SamordningYtelsestype | undefined) {
  return ytelsesoptions.find((ytelse) => ytelse.value === ytelseType)?.label ?? '';
}

const tomRad: SamordnetYtelse = {
  ytelseType: undefined,
  periode: { fom: '', tom: '' },
  gradering: undefined,
};

interface Props {
  initialValues?: SamordnetYtelse;
  onLagre: (verdier: SamordnetYtelse) => void;
  onLukk: () => void;
}

export const RedigerYtelseModal = ({ initialValues, onLagre, onLukk }: Props) => {
  const radForm = useForm<SamordnetYtelse>({ defaultValues: initialValues ?? tomRad });

  return (
    <Modal
      open
      onClose={onLukk}
      header={{ heading: initialValues ? 'Rediger periode' : 'Legg til periode' }}
      width={'medium'}
    >
      <Modal.Body>
        <HStack align={'end'} gap={'space-4'} wrap={false}>
          <DateInputWrapper
            label="Fra og med"
            control={radForm.control}
            name={'periode.fom'}
            rules={{
              required: 'Du må velge dato for periodestart',
              validate: {
                gyldigDato: (value) => validerDato(value as string),
                ikkeFoerStart: (value, formValues) =>
                  value && erDatoFoerDato(formValues.periode.tom, value as string)
                    ? 'Fra og med dato kan ikke være etter til og med dato'
                    : undefined,
              },
            }}
          />
          <DateInputWrapper
            label="Til og med"
            control={radForm.control}
            name={'periode.tom'}
            rules={{
              required: 'Du må velge dato for periodeslutt',
              validate: (value) => validerDato(value as string),
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
          <TextFieldWrapper
            name={'gradering'}
            label={'Utbetalingsgrad'}
            type={'text'}
            size={'small'}
            control={radForm.control}
            rules={{
              required: 'Du må velge utbetalingsgrad',
              validate: (value) => {
                if (Number.isNaN(Number(value))) {
                  return 'Prosent må angis med siffer';
                }
                if (Number(value) < 0) {
                  return 'Utbetalingsgrad kan ikke være mindre enn 0%';
                }
                if (Number(value) > 100) {
                  return 'Utbetalingsgrad kan ikke være mer enn 100%';
                }
              },
            }}
          />
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
