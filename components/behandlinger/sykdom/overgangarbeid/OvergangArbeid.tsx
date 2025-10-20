'use client';

import {
  MellomlagretVurdering,
  OvergangArbeidGrunnlag,
  OvergangArbeidVurdering,
  TypeBehandling,
} from 'lib/types/types';
import {
  Behovstype,
  getJaNeiEllerIkkeBesvart,
  getJaNeiEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { BodyShort, Link, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: OvergangArbeidGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  brukerRettPåAAP?: string;
  fom: string;
}

type DraftFormFields = Partial<FormFields>;

export const OvergangArbeid = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  typeBehandling,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_ARBEID');

  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const brukerrettPaaAAPLabel = 'Har brukeren rett på AAP i perioden som arbeidssøker etter § 11-17?';
  const virkningsdatoLabel = 'Virkningsdato for vurderingen';
  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.OVERGANG_ARBEID, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'OVERGANG_ARBEID',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.nyeVurderinger?.[0]);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValue.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har krav på AAP' },
      },
      brukerRettPåAAP: {
        type: 'radio',
        label: brukerrettPaaAAPLabel,
        options: JaEllerNeiOptions,
        defaultValue: defaultValue.brukerRettPåAAP,
        rules: { required: 'Du må svare på om brukeren har krav på AAP i perioden som arbeidssøker etter § 11-17' },
      },
      fom: {
        type: 'textarea',
        label: virkningsdatoLabel,
        defaultValue: (defaultValue.fom && formaterDatoForFrontend(defaultValue.fom)) || undefined,
        description: 'Bruker får AAP etter § 11-17 fra til',
        rules: { required: 'Du må velge virkningsdato for vurderingen' },
      },
    },
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.OVERGANG_ARBEID,
            løsningerForPerioder: [
              {
                begrunnelse: data.begrunnelse,
                brukerRettPåAAP: data.brukerRettPåAAP === JaEllerNei.Ja,
                fom: formaterDatoForBackend(parse(data.fom, 'dd.MM.yyyy', new Date())),
              },
            ],
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const gjeldendeSykdomsvurdering = grunnlag?.gjeldendeSykdsomsvurderinger.at(-1);
  const vurderingenGjelderFra = gjeldendeSykdomsvurdering?.vurderingenGjelderFra;
  const sisteVedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-17 AAP i perioden som arbeidssøker'}
      steg={'OVERGANG_ARBEID'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!formReadOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.nyeVurderinger?.[0]?.vurdertAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring();
        form.reset(grunnlag?.nyeVurderinger?.[0] ? mapVurderingToDraftFormFields(grunnlag.nyeVurderinger?.[0]) : emptyDraftFormFields());
      }}
      readOnly={formReadOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      {typeBehandling === 'Revurdering' && sisteVedtatteVurderinger && sisteVedtatteVurderinger.length > 0 && (
        <TidligereVurderinger
          data={sisteVedtatteVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={() => true}
          getFomDato={(v) => v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdering?.vurdertAv.dato}
        />
      )}
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-17" target="_blank">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-17
            </Link>
          </div>
        }
      />
      {typeBehandling === 'Revurdering' && (
        <BodyShort>
          Vurderingen gjelder fra {vurderingenGjelderFra && formaterDatoForFrontend(vurderingenGjelderFra)}
        </BodyShort>
      )}
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.brukerRettPåAAP} horizontalRadio />
      <VStack gap={'4'} as={'section'}>
        <DateInputWrapper
          name={`fom`}
          control={form.control}
          label={'Virkningsdato for vurderingen'}
          rules={{
            validate: {
              gyldigDato: (value) => validerDato(value as string),
            },
          }}
          readOnly={formReadOnly}
        />
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );

  function mapVurderingToDraftFormFields(vurdering?: OvergangArbeidVurdering): DraftFormFields {
    return {
      begrunnelse: vurdering?.begrunnelse,
      brukerRettPåAAP: getJaNeiEllerUndefined(vurdering?.brukerRettPåAAP),
      fom: vurdering?.fom || '',
    };
  }

  function emptyDraftFormFields(): DraftFormFields {
    return {
      begrunnelse: '',
      brukerRettPåAAP: '',
      fom: '',
    };
  }

  function byggFelter(vurdering: OvergangArbeidVurdering): ValuePair[] {
    return [
      {
        label: vilkårsvurderingLabel,
        value: vurdering.begrunnelse,
      },
      {
        label: brukerrettPaaAAPLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.brukerRettPåAAP),
      },
      {
        label: virkningsdatoLabel,
        value: (vurdering.fom && formaterDatoForFrontend(vurdering.fom)) || '',
      },
    ];
  }
};
