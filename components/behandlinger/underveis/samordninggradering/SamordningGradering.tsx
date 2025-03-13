'use client';

import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { SamordningGraderingGrunnlag } from 'lib/types/types';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { useFieldArray } from 'react-hook-form';
import { FormEvent, useState } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Behovstype } from 'lib/utils/form';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface Formfields {
  begrunnelse: string;
  maksDatoEndelig: string;
  maksDato?: string;
  folketrygdYtelser: SamordningGraderingGrunnlag['ytelser'];
}

export const SamordningGradering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const [visForm, setVisForm] = useState<boolean>(false);
  const { form, formFields } = useConfigForm<Formfields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder utbetalingsgrad for folketrygdytelser',
      },
      maksDatoEndelig: {
        type: 'radio',
        label: 'Skal virkningstidspunkt revurderes nærmere?',
        options: [
          { label: 'Ja, virkningstidspunkt må vurderes på nytt', value: 'false' },
          { label: 'Nei, virkningstidspunkt er bekreftet', value: 'true' },
        ],
      },
      maksDato: {
        type: 'date_input',
        label: 'Sett dato for ny revurdering',
      },
      folketrygdYtelser: {
        type: 'fieldArray',
        defaultValue: grunnlag.ytelser || [],
      },
    },
    { readOnly }
  );
  const { løsBehovOgGåTilNesteSteg, status, isLoading, resetStatus } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_GRADERING');

  const { fields } = useFieldArray({
    control: form.control,
    name: 'folketrygdYtelser',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async () =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_GRADERING,
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  };

  return (
    <VilkårsKort heading="§§ 11-27 / 11-28 Samordning med andre folketrygdytelser" steg="SAMORDNING_GRADERING">
      {visForm && (
        <>
          {fields.map((ytelse) => (
            <section key={ytelse.ytelseType} style={{ marginBottom: '1rem' }}>
              <div>Ytelse: {ytelse.ytelseType}</div>
              <div>Kilde: {ytelse.kilde}</div>
              <div>Saksreferanse: {ytelse.saksRef}</div>
              <table>
                <thead>
                  <tr>
                    <th>Fra og med</th>
                    <th>Til og med</th>
                    <th>Gradering</th>
                    <th>Kronesum</th>
                  </tr>
                </thead>
                <tbody>
                  {ytelse.ytelsePerioder.map((periode) => (
                    <tr key={periode.fom}>
                      <td>{formaterDatoForVisning(periode.fom)}</td>
                      <td>{formaterDatoForVisning(periode.tom)}</td>
                      <td>{periode.gradering}</td>
                      <td>{periode.kronesum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
          <Form
            steg={'SAMORDNING_GRADERING'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            status={status}
            resetStatus={resetStatus}
          >
            <FormField form={form} formField={formFields.begrunnelse} />
            <HStack>
              <Button size={'small'} type={'button'} variant={'secondary'} icon={<PlusCircleIcon />}>
                Legg til
              </Button>
            </HStack>
            <ExpansionCard aria-label="Tidligste virkningstidspunkt etter samordning er" open>
              <ExpansionCard.Header>Tidligste virkningstidspunkt etter samordning er</ExpansionCard.Header>
              <ExpansionCard.Content>
                <FormField form={form} formField={formFields.maksDatoEndelig} />
                {form.watch('maksDatoEndelig') === 'false' && <FormField form={form} formField={formFields.maksDato} />}
              </ExpansionCard.Content>
            </ExpansionCard>
          </Form>
        </>
      )}
      {!visForm && grunnlag.ytelser.length === 0 && grunnlag.vurderinger.length === 0 && (
        <VStack gap={'2'}>
          <Detail>Vi finner ingen ytelser fra folketrygden</Detail>
          <HStack>
            <Button size={'small'} type={'button'} variant={'secondary'} onClick={() => setVisForm(true)}>
              Legg til folketrygdytelse
            </Button>
          </HStack>
        </VStack>
      )}
    </VilkårsKort>
  );
};
