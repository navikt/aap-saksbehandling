'use client';

import { BistandsGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
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
  grunnlag?: BistandsGrunnlag;
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
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harBruketSøktOmUføretrygd),
        rules: { required: 'Du må svare på om brukeren har søkt om uføretrygd' },
        options: JaEllerNeiOptions,
      },
      brukerHarFåttVedtakOmUføretrygd: {
        type: 'radio',
        label: 'Har brukeren fått vedtak på søknaden om uføretrygd?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harBrukerFåttVedtakOmUføretrygd),
        rules: { required: 'Du må svare på om brukeren har fått vedtak om uføretrygd' },
      },
      brukerRettPåAAP: {
        type: 'radio',
        label: 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harBrukerRettPåAAP),
        rules: { required: 'Du må svare på om brukeren har krav på AAP etter vedtak om uføretrygd etter § 11-18' },
      },
      virkningsdato: {
        type: 'textarea',
        label: 'Virkningsdato for vurderingen',
        defaultValue: grunnlag?.vurdering?.virkningsdato || undefined,
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
          behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
          bistandsVurdering: {
            begrunnelse: data.begrunnelse,
            erBehovForAktivBehandling: data.erBehovForAktivBehandling === JaEllerNei.Ja,
            erBehovForArbeidsrettetTiltak: data.erBehovForArbeidsrettetTiltak === JaEllerNei.Ja,
            erBehovForAnnenOppfølging: data.erBehovForAnnenOppfølging
              ? data.erBehovForAnnenOppfølging === JaEllerNei.Ja
              : undefined,
            ...(bistandsbehovErIkkeOppfylt && {
              skalVurdereAapIOvergangTilUføre: data.vurderAAPIOvergangTilUføre === JaEllerNei.Ja,
              skalVurdereAapIOvergangTilArbeid: data.vurderAAPIOvergangTilArbeid === JaEllerNei.Ja,
              overgangBegrunnelse: data.overgangBegrunnelse,
            }),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const erBehovForAktivBehandling = form.watch('erBehovForAktivBehandling') === JaEllerNei.Nei;
  const erBehovForArbeidsrettetTiltak = form.watch('erBehovForArbeidsrettetTiltak') === JaEllerNei.Nei;
  const erBehovForAnnenOppfølging = form.watch('erBehovForAnnenOppfølging') === JaEllerNei.Nei;

  const bistandsbehovErIkkeOppfylt =
    erBehovForAktivBehandling && erBehovForArbeidsrettetTiltak && erBehovForAnnenOppfølging;

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
      <FormField form={form} formField={formFields.brukerHarFåttVedtakOmUføretrygd} horizontalRadio />
      <Alert variant="warning">
        Hvis bruker har fått avslag på uføretrygd på bakgrunn av § 12-5, så må § 11-6 vurders til oppfylt.
      </Alert>
      <FormField form={form} formField={formFields.brukerRettPåAAP} horizontalRadio />
      {typeBehandling === 'Revurdering' && !grunnlag?.harOppfylt11_5 && bistandsbehovErIkkeOppfylt && (
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
