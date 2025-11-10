'use client';

import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { BodyLong, BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagretVurdering, SamordningArbeidsgiverGrunnlag } from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import Link from 'next/link';

import { SamordningArbeidsGiverTabell } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiverTabell';

interface Props {
  grunnlag: SamordningArbeidsgiverGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface SamordningArbeidsgiverFormFields {
  begrunnelse?: string;
  perioder?: SamordningArbeidsgiverPerioder[];
}

export interface SamordningArbeidsgiverPerioder {
  fom?: string;
  tom?: string;
}

type DraftFormFields = Partial<SamordningArbeidsgiverFormFields>;

export const SamordningArbeidsgiver = ({
  readOnly,
  behandlingVersjon,
  grunnlag,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_ARBEIDSGIVER');

  const { nullstillMellomlagretVurdering, mellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SAMORDNING_ARBEIDSGIVER',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurdering);

  const { form, formFields } = useConfigForm<SamordningArbeidsgiverFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
      perioder: {
        type: 'fieldArray',
        defaultValue: defaultValue.perioder,
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
            behovstype: Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER,
            samordningAndreStatligeYtelserVurdering: {
              begrunnelse: data.begrunnelse,
              vurderingPerioder: data.perioder.map((periode) => ({
                periode: {
                  fom: formaterDatoForBackend(parse(periode.fom!, 'dd.MM.yyyy', new Date())),
                  tom: formaterDatoForBackend(parse(periode.tom!, 'dd.MM.yyyy', new Date())),
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
  const skalViseBekreftKnapp = !formReadOnly;

  const historiskeVurderinger = grunnlag.historiskeVurderinger;

  console.log(historiskeVurderinger);

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="§ 11-24 Reduksjon av AAP på grunn av ytelser fra arbeidsgiver"
      steg="SAMORDNING_ARBEIDSGIVER"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {
        <VStack gap={'6'}>
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

          <VStack>
            <BodyShort size={'small'} weight={'semibold'}>
              Relevant informasjon fra søknad:
            </BodyShort>
            <BodyShort textColor={'subtle'} size={'small'} weight={'semibold'}>
              Har du fått eller skal du få ekstra utbetalinger fra arbeidsgiver? Ja
            </BodyShort>
          </VStack>

          <BodyLong>
            <Link href={'https://lovdata.no/nav/rundskriv/r11-00#ref/lov/1997-02-28-19/%C2%A711-24'}>
              {' '}
              Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-24 (lovdata.no)
            </Link>
          </BodyLong>

          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
          <Label size={'small'}>Legg til periode med reduksjon som følge av ytelse fra arbeidsgiver</Label>
          <VStack gap={'6'}>
            <SamordningArbeidsGiverTabell form={form} readOnly={formReadOnly} />
          </VStack>
        </VStack>
      }
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

const byggFelter = (vurdering: SamordningArbeidsgiverGrunnlag['vurdering']): ValuePair[] => [
  {
    label: 'Vurdering',
    value: vurdering?.begrunnelse || '-',
  },
];

function mapVurderingToDraftFormFields(vurdering: SamordningArbeidsgiverGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    tom: vurdering?.tom ? formaterDatoForFrontend(vurdering?.tom) : '',
    fom: vurdering?.fom ? formaterDatoForFrontend(vurdering?.fom) : '',
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    tom: '',
    fom: '',
  };
}
