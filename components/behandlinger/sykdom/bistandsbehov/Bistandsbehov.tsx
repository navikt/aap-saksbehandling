'use client';

import { BistandsGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { FormEvent } from 'react';
import { Alert, BodyShort, Button, Heading, HGrid, Link, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { TidligereVurderinger } from 'components/behandlinger/sykdom/bistandsbehov/TidligereVurderinger';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: BistandsGrunnlag;
  mellomlagring?: BistandsGrunnlag['vurdering'];
}

interface FormFields {
  begrunnelse: string;
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
  overgangBegrunnelse?: string;
  vurderAAPIOvergangTilUføre?: string;
  vurderAAPIOvergangTilArbeid?: string;
}

export const Bistandsbehov = ({ behandlingVersjon, grunnlag, readOnly, typeBehandling, mellomlagring }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const { oppdaterMellomlagring, slettMellomlagring, opprettMellomlagring, mellomlagringFinnes } = useMellomlagring(
    Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
    mellomlagring !== undefined
  );

  const defaultValue = mellomlagring ? mellomlagring : grunnlag?.vurdering;

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValue?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har behov for oppfølging' },
      },
      erBehovForAktivBehandling: {
        type: 'radio',
        label: 'a: Har brukeren behov for aktiv behandling?',
        defaultValue: getJaNeiEllerUndefined(defaultValue?.erBehovForAktivBehandling),
        rules: { required: 'Du må svare på om brukeren har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      erBehovForArbeidsrettetTiltak: {
        type: 'radio',
        label: 'b: Har brukeren behov for arbeidsrettet tiltak?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.erBehovForArbeidsrettetTiltak),
        rules: { required: 'Du må svare på om brukeren har behov for arbeidsrettet tiltak' },
      },
      erBehovForAnnenOppfølging: {
        type: 'radio',
        label:
          'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.erBehovForAnnenOppfølging),
        rules: { required: 'Du må svare på om brukeren anses for å ha en viss mulighet til å komme i arbeid' },
      },
      overgangBegrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValue?.overgangBegrunnelse || undefined,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      vurderAAPIOvergangTilUføre: {
        type: 'radio',
        label: 'Har brukeren rett til AAP under behandling av krav om uføretrygd?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.skalVurdereAapIOvergangTilUføre),
        rules: {
          required: 'Du må svare på om brukeren har rett på AAP i overgang til uføre',
          validate: (value) =>
            value === JaEllerNei.Ja ? 'AAP under behandling av søknad om uføretrygd er ikke støttet enda' : undefined,
        },
      },
      vurderAAPIOvergangTilArbeid: {
        type: 'radio',
        label: 'Har brukeren rett til AAP i perioden som arbeidssøker?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.skalVurdereAapIOvergangTilArbeid),
        rules: {
          required: 'Du må svare på om brukeren har rett på AAP i overgang til arbeid',
          validate: (value) => (value === JaEllerNei.Ja ? 'AAP i overgang til arbeid er ikke støttet enda' : undefined),
        },
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
      heading={'§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid'}
      steg={'VURDER_BISTANDSBEHOV'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      {mellomlagringFinnes && <Alert variant={'warning'}>Det finnes en mellomlagring.</Alert>}
      <HGrid gap={'4'}>
        <Button type={'button'} onClick={() => opprettMellomlagring({ thmas: 'hehe' })}>
          Opprett
        </Button>
        <Button type={'button'} onClick={() => oppdaterMellomlagring({ thomas: 'hehe' })}>
          Oppdater
        </Button>
        <Button type={'button'} onClick={() => slettMellomlagring()}>
          Slett
        </Button>
      </HGrid>
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
            Vilkårene i § 11-6 første ledd bokstav a til c er tre alternative vilkår. Det vil si at det er nok at
            brukeren oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav a
            (aktiv behandling) og bokstav b (arbeidsrettet tiltak) er oppfylte. Hvis du svarer ja på ett eller begge
            vilkårene, er § 11-6 oppfylt. Hvis du svarer nei på a og b, må du vurdere om bokstav c er oppfylt. Hvis du
            svarer nei på alle tre vilkårene, er § 11-6 ikke oppfylt.{' '}
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-6">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-6
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
      <FormField form={form} formField={formFields.erBehovForAktivBehandling} horizontalRadio />
      <FormField form={form} formField={formFields.erBehovForArbeidsrettetTiltak} horizontalRadio />
      {form.watch('erBehovForAktivBehandling') !== JaEllerNei.Ja &&
        form.watch('erBehovForArbeidsrettetTiltak') !== JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.erBehovForAnnenOppfølging} horizontalRadio />
        )}
      {(typeBehandling === 'Førstegangsbehandling' || (typeBehandling === 'Revurdering' && grunnlag?.harOppfylt11_5)) &&
        bistandsbehovErIkkeOppfylt && (
          <VStack gap={'4'} as={'section'}>
            <Heading level={'3'} size="small">
              § 11-18 Arbeidsavklaringspenger under behandling av krav om uføretrygd
            </Heading>
            <FormField form={form} formField={formFields.overgangBegrunnelse} className="begrunnelse" />
            <FormField form={form} formField={formFields.vurderAAPIOvergangTilUføre} horizontalRadio />
            {form.watch('vurderAAPIOvergangTilUføre') === JaEllerNei.Ja && (
              <Alert variant="warning">
                Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-18-sak.
              </Alert>
            )}
          </VStack>
        )}
      {typeBehandling === 'Revurdering' && !grunnlag?.harOppfylt11_5 && bistandsbehovErIkkeOppfylt && (
        <VStack gap={'4'} as={'section'}>
          <Heading level={'3'} size="small">
            § 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker
          </Heading>
          <FormField form={form} formField={formFields.overgangBegrunnelse} className="begrunnelse" />
          <FormField form={form} formField={formFields.vurderAAPIOvergangTilArbeid} horizontalRadio />
          {form.watch('vurderAAPIOvergangTilArbeid') === JaEllerNei.Ja && (
            <Alert variant="warning">
              Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-17-sak.
            </Alert>
          )}
        </VStack>
      )}
    </VilkårsKortMedForm>
  );
};
