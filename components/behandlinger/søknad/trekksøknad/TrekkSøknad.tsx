'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, TrukketSøknadGrunnlag, TrukketSøknadVudering } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

interface Props {
  grunnlag: TrukketSøknadGrunnlag;
  readOnly: boolean;
  behandlingVersjon: number;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  skalTrekkes?: string;
}

type DraftFormFields = Partial<FormFields>;

export const TrekkSøknad = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SØKNAD');

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SØKNAD',
    initialMellomlagretVurdering
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
      skalTrekkes: {
        type: 'radio',
        label: 'Skal søknaden trekkes?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velge om søknaden skal trekkes' },
        defaultValue: defaultValues.skalTrekkes,
      },
    },
    { readOnly: formReadOnly }
  );

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
            begrunnelse: data.begrunnelse,
            skalTrekkes: data.skalTrekkes === JaEllerNei.Ja,
          },
          referanse: behandlingsreferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Trekk søknad'}
      steg={'SØKNAD'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(vurderingerString ? mapVurderingToDraftFormFields(vurderingerString) : emptyDraftFormFields())
        );
      }}
      visningModus={visningModus}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      visningActions={visningActions}
    >
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.skalTrekkes} horizontalRadio />
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering?: TrukketSøknadVudering): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    skalTrekkes: getJaNeiEllerUndefined(vurdering?.skalTrekkes),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    skalTrekkes: '',
  };
}
