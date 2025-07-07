'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Alert, Label, VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { SamordningArbeidsgiverGrunnlag } from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { isBefore, parse, startOfDay } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: SamordningArbeidsgiverGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}
export interface SamordningArbeidsgiverFormFields {
  fom?: string;
  tom?: string;
  begrunnelse?: string;
}

export const SamordningArbeidsgiver = ({ readOnly, behandlingVersjon, grunnlag }: Props) => {
  const { form, formFields } = useConfigForm<SamordningArbeidsgiverFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: grunnlag.vurdering?.begrunnelse,
      },
      fom: {
        type: 'text',
        label: 'Fra dato',
        rules: { required: 'Du må velge en dato' },
        defaultValue: grunnlag.vurdering?.fom ? formaterDatoForFrontend(grunnlag.vurdering?.fom) : '',
      },
      tom: {
        type: 'text',
        label: 'Til dato',
        rules: { required: 'Du må velge en dato' },
        defaultValue: grunnlag.vurdering?.tom ? formaterDatoForFrontend(grunnlag.vurdering?.tom) : '',
      },
    },
    { readOnly: readOnly }
  );
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'SAMORDNING_ANDRE_STATLIGE_YTELSER'
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER,
          samordningArbeidsgiverVurdering: {
            vurdering: data.begrunnelse!!,
            fom: formaterDatoForBackend(parse(data.fom!!, 'dd.MM.yyyy', new Date())),
            tom: formaterDatoForBackend(parse(data.tom!!, 'dd.MM.yyyy', new Date())),
          },
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  };

  const skalViseBekreftKnapp = !readOnly;

  return (
    <VilkårsKortMedForm
      heading="Ytelser fra arbeidsgiver (sluttpakke)"
      steg="SAMORDNING_ARBEIDSGIVER"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={skalViseBekreftKnapp}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
    >
      {
        <VStack gap={'6'}>
          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
          <Label size={'small'}>Legg til start- og sluttdato for reduksjon som følge av ytelse fra arbeidsgiver</Label>
          <div style={{ display: 'flex', gap: '1.0rem', flexDirection: 'row', flexWrap: 'wrap' }}>
            <DateInputWrapper
              control={form.control}
              label={'Startdato'}
              name={`fom`}
              hideLabel={false}
              rules={{
                required: 'Du må velge når sluttpakken gjelder fra',
                validate: (value) => {
                  return validerDato(value as string);
                },
              }}
              readOnly={readOnly}
            />
            <DateInputWrapper
              control={form.control}
              label={'Sluttdato'}
              name={`tom`}
              hideLabel={false}
              rules={{
                required: 'Du må velge når sluttpakken gjelder til',
                validate: (value) => {
                  return validerDato(value as string);
                },
              }}
              readOnly={readOnly}
            />
          </div>
        </VStack>
      }
    </VilkårsKortMedForm>
  );
};
