import { useConfigForm } from 'components/form/FormHook';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import {
  Grunn,
  Vurdering11_9,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { formaterBrudd, formaterGrunn } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';
import { BruddRad } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { FormField } from 'components/form/FormField';
import { VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { parse } from 'date-fns';
import { Brudd } from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

export type Vurdering11_9FormFields = {
  begrunnelse: string;
  dato: string;
  brudd: string;
  grunn: string;
};

export const Mellomlagre11_9Skjema = ({
  valgtRad,
  lagre,
}: {
  valgtRad?: BruddRad;
  lagre: (vurdering: Vurdering11_9) => void;
  avbryt: () => void;
}) => {
  const { form, formFields } = useConfigForm<Vurdering11_9FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må skrive inn en begrunnelse' },
        defaultValue: valgtRad?.begrunnelse ?? '',
      },
      dato: {
        type: 'date_input',
        label: 'Dato for § 11-9 brudd',
        defaultValue: valgtRad?.dato && formaterDatoForFrontend(valgtRad.dato),
        rules: { required: 'Du må skrive inn dato for brudd' },
      },
      brudd: {
        type: 'radio',
        label: 'Velg årsak',
        rules: { required: 'Du må velge bruddtype' },
        defaultValue: valgtRad?.brudd ?? '',
        options: bruddValg.map((valg) => ({ label: formaterBruddValg(valg), value: valg })),
      },
      grunn: {
        type: 'radio',
        label: 'Velg grunn for § 11-9 brudd',
        rules: { required: 'Du må velge grunn' },
        defaultValue: valgtRad?.grunn ?? '',
        options: grunnValg.map((valg) => ({ label: formaterGrunn(valg), value: valg })),
      },
    },
    { shouldUnregister: true }
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      lagre({
        id: crypto.randomUUID(),
        begrunnelse: data.begrunnelse,
        dato: formaterDatoForBackend(parse(data.dato, 'dd.MM.yyyy', new Date())),
        brudd: data.brudd as Brudd,
        grunn: data.grunn as Grunn,
      });
    })(event);
  };

  return (
    <form onSubmit={onSubmit} autoComplete={'off'} id={'11-9-brudd'}>
      <VStack gap="4">
        <DateInputWrapper
          name={formFields.dato.name}
          control={form.control}
          label={formFields.dato.label}
          rules={formFields.dato.rules}
          readOnly={!!valgtRad?.dato}
        />
        <FormField form={form} formField={formFields.brudd} />
        <FormField form={form} formField={formFields.grunn} />
        <FormField form={form} formField={formFields.begrunnelse} />
      </VStack>
    </form>
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
