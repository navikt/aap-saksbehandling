'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagretVurdering, PåklagetBehandlingGrunnlag, TypeBehandling } from 'lib/types/types';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { VelgPåklagetVedtakRadioTable } from 'components/behandlinger/klage/formkrav/påklagetbehandling/VelgPåklagetVedtakRadioTable';
import { Controller, useForm } from 'react-hook-form';
import { Behovstype } from 'lib/utils/form';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: PåklagetBehandlingGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  vedtak: string | null | undefined;
}

type DraftFormFields = Partial<FormFields>;

export const PåklagetBehandling = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('PÅKLAGET_BEHANDLING');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.FASTSETT_PÅKLAGET_BEHANDLING, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.gjeldendeVurdering);

  const { control, handleSubmit, watch, reset } = useForm<FormFields>({
    defaultValues: {
      vedtak: defaultValue.vedtak,
    },
  });

  const onSubmit = (data: FormFields) => {
    løsBehovOgGåTilNesteSteg(
      {
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
          påklagetBehandlingVurdering: {
            påklagetVedtakType: 'KELVIN_BEHANDLING',
            påklagetBehandling: data.vedtak,
          },
        },
      },
      () => nullstillMellomlagretVurdering()
    );
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
      vurdertAvAnsatt={grunnlag?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          reset(
            grunnlag?.gjeldendeVurdering
              ? mapVurderingToDraftFormFields(grunnlag.gjeldendeVurdering)
              : emptyDraftFormFields()
          )
        )
      }
      readOnly={readOnly}
    >
      <Controller
        name="vedtak"
        control={control}
        rules={{ required: 'Du må velge hvilket vedtak klagen gjelder' }}
        render={({ field, fieldState }) => (
          <VelgPåklagetVedtakRadioTable
            options={mapGrunnlagTilValg(grunnlag)}
            error={fieldState.invalid ? fieldState.error?.message : undefined}
            readOnly={readOnly}
            {...field}
          />
        )}
      />
    </VilkårsKortMedForm>
  );
};

function mapVurderingToDraftFormFields(vurdering: PåklagetBehandlingGrunnlag['gjeldendeVurdering']): DraftFormFields {
  return {
    vedtak: vurdering?.påklagetBehandling,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return { vedtak: '' };
}

function mapGrunnlagTilValg(grunnlag?: PåklagetBehandlingGrunnlag) {
  return (
    grunnlag?.behandlinger.map((behandling) => ({
      saksnummer: behandling.saksnummer,
      value: behandling.referanse,
      vedtaksdato: new Date(behandling.vedtakstidspunkt),
      behandlingstype: behandling.typeBehandling,
      vurderingsbehov: behandling.vurderingsbehov.map(formaterVurderingsbehov),
    })) ?? []
  );
}
