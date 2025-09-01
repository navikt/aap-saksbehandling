'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { KansellertRevurderingGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: KansellertRevurderingGrunnlag;
}

interface FormFields {
  aarsak?:
    | 'REVURDERING_ER_IKKE_LENGER_AKTUELL'
    | 'REVURDERINGEN_ER_FEILREGISTRERT'
    | 'REVURDERINGEN_ER_AVBRUTT_PÅ_GRUNN_AV_FEIL'
    | 'ANNET';
  begrunnelse: string;
}

export const KansellerRevurderingVurdering = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KANSELLER_REVURDERING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      aarsak: {
        type: 'combobox',
        label: 'Hva er årsaken til kansellering?',
        options: [
          { value: 'REVURDERING_ER_IKKE_LENGER_AKTUELL', label: 'Revurdering er ikke lenger aktuell' },
          { value: 'REVURDERINGEN_ER_FEILREGISTRERT', label: 'Revurderingen er feilregistrert' },
          { value: 'REVURDERINGEN_ER_AVBRUTT_PÅ_GRUNN_AV_FEIL', label: 'Revurdering er avbrutt på grunn av feil' },
          { value: 'ANNET', label: 'Annet' },
        ],
        defaultValue: grunnlag?.vurdering?.årsak ?? undefined,
        rules: {
          required: 'Velg årsak til kansellering av revurdering',
        },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse (obligatorisk)',
        description: 'Utdyp hvorfor revurderingen kanselleres',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må begrunne hvorfor revurdering kanselleres' },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.KANSELLER_REVURDERING_KODE,
          vurdering: {
            begrunnelse: data.begrunnelse,
            årsak: data.aarsak,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Kanseller revurdering'}
      steg={'KANSELLER_REVURDERING'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
    >
      <FormField form={form} formField={formFields.aarsak} className="årsak" />
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
    </VilkårsKortMedForm>
  );
};
