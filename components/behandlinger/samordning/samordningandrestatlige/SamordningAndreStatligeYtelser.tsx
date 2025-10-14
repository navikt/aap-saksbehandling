'use client';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';
import { AndreStatligeYtelserTabell } from 'components/behandlinger/samordning/samordningandrestatlige/AndreStatligeYtelserTabell';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  MellomlagretVurdering,
  SamordningAndreStatligeYtelserGrunnlag,
  SamordningAndreStatligeYtelserYtelse,
} from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  grunnlag: SamordningAndreStatligeYtelserGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface SamordningAndreStatligeYtelserFormFields {
  begrunnelse: string;
  vurderteSamordninger: AnnenStatligYtelse[];
}

export interface AnnenStatligYtelse {
  ytelse?: SamordningAndreStatligeYtelserYtelse;
  fom?: string;
  tom?: string;
}

type DraftFormFields = Partial<SamordningAndreStatligeYtelserFormFields>;

export const SamordningAndreStatligeYtelser = ({
  readOnly,
  behandlingVersjon,
  grunnlag,
  initialMellomlagretVurdering,
}: Props) => {
  const [visYtelsesTabell, setVisYtelsesTabell] = useState<boolean>(grunnlag.vurdering !== null);
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'SAMORDNING_ANDRE_STATLIGE_YTELSER'
  );

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_ANDRE_STATLIGE_YTELSER',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurdering);

  const { form, formFields } = useConfigForm<SamordningAndreStatligeYtelserFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om brukeren har andre statlige ytelser som skal avregnes med AAP',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: defaultValue.vurderteSamordninger,
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER,
            samordningAndreStatligeYtelserVurdering: {
              begrunnelse: data.begrunnelse,
              vurderingPerioder: data.vurderteSamordninger.map((vurdertSamordning) => ({
                ytelse: vurdertSamordning.ytelse!,
                periode: {
                  fom: formaterDatoForBackend(parse(vurdertSamordning.fom!, 'dd.MM.yyyy', new Date())),
                  tom: formaterDatoForBackend(parse(vurdertSamordning.tom!, 'dd.MM.yyyy', new Date())),
                },
              })),
            },
          },
          referanse: behandlingsreferanse,
        },
        () => nullstillMellomlagretVurdering()
      )
    )(event);
  };

  const skalViseBekreftKnapp = !formReadOnly && visYtelsesTabell;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="Andre ytelser til avregning"
      steg="SAMORDNING_ANDRE_STATLIGE_YTELSER"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={skalViseBekreftKnapp}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        );
      }}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      {!visYtelsesTabell && (
        <HStack>
          <Button
            size={'small'}
            variant={'secondary'}
            onClick={() => setVisYtelsesTabell(true)}
            disabled={formReadOnly}
          >
            Legg til ytelser
          </Button>
        </HStack>
      )}
      {visYtelsesTabell && (
        <VStack gap={'6'}>
          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
          <AndreStatligeYtelserTabell form={form} readOnly={formReadOnly} />
        </VStack>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(
  vurdering: SamordningAndreStatligeYtelserGrunnlag['vurdering']
): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse || '',
    vurderteSamordninger: (vurdering?.vurderingPerioder || []).map((vurdering) => ({
      ytelse: vurdering.ytelse,
      fom: formaterDatoForFrontend(vurdering.periode.fom),
      tom: formaterDatoForFrontend(vurdering.periode.tom),
    })),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    vurderteSamordninger: [],
  };
}
