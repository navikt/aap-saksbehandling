'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { KansellertRevurderingGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: KansellertRevurderingGrunnlag;
}

interface FormFields {
  aarsak?:
    | 'FEILREGISTRERING'
    | 'START_REVURDERING_PAA_NYTT';
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
          { value: 'FEILREGISTRERING', label: 'Feilregistrering' },
          { value: 'START_REVURDERING_PAA_NYTT', label: 'Start revurdering på nytt' },
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
    <VilkårskortMedForm
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
    </VilkårskortMedForm>
  );
};
