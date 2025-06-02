'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { TrekkKlageGrunnlag, TypeBehandling } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: TrekkKlageGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  skalTrekkes?: JaEllerNei;
  hvorforTrekkes?: 'TRUKKET_AV_BRUKER' | 'FEILREGISTRERING';
}

export const TrekkKlageVurdering = ({ behandlingVersjon, readOnly, erAktivtSteg, grunnlag }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('TREKK_KLAGE');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må skrive en begrunnelse' },
        defaultValue: grunnlag?.vurdering?.begrunnelse,
      },
      skalTrekkes: {
        type: 'radio',
        label: 'Skal klagen trekkes?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velge om klagen skal trekkes' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.skalTrekkes),
      },
      hvorforTrekkes: {
        type: 'radio',
        label: 'Hvorfor trekkes klagen?',
        options: [
          { label: 'Bruker trekker klagen', value: 'TRUKKET_AV_BRUKER' },
          { label: 'Feilregistrering', value: 'FEILREGISTRERING' },
        ],
        rules: { required: 'Du må velge hvorfor klages trekkes' },
        defaultValue: grunnlag?.vurdering?.hvorforTrekkes ?? undefined,
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
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
      });
    })(event);
  };

  const harValgtAtKlageTrekkes = form.watch('skalTrekkes') === JaEllerNei.Ja;

  return (
    <VilkårsKortMedForm
      heading={'Trekk klage'}
      steg={'TREKK_KLAGE'}
      onSubmit={handleSubmit}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      erAktivtSteg={erAktivtSteg}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
    >
      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.skalTrekkes} horizontalRadio />
      {harValgtAtKlageTrekkes && <FormField form={form} formField={formFields.hvorforTrekkes} />}
    </VilkårsKortMedForm>
  );
};
