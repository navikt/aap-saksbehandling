'use client';

import { KravGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { KravTabell } from 'components/behandlinger/krav/kravtabell/KravTabell';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { VStack } from '@navikt/ds-react';
import {
  byggInitielleVurderinger,
  byggKravVurderingerFraSkjema,
  finnKravVurderingByReferanse,
  finnSøknadUtenKravByReferanse,
  hentOriginaleFormFelter,
  KravVurderingFormFields,
} from 'components/behandlinger/krav/kravutils';
import { KravBoks } from 'components/behandlinger/krav/kravboks/KravBoks';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { SubmitEventHandler } from 'react';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  grunnlag?: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
}

export interface KravFormFields {
  valgteKrav: string[];
  vurderinger: Record<string, KravVurderingFormFields>;
}

export const VurderKrav = ({ grunnlag, initialMellomlagretVurdering, behandlingVersjon, readOnly }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'KRAV',
    initialMellomlagretVurdering
  );

  const defaultValues: KravFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : {
        valgteKrav: (grunnlag?.søknaderUtenKravvurdering ?? []).map((s) => s.journalpostId.identifikator),
        vurderinger: byggInitielleVurderinger(grunnlag),
      };

  const form = useForm<KravFormFields>({ defaultValues });
  const { control, setValue, getValues } = form;

  const { mellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.VURDER_KRAV_KODE,
    initialMellomlagretVurdering,
    form
  );

  const { løsAvklaringsbehov, løsAvklaringsbehovStatus, løsAvklaringsbehovError, løsAvklaringsbehovIsLoading } =
    useLøsAvklaringsbehov('KRAV');

  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const lukkKrav = (referanse: string) => {
    const originaleFelter = hentOriginaleFormFelter(grunnlag, referanse);
    if (originaleFelter) {
      setValue(`vurderinger.${referanse}`, originaleFelter);
    }

    setValue(
      'valgteKrav',
      (getValues('valgteKrav') ?? []).filter((r) => r !== referanse)
    );
  };

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsAvklaringsbehov(
        {
          behandlingVersjon,
          referanse: behandlingsreferanse,
          behov: {
            behovstype: Behovstype.VURDER_KRAV_KODE,
            kravVurderinger: byggKravVurderingerFraSkjema(grunnlag, data.vurderinger),
          },
        },
        () => {
          visningActions.onBekreftClick();
          slettMellomlagring();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading="Vurder krav"
      steg="KRAV"
      vilkårTilhørerNavKontor={false}
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
      onSubmit={handleSubmit}
      formReset={() => form.reset()}
    >
      <VStack gap={'space-16'}>
        <FormProvider {...form}>
          <KravTabell grunnlag={grunnlag} readOnly={formReadOnly} />
          <VStack gap="space-16">
            {valgteKrav.map((referanse) => {
              const krav = finnKravVurderingByReferanse(grunnlag, referanse);
              const søknad = !krav ? finnSøknadUtenKravByReferanse(grunnlag, referanse) : undefined;
              if (!krav && !søknad) return null;

              const erVedtatt = krav
                ? (grunnlag?.vedtatteVurderinger.some((v) => v.referanse === referanse) ?? false)
                : false;

              return (
                <KravBoks
                  key={referanse}
                  innhold={krav ? { kilde: 'EKSISTERENDE', krav } : { kilde: 'NY_SØKNAD', søknad: søknad! }}
                  erVedtatt={erVedtatt}
                  onLukk={() => lukkKrav(referanse)}
                />
              );
            })}
          </VStack>
        </FormProvider>
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};
