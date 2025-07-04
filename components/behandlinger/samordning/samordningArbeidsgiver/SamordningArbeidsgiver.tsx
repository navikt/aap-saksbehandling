'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Alert, VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { SamordningArbeidsgiverGrunnlag } from 'lib/types/types';

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
        label: 'Vurder om brukeren har arbeidsgiverytelser som skal avregnes med AAP',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: grunnlag.vurdering?.begrunnelse,
      },
      fom: {
        type: 'text',
        label: 'Fra dato',
        rules: { required: 'Du må velge en dato' },
        defaultValue: grunnlag.vurdering?.fom,
      },
      tom: {
        type: 'text',
        label: 'Til dato',
        rules: { required: 'Du må velge en dato' },
        defaultValue: grunnlag.vurdering?.tom,
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
            fom: data.fom!!,
            tom: data.tom!!,
          },
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  };

  const skalViseBekreftKnapp = !readOnly;

  return (
    <VilkårsKortMedForm
      heading="Ytelser fra arbeidsgiver til avregning"
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
          <Alert variant={'info'} size={'small'} className={'fit-content'}>
            Det er ikke støtte for refusjonskrav enda. Sett saken på vent og kontakt team AAP.
          </Alert>
          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        </VStack>
      }
    </VilkårsKortMedForm>
  );
};
