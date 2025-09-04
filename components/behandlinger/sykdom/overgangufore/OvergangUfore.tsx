'use client';

import { MellomlagretVurdering, OvergangUforeGrunnlag, OvergangUføreVurdering, TypeBehandling } from 'lib/types/types';
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
import { Alert, BodyShort, Link } from '@navikt/ds-react';

import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: OvergangUforeGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  brukerHarSøktUføretrygd: string;
  brukerHarFåttVedtakOmUføretrygd: string;
  brukerRettPåAAP?: string;
  virkningsdato: string;
}

export const OvergangUfore = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  typeBehandling,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_UFORE');

  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const brukerSøktUføretrygdLabel = 'Har brukeren søkt om uføretrygd?';
  const brukerHarFaattVedtakOmUføretrygdLabel = 'Har brukeren fått vedtak på søknaden om uføretrygd?';
  const brukerrettPaaAAPLabel = 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?';
  const virkningsdatoLabel = 'Virkningsdato for vurderingen';

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.OVERGANG_UFORE, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValue.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har krav på uføretrygd' },
      },
      brukerHarSøktUføretrygd: {
        type: 'radio',
        label: brukerSøktUføretrygdLabel,
        defaultValue: defaultValue.brukerHarSøktUføretrygd,
        rules: { required: 'Du må svare på om brukeren har søkt om uføretrygd' },
        options: JaEllerNeiOptions,
      },
      brukerHarFåttVedtakOmUføretrygd: {
        type: 'radio',
        label: brukerHarFaattVedtakOmUføretrygdLabel,
        options: [
          {
            label: 'Nei',
            value: 'NEI',
          },
          {
            label: 'Ja, brukeren har fått innvilget full uføretrygd',
            value: 'JA_INNVILGET_FULL',
          },
          {
            label: 'Ja, brukeren har fått innvilget gradert uføretrygd',
            value: 'JA_INNVILGET_GRADERT',
          },
          {
            label: 'Ja, brukeren har fått avslag på uføretrygd',
            value: 'JA_AVSLAG',
          },
        ],
        defaultValue:
          defaultValue.brukerHarFåttVedtakOmUføretrygd === undefined ||
          defaultValue.brukerHarFåttVedtakOmUføretrygd === null
            ? undefined
            : defaultValue.brukerHarFåttVedtakOmUføretrygd.toString(),
        rules: { required: 'Du må svare på om brukeren har fått vedtak om uføretrygd' },
      },
      brukerRettPåAAP: {
        type: 'radio',
        label: brukerrettPaaAAPLabel,
        options: JaEllerNeiOptions,
        defaultValue: defaultValue.brukerRettPåAAP,
        rules: { required: 'Du må svare på om brukeren har krav på AAP etter vedtak om uføretrygd etter § 11-18' },
      },
      virkningsdato: {
        type: 'textarea',
        label: virkningsdatoLabel,
        defaultValue: (defaultValue.virkningsdato && formaterDatoForFrontend(defaultValue.virkningsdato)) || undefined,
        rules: { required: 'Du må velge virkningsdato for vurderingen' },
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  type DraftFormFields = Partial<FormFields>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.OVERGANG_UFORE,
            overgangUføreVurdering: {
              begrunnelse: data.begrunnelse,
              brukerHarSøktOmUføretrygd: data.brukerHarSøktUføretrygd === JaEllerNei.Ja,
              brukerHarFåttVedtakOmUføretrygd: data.brukerHarFåttVedtakOmUføretrygd,
              brukerRettPåAAP: data.brukerRettPåAAP === JaEllerNei.Ja,
              virkningsdato: formaterDatoForBackend(parse(data.virkningsdato, 'dd.MM.yyyy', new Date())),
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const brukerHarSoktOmUforetrygd = form.watch('brukerHarSøktUføretrygd') === JaEllerNei.Ja;
  const brukerHarFattAvslagPaUforetrygd = form.watch('brukerHarFåttVedtakOmUføretrygd') === 'JA_AVSLAG';

  const gjeldendeSykdomsvurdering = grunnlag?.gjeldendeSykdsomsvurderinger.at(-1);
  const vurderingenGjelderFra = gjeldendeSykdomsvurdering?.vurderingenGjelderFra;
  const historiskeVurderinger = grunnlag?.historiskeVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-18 AAP under behandling av krav om uføretrygd'}
      steg={'OVERGANG_UFORE'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring();
        form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields());
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      readOnly={readOnly}
    >
      {historiskeVurderinger && historiskeVurderinger.length > 0 && (
        <TidligereVurderinger
          data={historiskeVurderinger}
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
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-18" target="_blank">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-18
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
      <FormField form={form} formField={formFields.brukerHarSøktUføretrygd} horizontalRadio />
      {brukerHarSoktOmUforetrygd && <FormField form={form} formField={formFields.brukerHarFåttVedtakOmUføretrygd} />}
      {brukerHarFattAvslagPaUforetrygd && (
        <Alert variant="warning">
          Hvis bruker har fått avslag på uføretrygd på bakgrunn av § 12-5, så må § 11-6 vurderes til oppfylt fra dato på
          uføretrygdvedtaket.
        </Alert>
      )}
      <FormField form={form} formField={formFields.brukerRettPåAAP} horizontalRadio />
      <DateInputWrapper
        name={`virkningsdato`}
        control={form.control}
        label={'Virkningsdato for vurderingen'}
        rules={{
          validate: {
            gyldigDato: (value) => validerDato(value as string),
          },
        }}
        readOnly={readOnly}
      />
    </VilkårskortMedFormOgMellomlagring>
  );

  function mapVurderingToDraftFormFields(vurdering?: OvergangUføreVurdering): DraftFormFields {
    return {
      begrunnelse: vurdering?.begrunnelse,
      brukerRettPåAAP: getJaNeiEllerUndefined(vurdering?.brukerRettPåAAP),
      brukerHarSøktUføretrygd: getJaNeiEllerUndefined(vurdering?.brukerHarSøktUføretrygd),
      brukerHarFåttVedtakOmUføretrygd: vurdering?.brukerHarFåttVedtakOmUføretrygd || '',
      virkningsdato: vurdering?.virkningsdato || '',
    };
  }

  function emptyDraftFormFields(): DraftFormFields {
    return {
      begrunnelse: '',
      brukerHarSøktUføretrygd: '',
      brukerHarFåttVedtakOmUføretrygd: '',
      brukerRettPåAAP: '',
      virkningsdato: '',
    };
  }

  function byggFelter(vurdering: OvergangUføreVurdering): ValuePair[] {
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
        label: brukerSøktUføretrygdLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.brukerHarSøktUføretrygd),
      },
      {
        label: brukerHarFaattVedtakOmUføretrygdLabel,
        value: vurdering.brukerHarFåttVedtakOmUføretrygd || '',
      },
      {
        label: virkningsdatoLabel,
        value: (vurdering.virkningsdato && formaterDatoForFrontend(vurdering.virkningsdato)) || '',
      },
    ];
  }
};
