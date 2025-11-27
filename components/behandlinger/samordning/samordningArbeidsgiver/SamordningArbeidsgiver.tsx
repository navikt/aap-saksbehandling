'use client';

import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { BodyLong, VStack } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  MellomlagretVurdering,
  SamordningArbeidsgiverGrunnlag,
  SamordningArbeidsgiverVurdering,
} from 'lib/types/types';

import { differenceInBusinessDays, parse } from 'date-fns';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import Link from 'next/link';

import { SamordningArbeidsGiverTabell } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiverTabell';

interface Props {
  grunnlag: SamordningArbeidsgiverGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface SamordningArbeidsgiverFormFields {
  begrunnelse: string;
  perioder: SamordningArbeidsGiverPeriode[];
}

export interface SamordningArbeidsGiverPeriode {
  fom: string;
  tom: string;
  antallDager?: string;
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
        label: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
      perioder: {
        type: 'fieldArray',
        defaultValue: defaultValue.perioder,
        rules: {},
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
            samordningArbeidsgiverVurdering: {
              begrunnelse: data.begrunnelse,
              perioder: data.perioder.map((periode) => ({
                fom: formaterDatoForBackend(parse(periode.fom, 'dd.MM.yyyy', new Date())),
                tom: formaterDatoForBackend(parse(periode.tom, 'dd.MM.yyyy', new Date())),
              })),
            },
          },
          referanse: behandlingsreferanse,
        },
        () => nullstillMellomlagretVurdering()
      )
    )(event);
  };

  const historiskeVurderinger = grunnlag.historiskeVurderinger;

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
              grupperPåOpprettetDato={true}
              getErGjeldende={() => true}
              getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
              getVurdertAvIdent={(v) => v.vurdertAv.ident}
              getVurdertDato={(v) => v.vurdertAv.dato}
            />
          )}

          <VStack>
            {/* TODO: Skal legges til senere
            <BodyShort size={'small'} weight={'semibold'}>
              Relevant informasjon fra søknad:
            </BodyShort>

            <BodyShort textColor={'subtle'} size={'small'} weight={'semibold'}>
              Har du fått eller skal du få ekstra utbetalinger fra arbeidsgiver? Ja
            </BodyShort>
            */}
          </VStack>

          <BodyLong>
            <Link href={'https://lovdata.no/nav/rundskriv/r11-00#ref/lov/1997-02-28-19/%C2%A711-24'}>
              {' '}
              Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-24 (lovdata.no)
            </Link>
          </BodyLong>

          <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
          <VStack gap={'6'}>
            <SamordningArbeidsGiverTabell form={form} readOnly={formReadOnly} />
          </VStack>
        </VStack>
      }
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function byggFelter(vurdering: SamordningArbeidsgiverVurdering): ValuePair<string>[] {
  const begrunnelse = vurdering.begrunnelse || 'Ingen begrunnelse på behandling funnet';
  const perioder = vurdering.perioder || [];

  const felter: ValuePair<string>[] = [
    {
      label: 'Begrunnelse',
      value: begrunnelse,
    },
  ];

  if (perioder.length === 0) {
    felter.push({
      label: 'Reduksjonsperioder',
      value: 'Ingen Reduksjonsperioder',
    });
  } else {
    perioder.map((item, index) => {
      const ytelseLabel = index === 0 ? 'Reduksjonsperioder' : '';
      const value = `${formaterDatoForFrontend(item.fom)} - ${formaterDatoForFrontend(item.tom)}`;

      felter.push({
        label: ytelseLabel,
        value,
      });
    });
  }

  return felter;
}

function mapVurderingToDraftFormFields(vurdering: SamordningArbeidsgiverGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse || '',
    perioder: (vurdering?.perioder || []).map((periode) => {
      const fomDate = parse(periode.fom, 'yyyy-MM-dd', new Date());
      const tomDate = parse(periode.tom, 'yyyy-MM-dd', new Date());

      const antallDager = differenceInBusinessDays(tomDate, fomDate) + 1;

      return {
        fom: formaterDatoForFrontend(periode.fom),
        tom: formaterDatoForFrontend(periode.tom),
        antallDager: String(antallDager),
      };
    }),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    perioder: [],
  };
}
