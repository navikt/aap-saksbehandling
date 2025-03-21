'use client';

import { SamordningUføreGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/form/FormField';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { SamordningUføreTabell } from 'components/behandlinger/underveis/samordninguføre/SamordningUføreTabell';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  grunnlag: SamordningUføreGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}
export interface SamordningUføreFormFields {
  begrunnelse: string;
  vurderteSamordninger: SamordnetUførePeriode[];
}
type SamordnetUførePeriode = {
  kilde?: string;
  graderingFraKilde?: number;
  gradering?: number;
  virkningstidspunkt: string;
};
export const SamordningUføre = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, resetStatus, status } = useLøsBehovOgGåTilNesteSteg('SAMORDNING_UFØRE');

  function hentDefaultSamordningerFraVurderingerEllerGrunnlag(
    grunnlag: SamordningUføreGrunnlag
  ): SamordnetUførePeriode[] {
    if (grunnlag.vurdering?.vurderingPerioder?.length) {
      return grunnlag.vurdering.vurderingPerioder.map((vurdering) => ({
        gradering: vurdering.uføregradTilSamordning,
        virkningstidspunkt: vurdering.virkningstidspunkt,
      }));
    }
    if (grunnlag.grunnlag.length) {
      return grunnlag.grunnlag.map((ytelse) => ({
        kilde: ytelse.kilde,
        graderingFraKilde: ytelse.uføregrad,
        virkningstidspunkt: ytelse.virkningstidspunkt,
      }));
    }
    return [];
  }
  const { form, formFields } = useConfigForm<SamordningUføreFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder hvilken grad med uføre som skal samordnes med AAP',
        rules: { required: 'Skriv begrunnelse' },
        defaultValue: grunnlag.vurdering?.begrunnelse,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: hentDefaultSamordningerFraVurderingerEllerGrunnlag(grunnlag),
      },
    },
    { readOnly }
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_UFORE,
          samordningUføreVurdering: {
            begrunnelse: data.begrunnelse,
            vurderingPerioder: data.vurderteSamordninger.map((samordning) => ({
              virkningstidspunkt: formaterDatoForBackend(
                parse(samordning.virkningstidspunkt, 'dd.MM.yyyy', new Date())
              ),
              uføregradTilSamordning: samordning.gradering!,
            })),
          },
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  }
  return (
    <VilkårsKort heading="Samordning med delvis uføre" steg="SAMORDNING_UFØRE">
      <Form
        steg={'SAMORDNING_UFØRE'}
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        resetStatus={resetStatus}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <SamordningUføreTabell form={form} readOnly={readOnly} />
      </Form>
    </VilkårsKort>
  );
};
