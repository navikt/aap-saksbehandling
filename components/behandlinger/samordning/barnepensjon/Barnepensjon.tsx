'use client';

import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { MellomlagretVurdering, Periode } from 'lib/types/types';
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
  grunnlag: any; // TODO Endre denne til korrekt type når det er klart i backend
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface Barnepensjon {
  periode: Periode;
  månedsytelse: string;
}

export interface BarnePensjonFormFields {
  begrunnelse: string;
  barnepensjon: Barnepensjon[];
}

type DraftFormFields = Partial<BarnePensjonFormFields>;

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

  const { form, formFields } = useConfigForm<BarnePensjonFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder samordning med barnepensjon',
        rules: { required: 'Du må vurdere samordning med barnepensjon.' },
        defaultValue: defaultValue.begrunnelse,
      },
      barnepensjon: {
        type: 'fieldArray',
        defaultValue: defaultValue.barnepensjon,
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
        console.log(data);
        // TODO Legg til resten av typene i behov når det er klart i backend
        løsBehovOgGåTilNesteSteg(
          {
            behandlingVersjon: behandlingVersjon,
            referanse: behandlingsreferanse,
            behov: {
              behovstype: Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE,
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
          form.reset(grunnlag ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields())
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

// TODO Endre typen til denne når backend er klar
function mapVurderingToDraftFormFields(grunnlag: any): DraftFormFields {
  console.log(grunnlag);
  return emptyDraftFormFields();
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    barnepensjon: [],
  };
}
