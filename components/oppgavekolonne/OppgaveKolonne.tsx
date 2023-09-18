'use client';

import { Button } from '@navikt/ds-react';
import { Dokument, DokumentTabell } from 'components/DokumentTabell/DokumentTabell';
import { løsBehov } from 'lib/api';
import { useForm } from 'react-hook-form';
import { useConfigForm } from '../../hooks/FormHook';
import { FormField } from '../input/formfield/FormField';
import { VilkårsKort } from '../vilkårskort/VilkårsKort';
import { Buldings2Icon } from '@navikt/aksel-icons';

interface Props {
  className: string;
  behandlingsReferanse: string;
}

const dokumenter: Dokument[] = [
  {
    journalpostId: '123',
    dokumentId: '123',
    tittel: 'Tittel',
    åpnet: new Date(),
    erTilknyttet: false,
  },
];

interface FormFields {
  begrunnelse: string;
}

export const OppgaveKolonne = ({ className, behandlingsReferanse }: Props) => {
  const form = useForm<FormFields>();
  const { formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Løs et avklaringsbehov med begrunnelse',
    },
  });

  return (
    <div className={className}>
      <DokumentTabell dokumenter={dokumenter} onTilknyttetClick={() => {}} onVedleggClick={() => {}} />

      <VilkårsKort heading={'Avklaringsbehov'} icon={<Buldings2Icon />}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            await løsBehov({
              behandlingVersjon: 0,
              behov: {
                // @ts-ignore Feil generert type i backend
                begrunnelse: data.begrunnelse,
                // @ts-ignore Feil generert type i backend
                endretAv: '',
              },
              referanse: behandlingsReferanse,
            });
          })}
        >
          <FormField form={form} formField={formFields.begrunnelse} />
          <Button>Løs avklaringsbehov</Button>
        </form>
      </VilkårsKort>
    </div>
  );
};
