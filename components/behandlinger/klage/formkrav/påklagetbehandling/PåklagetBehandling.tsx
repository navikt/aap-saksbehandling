'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { PåklagetBehandlingGrunnlag, TypeBehandling } from 'lib/types/types';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { VelgPåklagetVedtakRadioTable } from 'components/behandlinger/klage/formkrav/påklagetbehandling/VelgPåklagetVedtakRadioTable';
import { Controller, useForm } from 'react-hook-form';
import { Behovstype } from 'lib/utils/form';
import { formaterÅrsak } from 'lib/utils/årsaker';

interface Props {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: PåklagetBehandlingGrunnlag;
}

interface FormSchema {
  vedtak: string | null | undefined;
}

export const PåklagetBehandling = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('PÅKLAGET_BEHANDLING');

  const { control, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      vedtak: grunnlag?.gjeldendeVurdering?.påklagetBehandling,
    },
  });

  const onSubmit = (data: FormSchema) => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
        påklagetBehandlingVurdering: {
          påklagetVedtakType: 'KELVIN_BEHANDLING',
          påklagetBehandling: data.vedtak,
        },
      },
    });
  };

  return (
    <VilkårsKortMedForm
      heading={'Klage på vedtak'}
      steg={'PÅKLAGET_BEHANDLING'}
      onSubmit={handleSubmit(onSubmit)}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
    >
      <Controller
        name="vedtak"
        control={control}
        rules={{ required: 'Du må velge hvilket vedtak klagen gjelder' }}
        render={({ field, fieldState }) => (
          <VelgPåklagetVedtakRadioTable
            options={mapGrunnlagTilValg(grunnlag)}
            error={fieldState.invalid ? fieldState.error?.message : undefined}
            {...field}
          />
        )}
      />
    </VilkårsKortMedForm>
  );
};

function mapGrunnlagTilValg(grunnlag?: PåklagetBehandlingGrunnlag) {
  return (
    grunnlag?.behandlinger.map((behandling) => ({
      saksnummer: behandling.saksnummer,
      value: behandling.referanse,
      vedtaksdato: new Date(behandling.vedtakstidspunkt),
      behandlingstype: behandling.typeBehandling,
      årsakTilBehandling: behandling.årsaker.map(formaterÅrsak),
    })) ?? []
  );
}
