'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { MellomlagretVurdering, SykestipendGrunnlag } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { VStack } from '@navikt/ds-react';
import { FormField } from 'components/form/FormField';
import { SykestipendPeriodeTabell } from 'components/behandlinger/sykdom/student/sykestipend/SykestipendPeriodeTabell';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  grunnlag: SykestipendGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const SykestipendVurdering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_SYKESTIPEND');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_SAMORDNING_SYKESTIPEND_KODE,
    initialMellomlagretVurdering
  );

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_SYKESTIPEND',
    mellomlagretVurdering
  );

  const defaultValue: SykestipendFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingTilForm(grunnlag?.gjeldendeVurdering);

  const { form, formFields } = useConfigForm<SykestipendFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om brukeren har rett på sykestipend',
      rules: { required: 'Du må skrive en begrunnelse' },
      defaultValue: defaultValue.begrunnelse,
    },
    perioder: {
      type: 'fieldArray',
      defaultValue: defaultValue.perioder,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_SYKESTIPEND_KODE,
          sykestipendVurdering: {
            begrunnelse: data.begrunnelse,
            perioder: data.perioder.map((periode) => ({
              fom: formaterDatoForBackend(parse(periode.fom!, 'dd.MM.yyyy', new Date())),
              tom: formaterDatoForBackend(parse(periode.tom!, 'dd.MM.yyyy', new Date())),
            })),
          },
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-29 Sykestipend fra lånekassen'}
      steg={'SAMORDNING_SYKESTIPEND'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.gjeldendeVurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag?.gjeldendeVurdering ? mapVurderingTilForm(grunnlag.gjeldendeVurdering) : tomtForm())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'6'}>
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <SykestipendPeriodeTabell form={form} readOnly={formReadOnly} />
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

export interface SykestipendFormFields {
  begrunnelse: string;
  perioder: {
    fom: string;
    tom: string;
  }[];
}

function mapVurderingTilForm(vurdering: SykestipendGrunnlag['gjeldendeVurdering']): SykestipendFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse ?? '',
    perioder:
      vurdering?.perioder.map((periode) => ({
        fom: periode.fom,
        tom: periode.tom,
      })) ?? [],
  };
}

function tomtForm(): SykestipendFormFields {
  return {
    begrunnelse: '',
    perioder: [],
  };
}
