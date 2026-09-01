'use client';

import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagretVurdering, PåklagetBehandlingGrunnlag, TypeBehandling } from 'lib/types/types';
import { VelgPåklagetVedtakRadioTable } from 'components/behandlinger/klage/formkrav/påklagetbehandling/VelgPåklagetVedtakRadioTable';
import { Controller, useForm } from 'react-hook-form';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

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
  const { behandlingsreferanse } = useParamsMedType();

  const { løsAvklaringsbehov, løsAvklaringsbehovStatus, løsAvklaringsbehovError, løsAvklaringsbehovIsLoading } =
    useLøsAvklaringsbehov('PÅKLAGET_BEHANDLING');

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'PÅKLAGET_BEHANDLING',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.gjeldendeVurdering);

  const form = useForm<FormFields>({
    defaultValues: {
      vedtak: defaultValue.vedtak,
    },
  });

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
    initialMellomlagretVurdering,
    form
  );

  const onSubmit = (data: FormFields) => {
    løsAvklaringsbehov(
      {
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
          påklagetBehandlingVurdering: {
            påklagetVedtakType: 'KELVIN_BEHANDLING', // TODO: varier mellom KELVIN_BEHANDLING og TILBAKEKREVING
            påklagetBehandling: data.vedtak,
          },
        },
      },
      () => {
        loggUmamiVarighet('STEG_PÅKLAGET_BEHANDLING_VARIGHET', umamiStartTidspunkt, Date.now());
        visningActions.onBekreftClick();
        nullstillMellomlagretVurdering();
      }
    );
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Klage på vedtak'}
      steg={'PÅKLAGET_BEHANDLING'}
      onSubmit={form.handleSubmit(onSubmit)}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      vilkårTilhørerNavKontor={false}
      isLoading={løsAvklaringsbehovIsLoading}
      status={løsAvklaringsbehovStatus}
      vurderingerMeta={grunnlag?.vurderingerMeta}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(
            grunnlag?.gjeldendeVurdering
              ? mapVurderingToDraftFormFields(grunnlag.gjeldendeVurdering)
              : emptyDraftFormFields()
          )
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <Controller
        name="vedtak"
        control={form.control}
        rules={{ required: 'Du må velge hvilket vedtak klagen gjelder' }}
        render={({ field, fieldState }) => (
          <VelgPåklagetVedtakRadioTable
            options={mapGrunnlagTilValg(grunnlag)}
            error={fieldState.invalid ? fieldState.error?.message : undefined}
            readOnly={formReadOnly}
            {...field}
          />
        )}
      />
    </VilkårskortMedFormOgMellomlagring>
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
      eksternSaksbehandlingUrl: behandling.eksternSaksbehandlingUrl,
    })) ?? []
  );
}
