'use client';

import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { MellomlagretVurdering, SykestipendGrunnlag } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { SubmitEventHandler } from 'react';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { VStack } from '@navikt/ds-react/Stack';
import { BodyLong } from '@navikt/ds-react/Typography';
import { FormField } from 'components/form/FormField';
import { SykestipendPeriodeTabell } from 'components/behandlinger/samordning/sykestipend/SykestipendPeriodeTabell';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami';

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
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_SYKESTIPEND');

  const harSvartJaISøknad = grunnlag.sykeStipendSvarFraSøknad
    ? 'Ja'
    : grunnlag.sykeStipendSvarFraSøknad === false
      ? 'Nei'
      : 'ingen data';

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_SYKESTIPEND',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValue: SykestipendFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingTilForm(grunnlag?.gjeldendeVurdering);

  const { form, formFields } = useConfigForm<SykestipendFormFields>(
    {
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
    },
    { readOnly: formReadOnly }
  );

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_SAMORDNING_SYKESTIPEND_KODE,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg(
        {
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
        },
        () => {
          loggUmamiVarighet('STEG_SYKESTIPEND_VARIGHET', umamiStartTidspunkt, Date.now());
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
        }
      )
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-29 Sykestipend fra lånekassen'}
      steg={'SAMORDNING_SYKESTIPEND'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurderingerMeta={grunnlag?.gjeldendeVurdering?.vurderingerMeta}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag?.gjeldendeVurdering ? mapVurderingTilForm(grunnlag.gjeldendeVurdering) : tomtForm())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'space-24'}>
        {grunnlag.sykeStipendSvarFraSøknad && (
          <VStack>
            <BodyLong weight={'semibold'} size={'small'}>
              Relevant informasjon fra søknad:
            </BodyLong>
            <BodyLong size={'small'} textColor={'subtle'}>
              Bruker har krysset av for at de får, eller nylig har søkt om sykestipend i søknad: {harSvartJaISøknad}
            </BodyLong>
          </VStack>
        )}
        <FormField form={form} formField={formFields.begrunnelse} />
        <SykestipendPeriodeTabell form={form} readOnly={formReadOnly} />
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
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
        fom: formaterDatoForFrontend(periode.fom),
        tom: formaterDatoForFrontend(periode.tom),
      })) ?? [],
  };
}

function tomtForm(): SykestipendFormFields {
  return {
    begrunnelse: '',
    perioder: [],
  };
}
