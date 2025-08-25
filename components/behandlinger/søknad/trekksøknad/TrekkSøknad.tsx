'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, TrukketSøknadGrunnlag, TrukketSøknadVudering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

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
    { readOnly: readOnly }
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

  return (
    <VilkårsKortMedForm
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
    >
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
    </VilkårsKortMedForm>
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
