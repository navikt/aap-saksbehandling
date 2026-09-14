import { Button, Dialog, HStack } from '@navikt/ds-react';
import { FormField, ValuePair } from 'components/form/FormField';
import { SamordningYtelsestype } from 'lib/types/types';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { SamordnetYtelse } from './SamordningGradering';
import { useConfigForm } from 'components/form/FormHook';

interface Props {
  initialValues?: SamordnetYtelse;
  onLagre: (verdier: SamordnetYtelseFormFields) => void;
  onLukk: () => void;
}

export interface SamordnetYtelseFormFields {
  tom: string;
  fom: string;
  gradering?: string;
  ytelseType?: SamordningYtelsestype | undefined;
}

export const RedigerYtelseModal = ({ initialValues, onLagre, onLukk }: Props) => {
  const defaultValues = {
    tom: initialValues?.periode.tom || '',
    fom: initialValues?.periode.fom || '',
    gradering: initialValues?.gradering?.toString() || undefined,
    ytelseType: initialValues?.ytelseType || undefined,
  };

  const { form, formFields } = useConfigForm<SamordnetYtelseFormFields>(
    {
      fom: {
        type: 'date_input',
        label: 'Fra og med',
        defaultValue: defaultValues.fom,
        rules: {
          required: 'Du må velge dato for periodestart',
          validate: {
            gyldigDato: (value) => validerDato(value),
            ikkeFoerStart: (value, formValues) =>
              value && erDatoFoerDato(formValues.tom, value)
                ? 'Fra og med dato kan ikke være etter til og med dato'
                : undefined,
          },
        },
      },
      tom: {
        type: 'date_input',
        label: 'Til og med',
        defaultValue: defaultValues.tom,
        rules: {
          required: 'Du må velge dato for periodeslutt',
          validate: (value) => validerDato(value),
        },
      },
      ytelseType: {
        type: 'select',
        label: 'Ytelsestype',
        defaultValue: defaultValues.ytelseType,
        rules: { required: 'Du må velge en ytelsetype' },
        options: ytelsesoptions,
      },
      gradering: {
        type: 'text',
        label: 'Samordningsgrad',
        defaultValue: defaultValues.gradering,
        rules: {
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
        },
      },
    },
    { shouldUnregister: true }
  );

  const erFerieISykepengeperiode = form.watch('ytelseType') === 'FERIE_I_SYKEPENGEPERIODE';

  return (
    <Dialog open onOpenChange={onLukk} size={'medium'}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>{initialValues ? 'Rediger periode' : 'Legg til periode'}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <HStack gap={'space-12'} wrap={false}>
            <FormField form={form} formField={formFields.fom} />
            <FormField form={form} formField={formFields.tom} />
            <FormField form={form} formField={formFields.ytelseType} />
            {!erFerieISykepengeperiode && <FormField form={form} formField={formFields.gradering} />}
          </HStack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button size={'small'} type={'button'} onClick={form.handleSubmit(onLagre)}>
            {initialValues ? 'Lagre endringer' : 'Legg til periode'}
          </Button>
          <Dialog.CloseTrigger>
            <Button size={'small'} type={'button'} variant={'secondary'}>
              Avbryt
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};

export const ytelsesoptions: ValuePair<SamordningYtelsestype | string>[] = [
  {
    value: '',
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
