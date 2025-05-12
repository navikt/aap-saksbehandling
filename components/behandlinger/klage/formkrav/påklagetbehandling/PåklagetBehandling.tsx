'use client';

import { Behovstype } from '../../../../../lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from '../../../../../hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from '../../../../../hooks/BehandlingHook';
import { PåklagetBehandlingGrunnlag, TypeBehandling } from '../../../../../lib/types/types';
import { useConfigForm } from '../../../../form/FormHook';
import { VilkårsKortMedForm } from '../../../../vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { FormField } from '../../../../form/FormField';

interface Props {
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: PåklagetBehandlingGrunnlag;
}

interface FormFields {
  påklagetBehandling: string;
}

export const PåklagetBehandling = ({ behandlingVersjon, grunnlag, readOnly, erAktivtSteg }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('PÅKLAGET_BEHANDLING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      påklagetBehandling: {
        type: 'select',
        label: 'Velg behandlingen det klages på',
        rules: { required: 'Du må velge behandlingen det klages på' },
        options: [{ label: 'Annet', value: 'Annet' }, ...mapGrunnlagTilValg(grunnlag)],
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      console.log('data', data);
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          // TODO: Send med løsning
          behovstype: Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Påklaget behandling'}
      steg={'PÅKLAGET_BEHANDLING'}
      onSubmit={handleSubmit}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      erAktivtSteg={erAktivtSteg}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
    >
      <FormField form={form} formField={formFields.påklagetBehandling} />
    </VilkårsKortMedForm>
  );
};

function mapGrunnlagTilValg(grunnlag?: PåklagetBehandlingGrunnlag) {
  return (
    grunnlag?.behandlinger.map((behandling) => ({
      value: behandling.referanse,
      label: `Vedtakstidspunkt: ${behandling.vedtakstidspunkt}`,
    })) ?? []
  );
}
