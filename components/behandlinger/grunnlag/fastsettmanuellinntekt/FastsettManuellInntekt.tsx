'use client';

import { VilkRskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { FormEvent } from 'react';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  ManuellInntektGrunnlag,
  ManuellInntektVurderingGrunnlagResponse,
  MellomlagretVurdering,
} from 'lib/types/types';
import { formaterTilNok } from 'lib/utils/string';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingsversjon: number;
  grunnlag: ManuellInntektGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  inntekt: string;
}

type DraftFormFields = Partial<FormFields>;

export const FastsettManuellInntekt = ({
  behandlingsversjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('MANGLENDE_LIGNING');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.FASTSETT_MANUELL_INNTEKT, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
        rules: { required: 'Du må gi en begrunnelse.' },
        defaultValue: defaultValue.begrunnelse,
      },
      inntekt: {
        type: 'number',
        label: 'Oppgi inntekt',
        rules: {
          required: 'Du må oppgi inntekt for det siste året.',
          min: { value: 0, message: 'Inntekt kan ikke være negativ.' },
        },
        defaultValue: defaultValue.inntekt || '',
      },
    },
    { readOnly }
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.FASTSETT_MANUELL_INNTEKT,
            manuellVurderingForManglendeInntekt: {
              begrunnelse: data.begrunnelse,
              belop: Number(data.inntekt),
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  }

  const inntektStr = form.watch('inntekt');
  const inntekt = inntektStr && inntektStr !== '' ? Number(inntektStr) : 0;
  const inntektIgVerdi = grunnlag.gverdi ? inntekt / grunnlag.gverdi : 0;

  const historiskeVurderinger = grunnlag.historiskeVurderinger;

  return (
    <VilkRskortMedFormOgMellomlagring
      heading={'Pensjonsgivende inntekt mangler (§ 11-19)'}
      steg={'MANGLENDE_LIGNING'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields());
        });
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      readOnly={readOnly}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger[historiskeVurderinger.length - 1])}
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}

      <Alert variant={'warning'} size={'small'}>
        Du må oppgi pensjonsgivende inntekt for siste beregningsår, fordi ingen inntekt er registrert. Om brukeren ikke
        har hatt inntekt for gitt år, legg inn 0.{' '}
      </Alert>
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <HStack gap={'2'} align={'end'}>
        <FormField form={form} formField={formFields.inntekt} className={'inntekt_input'} />
        <BodyShort>{inntektIgVerdi.toFixed(2)} G</BodyShort>
      </HStack>
    </VilkRskortMedFormOgMellomlagring>
  );
};

const mapVurderingToDraftFormFields = (vurdering?: ManuellInntektVurderingGrunnlagResponse): DraftFormFields => {
  return {
    begrunnelse: vurdering?.begrunnelse,
    inntekt: getStringEllerUndefined(vurdering?.belop),
  };
};
const emptyDraftFormFields = (): DraftFormFields => {
  return {
    begrunnelse: '',
    inntekt: '',
  };
};

const byggFelter = (vurdering: ManuellInntektVurderingGrunnlagResponse): ValuePair[] => [
  {
    label: 'Begrunnelse',
    value: vurdering.begrunnelse,
  },
  {
    label: 'Oppgitt inntekt',
    value: vurdering.belop ? formaterTilNok(vurdering.belop) : '-',
  },
];
