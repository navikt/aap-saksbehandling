'use client';

import { PersonGroupIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { BistandsGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Link } from '@navikt/ds-react';
import { validerDato } from 'lib/validation/dateValidation';
import { isBefore, startOfDay } from 'date-fns';
import { stringToDate } from 'lib/utils/date';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  søknadstidspunkt: string;
  grunnlag?: BistandsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  vurderingenGjelderFra: string;
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
  overgangBegrunnelse?: string;
  vurderAAPIOvergangTilUføre?: string; // ikke i backend enda, skal inn på førstegangsbehandling, vises hvis a-c === false, usikkert navn
  vurderAAPIOvergangTilArbeid?: string; // ikke i backend enda, skal kun vises i revurdering hvis 11-5 && 11-6 === false, usikkert navn
}

export const Oppfølging = ({ behandlingVersjon, søknadstidspunkt, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om bruker har behov for oppfølging' },
      },
      vurderingenGjelderFra: {
        type: 'date_input',
        label: 'Vurderingen gjelder fra',
        defaultValue: undefined,
        rules: {
          required: 'Du må velge når vurderingen gjelder fra',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const soknadstidspunkt = startOfDay(new Date(søknadstidspunkt));
              const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), soknadstidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
              }
            },
          },
        },
      },
      erBehovForAktivBehandling: {
        type: 'radio',
        label: 'a: Har bruker behov for aktiv behandling?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAktivBehandling),
        rules: { required: 'Du må svare på om bruker har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      erBehovForArbeidsrettetTiltak: {
        type: 'radio',
        label: 'b: Har bruker behov for arbeidsrettet tiltak?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForArbeidsrettetTiltak),
        rules: { required: 'Du må svare på om bruker har behov for arbeidsrettet tiltak' },
      },
      erBehovForAnnenOppfølging: {
        type: 'radio',
        label: 'c: Kan bruker anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAnnenOppfølging),
        rules: { required: 'Du må svare på om bruker anses for å ha en viss mulighet til å komme i arbeid' },
      },
      overgangBegrunnelse: {
        type: 'textarea',
        label: 'Vurder om brukeren har rett på AAP i overgang til uføre eller arbeid',
        defaultValue: undefined, // TODO hent fra grunnlag
        rules: { required: 'Du må begrunne om bruker har rett til AAP i overgang til uføre eller arbeid' },
      },
      vurderAAPIOvergangTilUføre: {
        type: 'radio',
        label: 'Har brukeren rett til AAP under behandling av søknad om uføretrygd etter § 11-18?',
        options: JaEllerNeiOptions,
        defaultValue: undefined, // må hentes fra grunnlag
        rules: { required: 'Du må svare på om bruker har rett på AAP i overgang til uføre' },
      },
      vurderAAPIOvergangTilArbeid: {
        type: 'radio',
        label: 'Har brukeren rett til AAP i perioden som arbeidssøker etter § 11-17?',
        options: JaEllerNeiOptions,
        defaultValue: undefined, // må hentes fra grunnlag
        rules: { required: 'Du må svare på om bruker har rett på AAP i overgang til arbeid' },
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
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading="§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid"
      steg="VURDER_BISTANDSBEHOV"
      icon={<PersonGroupIcon aria-hidden />}
      vilkårTilhørerNavKontor={true}
    >
      <Form
        steg="VURDER_BISTANDSBEHOV"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        resetStatus={resetStatus}
        visBekreftKnapp={!readOnly}
      >
        <Veiledning
          defaultOpen={false}
          tekst={
            <div>
              Vilkårene i § 11-6 første ledd bokstav a til c er tre alternative vilkår. Det vil si at det er nok at
              bruker oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav a
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
        {/* TODO utkommentert inntil backend er på plass
        {typeBehandling === 'Revurdering' && <FormField form={form} formField={formFields.vurderingenGjelderFra} />}
	*/}
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
        <FormField form={form} formField={formFields.erBehovForAktivBehandling} horizontalRadio />
        <FormField form={form} formField={formFields.erBehovForArbeidsrettetTiltak} horizontalRadio />
        {form.watch('erBehovForAktivBehandling') !== JaEllerNei.Ja &&
          form.watch('erBehovForArbeidsrettetTiltak') !== JaEllerNei.Ja && (
            <FormField form={form} formField={formFields.erBehovForAnnenOppfølging} horizontalRadio />
          )}
        {/* TODO utkommentert inntil backend er på plass
	  denne skal kun vises hvis det er JA på 11-5, og NEI på alle 11-6
          For førstegangsbehandling trengs ingen ekstra sjekk da man ikke kommer til 11-6 uten å ha ja på 11-5
          For en revurdering kommer man til 11-6 selv om det er nei på 11-5. Må enten utlede eller få vite om 11-5 er oppfylt i en revurdering

        {form.watch('erBehovForAktivBehandling') !== JaEllerNei.Ja &&
          form.watch('erBehovForArbeidsrettetTiltak') !== JaEllerNei.Ja &&
          form.watch('erBehovForAnnenOppfølging') !== JaEllerNei.Ja && (
            <section>
	      // Se om vi kan skille på overgang til uføre / arbeid i overskrift
              <Heading level={'3'} size="medium">
		§ 11-17 AAP i perioden som arbeidssøker
              </Heading>
              <Heading level={'3'} size="medium">
		§ 11-18 AAP under behandling av søknad om uføretrygd
              </Heading>
              <FormField form={form} formField={formFields.overgangBegrunnelse} horizontalRadio />
              <FormField form={form} formField={formFields.vurderAAPIOvergangTilUføre} horizontalRadio />
              <FormField form={form} formField={formFields.vurderAAPIOvergangTilArbeid} horizontalRadio />
            </section>
          )}
	*/}
      </Form>
    </VilkårsKort>
  );
};
