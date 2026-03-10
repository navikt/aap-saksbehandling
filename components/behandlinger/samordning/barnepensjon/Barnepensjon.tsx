'use client';

import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { BarnepensjonGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { VStack } from '@navikt/ds-react';
import { BarnepensjonTabell } from 'components/behandlinger/samordning/barnepensjon/BarnepensjonTabell';
import { BarnepensjonTidligereVurdering } from 'components/behandlinger/samordning/barnepensjon/BarnepensjonTidligereVurdering';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';

interface Props {
  grunnlag: BarnepensjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface BarnepensjonPeriode {
  fom: string;
  tom: string;
  månedsbeløp: string;
}

export interface BarnepensjonFormFields {
  begrunnelse: string;
  barnepensjonPerioder: BarnepensjonPeriode[];
}

type DraftFormFields = Partial<BarnepensjonFormFields>;

export const Barnepensjon = ({ readOnly, initialMellomlagretVurdering, behandlingVersjon, grunnlag }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE, initialMellomlagretVurdering);

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_BARNEPENSJON');

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_BARNEPENSJON',
    initialMellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

  const { form, formFields } = useConfigForm<BarnepensjonFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder samordning med barnepensjon',
        rules: { required: 'Du må vurdere samordning med barnepensjon.' },
        defaultValue: defaultValue.begrunnelse,
      },
      barnepensjonPerioder: {
        type: 'fieldArray',
        defaultValue: defaultValue.barnepensjonPerioder,
      },
    },
    { readOnly: formReadOnly }
  );

  const tidligereVurderinger: any[] = []; // TODO Denne skal komme fra grunnlaget

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-27 Samordning barnepensjon (valgfritt)'}
      steg={'SAMORDNING_BARNEPENSJON'}
      onSubmit={form.handleSubmit((data) => {
        løsBehovOgGåTilNesteSteg(
          {
            behandlingVersjon: behandlingVersjon,
            referanse: behandlingsreferanse,
            behov: {
              behovstype: Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE,
              barnepensjonVurdering: {
                begrunnelse: data.begrunnelse,
                // @ts-expect-error fiks type på fom og tom i bakcend
                perioder: data.barnepensjonPerioder.map((periode) => {
                  return {
                    tom: periode.tom,
                    fom: periode.fom,
                    månedsbeløp: periode.månedsbeløp,
                  };
                }),
              },
            },
          },
          () => {
            nullstillMellomlagretVurdering();
          }
        );
      })}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() =>
        form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : emptyDraftFormFields())
      }
    >
      <VStack gap={'8'}>
        {tidligereVurderinger.map((vurdering, index) => (
          <BarnepensjonTidligereVurdering key={index} vurdering={vurdering} />
        ))}
        <FormField form={form} formField={formFields.begrunnelse} />
        <BarnepensjonTabell form={form} readOnly={formReadOnly} />
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(grunnlag: BarnepensjonGrunnlag): DraftFormFields {
  return {
    begrunnelse: grunnlag.vurdering?.begrunnelse,
    // @ts-expect-error fiks type på fom og tom i backend
    barnepensjonPerioder: grunnlag.vurdering?.perioder.map((periode) => {
      return {
        fom: periode.fom,
        tom: periode.tom,
        månedsytelse: periode.månedsbeløp,
      };
    }),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    barnepensjonPerioder: [],
  };
}
