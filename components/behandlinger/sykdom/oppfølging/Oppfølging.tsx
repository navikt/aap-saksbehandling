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

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: BistandsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
}

export const Oppfølging = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om innbygger har behov for oppfølging',
        description:
          'Beskriv oppfølgingsbehov, behovet for arbeidsrettet oppfølging og vurdering om det er en mulighet for å komme tilbake i arbeid og eventuell annen oppfølging fra nav',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om innbygger har behov for oppfølging' },
      },
      erBehovForAktivBehandling: {
        type: 'radio',
        label: 'a: Har innbygger behov for aktiv behandling?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAktivBehandling),
        rules: { required: 'Du må svare på om innbygger har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      erBehovForArbeidsrettetTiltak: {
        type: 'radio',
        label: 'b: Har innbygger behov for arbeidsrettet tiltak?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForArbeidsrettetTiltak),
        rules: { required: 'Du må svare på om innbygger har behov for arbeidsrettet tiltak' },
      },
      erBehovForAnnenOppfølging: {
        type: 'radio',
        label:
          'c: Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAnnenOppfølging),
        rules: { required: 'Du må svare på om innbygger anses for å ha en viss mulighet til å komme i arbeid' },
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
      heading="Behov for oppfølging § 11-6"
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
              innbygger oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav
              a (aktiv behandling) og bokstav b (arbeidsrettet tiltak) er oppfylte. Hvis du svarer ja på ett eller begge
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
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
        <FormField form={form} formField={formFields.erBehovForAktivBehandling} horizontalRadio />
        <FormField form={form} formField={formFields.erBehovForArbeidsrettetTiltak} horizontalRadio />
        {form.watch('erBehovForAktivBehandling') !== JaEllerNei.Ja &&
          form.watch('erBehovForArbeidsrettetTiltak') !== JaEllerNei.Ja && (
            <FormField form={form} formField={formFields.erBehovForAnnenOppfølging} horizontalRadio />
          )}
      </Form>
    </VilkårsKort>
  );
};
