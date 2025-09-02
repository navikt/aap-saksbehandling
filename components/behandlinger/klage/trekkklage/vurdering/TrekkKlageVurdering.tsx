'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagretVurdering, TrekkKlageGrunnlag, TypeBehandling } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { VilkRskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: TrekkKlageGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

type TrekkGrunn = 'TRUKKET_AV_BRUKER' | 'FEILREGISTRERING';

interface FormFields {
  begrunnelse: string;
  skalTrekkes?: string;
  hvorforTrekkes?: TrekkGrunn;
}

type DraftFormFields = Partial<FormFields>;

export const TrekkKlageVurdering = ({ behandlingVersjon, readOnly, grunnlag, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('TREKK_KLAGE');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.TREKK_KLAGE_KODE, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må skrive en begrunnelse' },
        defaultValue: defaultValue.begrunnelse,
      },
      skalTrekkes: {
        type: 'radio',
        label: 'Skal klagen trekkes?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velge om klagen skal trekkes' },
        defaultValue: defaultValue.skalTrekkes,
      },
      hvorforTrekkes: {
        type: 'radio',
        label: 'Hvorfor trekkes klagen?',
        options: [
          { label: 'Brukeren trekker klagen', value: 'TRUKKET_AV_BRUKER' },
          { label: 'Feilregistrering', value: 'FEILREGISTRERING' },
        ],
        rules: { required: 'Du må velge hvorfor klages trekkes' },
        defaultValue: defaultValue.hvorforTrekkes,
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.TREKK_KLAGE_KODE,
            vurdering: {
              begrunnelse: data.begrunnelse,
              skalTrekkes: data.skalTrekkes === JaEllerNei.Ja,
              hvorforTrekkes: data.skalTrekkes === JaEllerNei.Ja ? data.hvorforTrekkes : null,
            },
          },
          referanse: behandlingsreferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const harValgtAtKlageTrekkes = form.watch('skalTrekkes') === JaEllerNei.Ja;

  return (
    <VilkRskortMedFormOgMellomlagring
      heading={'Trekk klage'}
      steg={'TREKK_KLAGE'}
      onSubmit={handleSubmit}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        )
      }
    >
      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.skalTrekkes} horizontalRadio />
      {harValgtAtKlageTrekkes && <FormField form={form} formField={formFields.hvorforTrekkes} />}
    </VilkRskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering: TrekkKlageGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    skalTrekkes: getJaNeiEllerUndefined(vurdering?.skalTrekkes),
    hvorforTrekkes: vurdering?.hvorforTrekkes ?? undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    skalTrekkes: '',
    hvorforTrekkes: '' as TrekkGrunn, // Vi caster denne da vi ikke ønsker å ødelegge typen på den i løs-behov
  };
}
