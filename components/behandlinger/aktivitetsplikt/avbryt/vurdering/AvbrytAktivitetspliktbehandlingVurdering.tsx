'use client';

import { AvbrytAktivitetspliktbehandlingGrunnlag } from 'lib/types/types';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useConfigForm } from 'components/form/FormHook';
import { SubmitEventHandler } from 'react';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { FormField } from 'components/form/FormField';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: AvbrytAktivitetspliktbehandlingGrunnlag;
}

interface FormFields {
  aarsak?: 'BEHANDLINGEN_BLE_OPPRETTET_VED_EN_FEIL' | 'DET_HAR_OPPSTAATT_EN_FEIL_OG_BEHANDLINGEN_MAA_STARTES_PAA_NYTT';
  begrunnelse: string;
}

export const AvbrytAktivitetspliktbehandlingVurdering = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('AVBRYT_AKTIVITETSPLIKTBEHANDLING');

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVBRYT_AKTIVITETSPLIKTBEHANDLING',
    undefined
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      aarsak: {
        type: 'combobox',
        label: 'Hva er årsaken til at behandlingen skal avbrytes?',
        options: [
          { value: 'BEHANDLINGEN_BLE_OPPRETTET_VED_EN_FEIL', label: 'Behandlingen ble opprettet ved en feil' },
          {
            value: 'DET_HAR_OPPSTAATT_EN_FEIL_OG_BEHANDLINGEN_MAA_STARTES_PAA_NYTT',
            label: 'Det har oppstått en feil og behandlingen må startes på nytt',
          },
        ],
        defaultValue: grunnlag?.vurdering?.årsak ?? undefined,
        rules: {
          required: 'Velg en årsak for å avbryte behandlingen',
        },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse (obligatorisk)',
        description: 'Utdyp hvorfor behandlingen avbrytes',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må begrunne hvorfor behandlingen avbrytes' },
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsAvklaringsbehov(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVBRYT_AKTIVITETSPLIKTBEHANDLING,
            vurdering: {
              begrunnelse: data.begrunnelse,
              årsak: data.aarsak,
            },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          loggUmamiVarighet('STEG_AVBRYT_AKTIVITETSPLIKTBEHANDLING_VARIGHET', umamiStartTidspunkt, Date.now());
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedForm
      heading={'Avbryt behandling'}
      steg={'AVBRYT_AKTIVITETSPLIKTBEHANDLING'}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      isLoading={løsAvklaringsbehovIsLoading}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      vilkårTilhørerNavKontor={true}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset()}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurderingerMeta.vurdertAv}
    >
      <FormField form={form} formField={formFields.aarsak} className="årsak" />
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
    </VilkårskortMedForm>
  );
};
