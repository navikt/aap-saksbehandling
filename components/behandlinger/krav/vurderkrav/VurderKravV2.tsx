'use client';

import { KravGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { VilkårskortMedMellomlagring } from 'components/vilkårskort/vilkårskortmedmellomlagring/VilkårskortMedMellomlagring';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { KravTabellV2 } from 'components/behandlinger/krav/kravtabell/KravTabellV2';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { VStack } from '@navikt/ds-react';
import { finnKravVurderingByReferanse } from 'components/behandlinger/krav/kravutils';
import { KravBoks } from 'components/behandlinger/krav/kravboks/KravBoks';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

interface Props {
  grunnlag?: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
}

export interface KravFormFields {
  valgteKrav: string[];
}

export const VurderKravV2 = ({ grunnlag, initialMellomlagretVurdering, behandlingVersjon, readOnly }: Props) => {
  console.log('grunnlag', grunnlag);
  const { visningModus, visningActions, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'KRAV',
    undefined
  );

  const form = useForm<KravFormFields>({ defaultValues: { valgteKrav: [] } });
  const { control, setValue, getValues } = form;

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.VURDER_KRAV_KODE,
    initialMellomlagretVurdering,
    form
  );

  const {
    status,
    løsBehovOgGåTilNesteStegError,
    løsBehovOgGåTilNesteSteg,
    isLoading,
    løsPeriodisertBehovOgGåTilNesteSteg,
  } = useLøsBehovOgGåTilNesteSteg('KRAV');

  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const lukkKrav = (referanse: string) => {
    setValue(
      'valgteKrav',
      (getValues('valgteKrav') ?? []).filter((r) => r !== referanse)
    );
  };

  return (
    <VilkårskortMedMellomlagring
      heading="Vurder krav"
      steg="KRAV"
      vilkårTilhørerNavKontor={false}
      onBekreft={function (): void {
        throw new Error('Function not implemented.');
      }}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visningModus={visningModus}
      visningActions={visningActions}
      onDeleteMellomlagringClick={function (): void {
        throw new Error('Function not implemented.');
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      onNullstill={function (): void {
        throw new Error('Function not implemented.');
      }}
    >
      <FormProvider {...form}>
        <KravTabellV2 grunnlag={grunnlag} />
        <VStack gap="space-16">
          {valgteKrav.map((referanse) => {
            const krav = finnKravVurderingByReferanse(grunnlag, referanse);
            if (!krav) return null;

            return <KravBoks key={referanse} krav={krav} onLukk={() => lukkKrav(referanse)} />;
          })}
        </VStack>
      </FormProvider>
    </VilkårskortMedMellomlagring>
  );
};
