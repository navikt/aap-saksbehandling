'use client';

import { KravGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { KravTabell } from 'components/behandlinger/krav/kravtabell/KravTabell';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { VStack } from '@navikt/ds-react';
import {
  byggInitielleMigrerteKravVurderinger,
  byggInitielleVurderinger,
  byggKravVurderingerFraSkjema,
  byggMigrerteKravLøsningerFraSkjema,
  emptyMigrertKravFormFields,
  finnKravVurderingByReferanse,
  finnSøknadUtenKravByReferanse,
  getKravVurderingerForSøknad,
  getMigrerteKrav,
  harIngenKravvurderinger,
  hentOriginaleFormFelter,
  hentOriginaleMigrertKravFormFelter,
  KravVurderingFormFields,
  MigrertKravFormFields,
  NYTT_MIGRERT_KRAV_REFERANSE,
} from 'components/behandlinger/krav/kravutils';
import { KravBoks } from 'components/behandlinger/krav/kravboks/KravBoks';
import { MigrertKravBoks } from 'components/behandlinger/krav/migrertkravboks/MigrertKravBoks';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { SubmitEventHandler } from 'react';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { MigrerteKravTabell } from 'components/behandlinger/krav/kravtabell/MigrerteKravTabell';

interface Props {
  grunnlag: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
  harMigreringsbehov: boolean;
}

export interface KravFormFields {
  valgteKrav: string[];
  vurderinger: Record<string, KravVurderingFormFields>;
  valgteMigrerteKrav: string[];
  migrerteKravVurderinger: Record<string, MigrertKravFormFields>;
}

export const VurderKrav = ({
  grunnlag,
  initialMellomlagretVurdering,
  behandlingVersjon,
  readOnly,
  harMigreringsbehov,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'KRAV',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const visStandardMigrertKravSkjema = harMigreringsbehov && harIngenKravvurderinger(grunnlag);

  const defaultValues: KravFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : {
        valgteKrav: grunnlag.søknaderUtenKravvurdering.map((s) => s.journalpostId.identifikator),
        vurderinger: byggInitielleVurderinger(grunnlag),
        valgteMigrerteKrav: visStandardMigrertKravSkjema ? [NYTT_MIGRERT_KRAV_REFERANSE] : [],
        migrerteKravVurderinger: {
          ...byggInitielleMigrerteKravVurderinger(grunnlag),
          ...(visStandardMigrertKravSkjema ? { [NYTT_MIGRERT_KRAV_REFERANSE]: emptyMigrertKravFormFields() } : {}),
        },
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
  const harKravForSøknad =
    grunnlag.søknader.length +
      grunnlag.søknaderUtenKravvurdering.length +
      getKravVurderingerForSøknad(grunnlag.vedtatteVurderinger).length +
      getKravVurderingerForSøknad(grunnlag.nyeVurderinger).length >
    0;

  const harMigrertKrav =
    getMigrerteKrav(grunnlag.vedtatteVurderinger).length + getMigrerteKrav(grunnlag.nyeVurderinger).length > 0;

  const valgteMigrerteKrav = useWatch({ control, name: 'valgteMigrerteKrav' }) ?? [];

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

  const lukkMigrertKrav = (referanse: string) => {
    const originaleFelter = hentOriginaleMigrertKravFormFelter(grunnlag, referanse);
    if (originaleFelter) {
      setValue(`migrerteKravVurderinger.${referanse}`, originaleFelter);
    } else {
      const { [referanse]: _fjernet, ...resterende } = getValues('migrerteKravVurderinger') ?? {};
      setValue('migrerteKravVurderinger', resterende);
    }

    setValue(
      'valgteMigrerteKrav',
      (getValues('valgteMigrerteKrav') ?? []).filter((r) => r !== referanse)
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
            kravVurderinger: [
              ...byggKravVurderingerFraSkjema(grunnlag, data.vurderinger),
              ...byggMigrerteKravLøsningerFraSkjema(grunnlag, data.migrerteKravVurderinger),
            ],
          },
        },
        () => {
          loggUmamiVarighet('STEG_KRAV_VARIGHET', umamiStartTidspunkt, Date.now());
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
          <VStack gap="space-16">
            {harMigrertKrav && <MigrerteKravTabell grunnlag={grunnlag} readOnly={formReadOnly} />}
            {valgteMigrerteKrav.map((referanse) => {
              const erNyRad = hentOriginaleMigrertKravFormFelter(grunnlag, referanse) === undefined;
              return (
                <MigrertKravBoks
                  key={referanse}
                  referanse={referanse}
                  erNyRad={erNyRad}
                  onLukk={() => lukkMigrertKrav(referanse)}
                />
              );
            })}

            {harKravForSøknad && <KravTabell grunnlag={grunnlag} readOnly={formReadOnly} />}

            {valgteKrav.map((referanse) => {
              const krav = finnKravVurderingByReferanse(grunnlag, referanse);
              const søknad = !krav ? finnSøknadUtenKravByReferanse(grunnlag, referanse) : undefined;
              if (!krav && !søknad) return null;

              const erVedtatt = krav ? grunnlag.vedtatteVurderinger.some((v) => v.referanse === referanse) : false;

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
