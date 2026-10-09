'use client';

import { MellomlagretVurdering, StønadsperiodeGrunnlag } from 'lib/types/types';
import { StønadsperiodeTabell } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/StønadsperiodeTabell';
import { StønadsperiodeBoks } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodeboks/StønadsperiodeBoks';
import { VStack } from '@navikt/ds-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import {
  byggInitielleStønadsperiodeVurderinger,
  finnStønadsperiodeVurderingByReferanse,
  hentOriginaleStønadsperiodeFormFelter,
  StønadsperiodeFormFields,
} from 'components/behandlinger/krav/utils/stønadsperiodeutils';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { SubmitEventHandler } from 'react';

interface Props {
  behandlingVersjon: number;
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const Stønadsperiode = ({ grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  // const { behandlingsreferanse } = useParamsMedType();

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_STØNADSPERIODE',
    initialMellomlagretVurdering
  );

  const defaultValues: StønadsperiodeFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : {
        valgteKrav: [],
        vurderinger: byggInitielleStønadsperiodeVurderinger(grunnlag),
      };

  const form = useForm<StønadsperiodeFormFields>({ defaultValues });

  const { mellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.AVKLAR_STØNADSPERIODE_KODE,
    initialMellomlagretVurdering,
    form
  );

  console.log('mellomlagretVurdering', mellomlagretVurdering);
  console.log('initialMellomlagretVurdering', initialMellomlagretVurdering);

  const { løsAvklaringsbehovStatus, løsAvklaringsbehovError, løsAvklaringsbehovIsLoading } =
    useLøsAvklaringsbehov('AVKLAR_STØNADSPERIODE');

  const valgteKrav = useWatch({ control: form.control, name: 'valgteKrav' }) ?? [];

  const lukkKrav = (referanse: string) => {
    const originaleFelter = hentOriginaleStønadsperiodeFormFelter(grunnlag, referanse);
    if (originaleFelter) {
      form.setValue(`vurderinger.${referanse}`, originaleFelter, { shouldDirty: true });
    }
    form.setValue(
      'valgteKrav',
      (form.getValues('valgteKrav') ?? []).filter((valgt) => valgt !== referanse),
      { shouldDirty: true }
    );
  };

  const toggleValgtKrav = (referanse: string) => {
    if (valgteKrav.includes(referanse)) {
      lukkKrav(referanse);
    } else {
      form.setValue('valgteKrav', [...(form.getValues('valgteKrav') ?? []), referanse], { shouldDirty: true });
    }
  };

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      console.log(data);
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Forskrift om AAP § 12. Ny stønadsperiode'}
      steg={'AVKLAR_STØNADSPERIODE'}
      onSubmit={handleSubmit}
      isLoading={løsAvklaringsbehovIsLoading}
      status={løsAvklaringsbehovStatus}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      visningModus={visningModus}
      visningActions={visningActions}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => {
          form.reset();
        })
      }
      mellomlagretVurdering={mellomlagretVurdering}
      formReset={() => form.reset()}
      vilkårTilhørerNavKontor={false}
    >
      <VStack gap="space-16">
        <FormProvider {...form}>
          <StønadsperiodeTabell
            grunnlag={grunnlag}
            readOnly={formReadOnly}
            valgteKrav={valgteKrav}
            onToggleValgtKrav={toggleValgtKrav}
          />

          {valgteKrav.map((referanse) => {
            const vurdering = finnStønadsperiodeVurderingByReferanse(grunnlag, referanse);
            return (
              vurdering && (
                <StønadsperiodeBoks key={referanse} vurdering={vurdering} onLukk={() => lukkKrav(referanse)} />
              )
            );
          })}
        </FormProvider>
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};
