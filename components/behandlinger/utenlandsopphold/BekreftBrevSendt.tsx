'use client';

import { BodyShort } from '@navikt/ds-react';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedForm } from 'components/vilkaarskort/vilkårskortmedform/VilkårskortMedForm';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { SøknadUtenlandsoppholdGrunnlagResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { SubmitEventHandler } from 'react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: SøknadUtenlandsoppholdGrunnlagResponse;
}

interface FormFields {
  brevSendt: string[];
}

const BREV_SENDT = 'BREV_SENDT';

export const BekreftBrevSendt = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('BEKREFT_BREV_SENDT');
  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'BEKREFT_BREV_SENDT',
    undefined
  );

  const bekreftelse = grunnlag.bekreftelse;
  const { form, formFields } = useConfigForm<FormFields>(
    {
      brevSendt: {
        type: 'checkbox',
        label: 'Bekreftelse',
        hideLabel: true,
        options: [{ label: 'Jeg bekrefter at brev om vedtaket er sendt til bruker', value: BREV_SENDT }],
        rules: { required: 'Du må bekrefte at brevet er sendt før behandlingen kan avsluttes.' },
        defaultValue: bekreftelse ? [BREV_SENDT] : [],
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
            behovstype: Behovstype.BEKREFT_BREV_SENDT_MANUELT_KODE,
            bekreftelse: { brevSendt: data.brevSendt.includes(BREV_SENDT) },
          },
          referanse: behandlingsreferanse,
        },
        () => visningActions.onBekreftClick()
      );
    })(event);
  };

  return (
    <VilkårskortMedForm
      heading="Bekreft at brev er sendt"
      steg="BEKREFT_BREV_SENDT"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      isLoading={løsAvklaringsbehovIsLoading}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset()}
      knappTekst="Bekreft og avslutt"
      vurdertAvAnsatt={bekreftelse?.vurderingerMeta.vurdertAv}
    >
      <BodyShort>
        Brevet sendes manuelt. Behandlingen kan ikke avsluttes før du har bekreftet at brevet er sendt.
      </BodyShort>
      <FormField form={form} formField={formFields.brevSendt} />
    </VilkårskortMedForm>
  );
};
