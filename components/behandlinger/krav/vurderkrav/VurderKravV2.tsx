'use client';

import { KravGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { KravTabellV2 } from 'components/behandlinger/krav/kravtabell/KravTabellV2';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { BodyShort, Box, VStack } from '@navikt/ds-react';
import {
  byggInitielleVurderinger,
  byggKravVurderingerFraSkjema,
  finnKravVurderingByReferanse,
  kravVurderingTilFormFields,
  KravVurderingFormFields,
} from 'components/behandlinger/krav/kravutils';
import { KravBoks } from 'components/behandlinger/krav/kravboks/KravBoks';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { SubmitEventHandler } from 'react';

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

export const VurderKravV2 = ({ grunnlag, initialMellomlagretVurdering, behandlingVersjon, readOnly }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'KRAV',
    initialMellomlagretVurdering
  );

  const defaultValues: KravFormFields = initialMellomlagretVurdering
    ? (JSON.parse(initialMellomlagretVurdering.data) as KravFormFields)
    : { valgteKrav: [], vurderinger: byggInitielleVurderinger(grunnlag) };

  const form = useForm<KravFormFields>({ defaultValues });
  const { control, setValue, getValues } = form;

  const { mellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.VURDER_KRAV_KODE,
    initialMellomlagretVurdering,
    form
  );

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('KRAV');

  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const lukkKrav = (referanse: string) => {
    // Nullstill feltene til opprinnelig verdi fra grunnlaget, slik at ulagrede
    // endringer forkastes når boksen lukkes.
    const krav = finnKravVurderingByReferanse(grunnlag, referanse);
    if (krav) {
      setValue(`vurderinger.${referanse}`, kravVurderingTilFormFields(krav));
    }

    setValue(
      'valgteKrav',
      (getValues('valgteKrav') ?? []).filter((r) => r !== referanse)
    );
  };

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
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
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
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
        {grunnlag?.søknaderUtenKravvurdering && grunnlag.søknaderUtenKravvurdering.length > 0 && (
          <Box>
            <BodyShort>Søknader som mangler vurdering: </BodyShort>
            {grunnlag?.søknaderUtenKravvurdering.map((søknad) => (
              <BodyShort key={søknad.journalpostId.identifikator}>
                {søknad.journalpostId.identifikator}: {formaterDatoForFrontend(søknad.mottattTidspunkt)}{' '}
              </BodyShort>
            ))}
          </Box>
        )}

        <FormProvider {...form}>
          <KravTabellV2 grunnlag={grunnlag} readOnly={formReadOnly} />
          <VStack gap="space-16">
            {valgteKrav.map((referanse) => {
              const krav = finnKravVurderingByReferanse(grunnlag, referanse);
              if (!krav) return null;

              const erVedtatt = grunnlag?.vedtatteVurderinger.some((v) => v.referanse === referanse) ?? false;

              return (
                <KravBoks
                  key={referanse}
                  krav={krav}
                  erVedtatt={erVedtatt}
                  søknaderUtenKravvurdering={grunnlag?.søknaderUtenKravvurdering ?? []}
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
