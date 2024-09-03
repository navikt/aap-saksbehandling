'use client';

import { PersonGroupIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { BistandsGrunnlag } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { BodyLong } from '@navikt/ds-react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: BistandsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  behovForAktivBehandling: string;
  behovForArbeidsrettetTiltak: string;
  harMulighetTilÅKommeIArbeid?: string;
}

export const Oppfølging = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

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
      behovForAktivBehandling: {
        type: 'radio',
        label: 'Har innbygger behov for aktiv behandling?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForBistand),
        rules: { required: 'Du må svare på om innbygger har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      behovForArbeidsrettetTiltak: {
        type: 'radio',
        label: 'Har innbygger behov for arbeidsrettet tiltak?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(undefined),
        rules: { required: 'Du må svare på om innbygger har behov for arbeidsrettet tiltak' },
      },
      harMulighetTilÅKommeIArbeid: {
        type: 'radio',
        label: 'Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(undefined),
        rules: { required: 'Du må svare på om innbygger anses for å ha en viss mulighet til å komme i arbeid' },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      console.log(data);
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
          // @ts-ignore TODO Legg til korrekt vurdering når backend er ferdig
          bistandsVurdering: {},
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading="Behov for oppfølging § 11-6"
      steg="VURDER_BISTANDSBEHOV"
      icon={<PersonGroupIcon />}
      vilkårTilhørerNavKontor={true}
    >
      <Form
        steg="VURDER_BISTANDSBEHOV"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.behovForAktivBehandling} />
        <Veiledning />
        <FormField form={form} formField={formFields.behovForArbeidsrettetTiltak} />
        <Veiledning
          header={'Slik vurderes dette'}
          tekst={
            <div>
              <BodyLong size={'small'} spacing>
                Med et arbeidsrettet tiltak etter folketrygdloven § 11-6 menes
              </BodyLong>
              <BodyLong size={'small'} spacing>
                a.tiltak etter forskrift 11. desember 2015 nr. 1598 om arbeidsmarkedstiltak (tiltaksforskriften), med
                unntak av varig tilrettelagt arbeid i forskriften kapittel 14,b.etablering av egen virksomhet, se
                folketrygdloven § 11-15, ogc.andre aktiviteter i regi av offentlige eller private virksomheter, herunder
                frivillige aktører, som er egnet til å styrke medlemmets mulighet for overgang til arbeid.
              </BodyLong>
              <BodyLong size={'small'} spacing>
                Forsøk med hjemmel i § 12 i lov om arbeidsmarkedstjenester (arbeidsmarkedsloven) kan anses som et
                arbeidsrettet tiltak, dersom det framgår av forskriften at deltakeren har rett på
                arbeidsavklaringspenger
              </BodyLong>
            </div>
          }
        />

        {form.watch('behovForAktivBehandling') === JaEllerNei.Nei &&
          form.watch('behovForArbeidsrettetTiltak') === JaEllerNei.Nei && (
            <FormField form={form} formField={formFields.harMulighetTilÅKommeIArbeid} />
          )}
      </Form>
    </VilkårsKort>
  );
};
