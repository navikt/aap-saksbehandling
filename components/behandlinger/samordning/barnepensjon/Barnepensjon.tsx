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

interface Props {
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

export const Barnepensjon = ({ readOnly, initialMellomlagretVurdering }: Props) => {
  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE);
  const { status, løsBehovOgGåTilNesteStegError, isLoading } = useLøsBehovOgGåTilNesteSteg('SAMORDNING_BARNEPENSJON');
  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_BARNEPENSJON',
    initialMellomlagretVurdering
  );

  const { form, formFields } = useConfigForm<BarnePensjonFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder samordning med barnepensjon',
        rules: { required: 'Du må vurdere samordning med barnepensjon.' },
      },
      barnepensjon: {
        type: 'fieldArray',
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
        nullstillMellomlagretVurdering();
      })}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      visningModus={visningModus}
      visningActions={visningActions}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset())}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      mellomlagretVurdering={mellomlagretVurdering}
      formReset={() => form.reset()}
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
