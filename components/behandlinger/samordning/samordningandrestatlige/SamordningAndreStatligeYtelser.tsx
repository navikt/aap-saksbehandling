'use client';

import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { ReadMore, VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
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
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';

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
        label: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
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

  const historiskeVurderinger = grunnlag.historiskeVurderinger ?? null;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="Fradrag ved andre statlige ytelser"
      steg="SAMORDNING_ANDRE_STATLIGE_YTELSER"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {historiskeVurderinger != null && historiskeVurderinger.length > 0 && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={() => {
            return true;
          }}
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
          grupperPåOpprettetDato={true}
        />
      )}

      <ReadMore size={'small'} header="Hva skal vurderes?">
        Det må undersøkes om bruker har hatt andre ytelser i perioden med AAP som kan gi fradrag i AAP utbetalingen.
      </ReadMore>

      <VStack gap={'6'}>
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <AndreStatligeYtelserTabell form={form} readOnly={formReadOnly} />
      </VStack>
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

function byggFelter(vurdering: SamordningAndreStatligeYtelserGrunnlag['vurdering']): ValuePair<string>[] {
  const begrunnelse = vurdering?.begrunnelse || 'Ingen begrunnelse på behandling funnet';
  const perioder = vurdering?.vurderingPerioder || [];

  const felter: ValuePair<string>[] = [
    {
      label: 'Begrunnelse',
      value: begrunnelse,
    },
  ];

  if (perioder.length === 0) {
    felter.push({
      label: 'Ytelse(r)',
      value: 'Ingen ytelser',
    });
  } else {
    perioder.forEach((item, index) => {
      const ytelseLabel = index === 0 ? 'Ytelse(r)' : '';
      const value = `${item.ytelse}: ${formaterDatoForFrontend(item.periode.fom)} - ${formaterDatoForFrontend(item.periode.tom)}`;

      felter.push({
        label: ytelseLabel,
        value,
      });
    });
  }

  return felter;
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    vurderteSamordninger: [],
  };
}
