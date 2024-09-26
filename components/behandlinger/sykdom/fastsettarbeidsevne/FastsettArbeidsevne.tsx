'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormEvent } from 'react';
import { FastsettArbeidsevnePeriodetabell } from 'components/behandlinger/sykdom/fastsettarbeidsevne/fastsettarbeidsevneperiodetabell/FastsettArbeidsevnePeriodetabell';

import styles from './FastsettArbeidsevne.module.css';
import { PercentIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Veiledning } from 'components/veiledning/Veiledning';
import { Button } from '@navikt/ds-react';
import { useFieldArray } from 'react-hook-form';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export type FastsettArbeidsevnePeriode = {
  arbeidsevne: string;
  enhet?: 'PROSENT' | 'TIMER';
  fom: string;
  tom: string;
};

export type FastsettArbeidsevneFormFields = {
  begrunnelse: string;
  perioder: FastsettArbeidsevnePeriode[];
};

export const FastsettArbeidsevne = ({ readOnly }: Props) => {
  // const behandlingsReferanse = useBehandlingsReferanse();
  const { form, formFields } = useConfigForm<FastsettArbeidsevneFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om innbygger har arbeidsevne',
      description: 'Hvis ikke annet er oppgitt, så antas innbygger å ha 0% arbeidsevne og rett på full ytelse',
      rules: { required: 'Du må begrunne vurderingen' },
    },
    perioder: {
      type: 'fieldArray',
      defaultValue: [{ arbeidsevne: '', enhet: undefined, fom: '', tom: '' }],
    },
  });
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('FASTSETT_ARBEIDSEVNE');
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'perioder' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // må implementeres når backend er klar
    form.handleSubmit((data) => {
      console.log(data);
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Reduksjon av maks utbetalt ytelse ved delvis nedsatt arbeidsevne § 11-23 2.ledd (valgfritt)'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      defaultOpen={false}
      icon={<PercentIcon />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FASTSETT_ARBEIDSEVNE'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <Veiledning header={'Slik vurderes dette'} tekst={<span>Her trengs det en tekst</span>} defaultOpen={false} />
        <div className={styles.fastsettArbeidsevne}>
          <FastsettArbeidsevnePeriodetabell fields={fields} form={form} readOnly={readOnly} remove={remove} />
        </div>
        {!readOnly && (
          <div>
            <Button
              variant={'tertiary'}
              type={'button'}
              icon={<PlusCircleIcon />}
              onClick={() => append({ arbeidsevne: '', fom: '', tom: '', enhet: undefined })}
            >
              Legg til periode
            </Button>
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
