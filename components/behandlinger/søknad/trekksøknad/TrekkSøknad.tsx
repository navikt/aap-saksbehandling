'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, TrukketSøknadGrunnlag, TrukketSøknadVudering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';

interface Props {
  grunnlag: TrukketSøknadGrunnlag;
  readOnly: boolean;
  behandlingVersjon: number;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
}

type DraftFormFields = Partial<FormFields>;

export const TrekkSøknad = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SØKNAD');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.VURDER_TREKK_AV_SØKNAD_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SØKNAD',
    mellomlagretVurdering
  );

  const vurderingerString = grunnlag?.vurderinger.at(-1);

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(vurderingerString);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        defaultValue: defaultValues.begrunnelse,
        rules: { required: 'Du må begrunne hvorfor søknaden skal trekkes' },
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
            begrunnelse: data.begrunnelse,
          },
          referanse: behandlingsReferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  console.log('modus', visningModus);
  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Trekk søknad'}
      steg={'SØKNAD'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(vurderingerString ? mapVurderingToDraftFormFields(vurderingerString) : emptyDraftFormFields())
        );
      }}
      readOnly={readOnly}
      visningModus={visningModus}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      visningActions={visningActions}
    >
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering?: TrukketSøknadVudering): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
  };
}
