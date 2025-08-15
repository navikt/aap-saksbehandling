'use client';

import { OvergangUforeGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { TidligereVurderinger } from 'components/behandlinger/sykdom/bistandsbehov/TidligereVurderinger';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: OvergangUforeGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  brukerHarSøktUføretrygd: string;
  brukerHarFåttVedtakOmUføretrygd: string;
  brukerRettPåAAP?: string;
  virkningsdato: string;
}

export const OvergangUfore = ({ behandlingVersjon, grunnlag, readOnly, typeBehandling }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_UFORE');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har krav på uføretrygd' },
      },
      brukerHarSøktUføretrygd: {
        type: 'radio',
        label: 'Har brukeren søkt om uføretrygd?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.brukerSoktUforetrygd),
        rules: { required: 'Du må svare på om brukeren har søkt om uføretrygd' },
        options: JaEllerNeiOptions,
      },
      brukerHarFåttVedtakOmUføretrygd: {
        type: 'radio',
        label: 'Har brukeren fått vedtak på søknaden om uføretrygd?',
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
        defaultValue: grunnlag?.vurdering?.brukerVedtakUforetrygd,
        rules: { required: 'Du må svare på om brukeren har fått vedtak om uføretrygd' },
      },
      brukerRettPåAAP: {
        type: 'radio',
        label: 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.brukerRettPaaAAP),
        rules: { required: 'Du må svare på om brukeren har krav på AAP etter vedtak om uføretrygd etter § 11-18' },
      },
      virkningsdato: {
        type: 'textarea',
        label: 'Virkningsdato for vurderingen',
        defaultValue: grunnlag?.vurdering?.virkningsDato || undefined,
        rules: { required: 'Du må velge virkningsdato for vurderingen' },
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.OVERGANG_UFORE,
          overgangUføreVurdering: {
            begrunnelse: data.begrunnelse,
            brukerSoktUforetrygd: data.brukerHarSøktUføretrygd === JaEllerNei.Ja,
            brukerVedtakUforetrygd: data.brukerHarFåttVedtakOmUføretrygd,
            brukerRettPaaAAP: data.brukerRettPåAAP === JaEllerNei.Ja,
            virkningsDato: data.virkningsdato,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const brukerHarSoktOmUforetrygd = form.watch('brukerHarSøktUføretrygd') === JaEllerNei.Ja;
  const brukerHarFattAvslagPaUforetrygd = form.watch('brukerHarFåttVedtakOmUføretrygd') === 'JA_AVSLAG';

  const gjeldendeSykdomsvurdering = grunnlag?.gjeldendeSykdsomsvurderinger.at(-1);
  const vurderingenGjelderFra = gjeldendeSykdomsvurdering?.vurderingenGjelderFra;

  return (
    <VilkårsKortMedForm
      heading={'§ 11-18 AAP under behandling av krav om uføretrygd'}
      steg={'OVERGANG_UFORE'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      {typeBehandling === 'Revurdering' && (
        <TidligereVurderinger
          historiskeVurderinger={grunnlag?.historiskeVurderinger.toReversed() ?? []}
          gjeldendeVurderinger={grunnlag?.gjeldendeVedtatteVurderinger ?? []}
          søknadstidspunkt={sak.periode.fom}
        />
      )}
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            Vilkårene i § 11-18 blabla.{' '}
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-18">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-18
            </Link>
            <span> </span>
            <Link href="https://lovdata.no"> (lovdata.no)</Link>
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
          Hvis bruker har fått avslag på uføretrygd på bakgrunn av § 12-5, så må § 11-6 vurderes til oppfylt.
        </Alert>
      )}
      <FormField form={form} formField={formFields.brukerRettPåAAP} horizontalRadio />
      {typeBehandling === 'Revurdering' && (
        <VStack gap={'4'} as={'section'}>
          <Heading level={'3'} size="small">
            § 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker
          </Heading>
          <FormField form={form} formField={formFields.virkningsdato} horizontalRadio />
        </VStack>
      )}
    </VilkårsKortMedForm>
  );
};
