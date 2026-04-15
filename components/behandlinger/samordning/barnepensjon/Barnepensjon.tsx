'use client';

import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
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
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { replaceCommasWithDots } from 'lib/utils/string';
import { hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';

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
  const { behandlingsreferanse } = useParamsMedType();

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

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE,
    initialMellomlagretVurdering,
    form
  );

  const feilmeldinger = hentFeilmeldingerForForm(form.formState.errors);

  return (
    <VilkårskortMedFormOgMellomlagring
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
                perioder: data.barnepensjonPerioder.map((periode) => {
                  return {
                    tom: periode.tom,
                    fom: periode.fom,
                    månedsbeløp: { verdi: Number(replaceCommasWithDots(periode.månedsbeløp)) },
                  };
                }),
              },
            },
          },
          () => {
            nullstillMellomlagretVurdering();
            visningActions.onBekreftClick();
          }
        );
      })}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
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
        {grunnlag.historiskeVurderinger && grunnlag.historiskeVurderinger.length > 0 && (
          <BarnepensjonTidligereVurdering vurderinger={grunnlag.historiskeVurderinger} />
        )}
        <FormField form={form} formField={formFields.begrunnelse} />
        <BarnepensjonTabell form={form} readOnly={formReadOnly} />

        {feilmeldinger && feilmeldinger.length > 0 && <FormErrorSummary errorList={feilmeldinger} />}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(grunnlag: BarnepensjonGrunnlag): DraftFormFields {
  return {
    begrunnelse: grunnlag.vurdering?.begrunnelse,
    barnepensjonPerioder: grunnlag.vurdering?.perioder.map((periode) => {
      return {
        fom: periode.fom,
        tom: periode.tom || '',
        månedsbeløp: periode.månedsbeløp.verdi.toString(),
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
