import { Button, Dialog, HStack, VStack } from '@navikt/ds-react';
import { FormField } from 'components/form/FormField';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { useConfigForm } from 'components/form/FormHook';
import { RelevantInformasjonSamordningGradering } from 'components/behandlinger/samordning/samordninggradering/RelevantInformasjonSamordningGradering';
import { SamordningGraderingGrunnlag } from 'lib/types/types';
import { Alert } from 'components/alert/Alert';

interface Props {
  initialValues?: FerieFormFields;
  grunnlag: SamordningGraderingGrunnlag;
  onLagre: (verdier: FerieFormFields) => void;
  onLukk: () => void;
}

export interface FerieFormFields {
  fom: string;
  tom: string;
}

/**
 * Ferie i sykepengeperiode kan kun opprettes/redigeres gjennom denne modalen, siden lagring
 * trigger en omberegning (splitting) av sykepengeperiodene rundt ferieperioden.
 */
export const FerieISykepengeperiodeModal = ({ initialValues, onLagre, onLukk, grunnlag }: Props) => {
  const defaultValues = {
    fom: initialValues?.fom || '',
    tom: initialValues?.tom || '',
  };

  const { form, formFields } = useConfigForm<FerieFormFields>({
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
  });

  return (
    <Dialog open onOpenChange={onLukk} size={'medium'}>
      <Dialog.Popup width={'large'}>
        <Dialog.Header>
          <Dialog.Title>
            {initialValues ? 'Rediger ferie i sykepengeperiode' : 'Legg til ferie i sykepengeperiode'}
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap={'space-16'}>
            <RelevantInformasjonSamordningGradering grunnlag={grunnlag} />
            <HStack gap={'space-12'} align={'start'}>
              <FormField form={form} formField={formFields.fom} />
              <FormField form={form} formField={formFields.tom} />
            </HStack>
            <Alert variant={'info'}>
              Ferie fra sykepenger splitter opp eventuell sykepengeperiode i samme tidsrom.
            </Alert>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type={'button'} onClick={form.handleSubmit(onLagre)}>
            {initialValues ? 'Lagre endringer' : 'Legg til periode'}
          </Button>
          <Dialog.CloseTrigger>
            <Button type={'button'} variant={'secondary'}>
              Avbryt
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
