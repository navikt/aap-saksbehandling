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
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
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
      erBehovForAktivBehandling: {
        type: 'radio',
        label: 'Har innbygger behov for aktiv behandling?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAktivBehandling),
        rules: { required: 'Du må svare på om innbygger har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      erBehovForArbeidsrettetTiltak: {
        type: 'radio',
        label: 'Har innbygger behov for arbeidsrettet tiltak?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForArbeidsrettetTiltak),
        rules: { required: 'Du må svare på om innbygger har behov for arbeidsrettet tiltak' },
      },
      erBehovForAnnenOppfølging: {
        type: 'radio',
        label: 'Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAnnenOppfølging),
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
        <section>
          <FormField form={form} formField={formFields.erBehovForAktivBehandling} />
          <Veiledning
            defaultOpen={false}
            header={'Slik vurderes dette'}
            tekst={
              <div>
                <BodyLong spacing size={'small'}>
                  Med aktiv behandling menes behandling som behandlende lege anbefaler medlemmet å gjennomføre med mål
                  om å bedre arbeidsevnen. Behandling kan gis av for eksempel lege, psykolog, fysioterapeut,
                  kiropraktorer, manuell terapeut mv. Det er en forutsetning at behandlingen er et ledd i en medisinsk
                  behandlingsplan for å bedre arbeidsevnen.
                </BodyLong>
                <BodyLong spacing size={'small'}>
                  Det er ikke et vilkår at det foregår uavbrutte behandlingstiltak. Behandlingen kan variere fra
                  operative inngrep med innleggelse i helseinstitusjon til kortere, mer passive perioder med rekreasjon.
                </BodyLong>
                <BodyLong spacing size={'small'}>
                  Det må også alltid vurderes om det er andre og mer aktive tiltak som er mer hensiktsmessige for å
                  bedre arbeidsevnen
                </BodyLong>
              </div>
            }
          />
        </section>
        <section>
          <FormField form={form} formField={formFields.erBehovForArbeidsrettetTiltak} />
          <Veiledning
            header={'Slik vurderes dette'}
            defaultOpen={false}
            tekst={
              <div>
                <BodyLong size={'small'} spacing>
                  Med et arbeidsrettet tiltak etter folketrygdloven § 11-6 menes
                </BodyLong>
                <BodyLong size={'small'} spacing>
                  a.tiltak etter forskrift 11. desember 2015 nr. 1598 om arbeidsmarkedstiltak (tiltaksforskriften), med
                  unntak av varig tilrettelagt arbeid i forskriften kapittel 14,b.etablering av egen virksomhet, se
                  folketrygdloven § 11-15, ogc.andre aktiviteter i regi av offentlige eller private virksomheter,
                  herunder frivillige aktører, som er egnet til å styrke medlemmets mulighet for overgang til arbeid.
                </BodyLong>
                <BodyLong size={'small'} spacing>
                  Forsøk med hjemmel i § 12 i lov om arbeidsmarkedstjenester (arbeidsmarkedsloven) kan anses som et
                  arbeidsrettet tiltak, dersom det framgår av forskriften at deltakeren har rett på
                  arbeidsavklaringspenger
                </BodyLong>
              </div>
            }
          />
        </section>

        {form.watch('erBehovForAktivBehandling') === JaEllerNei.Nei &&
          form.watch('erBehovForArbeidsrettetTiltak') === JaEllerNei.Nei && (
            <FormField form={form} formField={formFields.erBehovForAnnenOppfølging} />
          )}
      </Form>
    </VilkårsKort>
  );
};
