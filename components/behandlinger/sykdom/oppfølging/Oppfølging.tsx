'use client';

import { PersonGroupIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { BistandsGrunnlag } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useEffect } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: BistandsGrunnlag;
}

enum GrunnerTilBehovForOppfølging {
  ARBEIDSRETTET_TILTAK = 'Behov for aktiv behandling',
  AKTIV_BEHANDLING = 'Behov for arbeidsrettet tiltak',
  ANNEN_OPPFØLGING = 'Etter å ha prøvd tiltakene etter bokstav a eller b fortsatt anses for å ha en viss mulighet for å komme i arbeid, og får annen oppfølging fra Arbeids- og velferdsetaten',
}

type GrunnerTilBehovForOppfølgingApi = 'ARBEIDSRETTET_TILTAK' | 'AKTIV_BEHANDLING' | 'ANNEN_OPPFØLGING';
interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
  vilkårOppfylt: string;
  grunner: GrunnerTilBehovForOppfølging[];
  // grunner: (
  //   | GrunnerTilBehovForOppfølging.AKTIV_BEHANDLING
  //   | GrunnerTilBehovForOppfølging.ARBEIDSRETTET_TILTAK
  //   | GrunnerTilBehovForOppfølging.ANNEN_OPPFØLGING
  // )[];
}

const grunnerErrorMessage = 'Bokstav C kan ikke velges i kombinasjon med bokstav A eller B';

function mapValueToKeyGrunnerTilBehovForOppfølging(
  val:
    | GrunnerTilBehovForOppfølging.AKTIV_BEHANDLING
    | GrunnerTilBehovForOppfølging.ARBEIDSRETTET_TILTAK
    | GrunnerTilBehovForOppfølging.ANNEN_OPPFØLGING
): GrunnerTilBehovForOppfølgingApi {
  if (val === GrunnerTilBehovForOppfølging.ARBEIDSRETTET_TILTAK) return 'ARBEIDSRETTET_TILTAK';
  if (val === GrunnerTilBehovForOppfølging.AKTIV_BEHANDLING) return 'AKTIV_BEHANDLING';
  // GrunnerTilBehovForOppfølging.ANNEN_OPPFØLGING:
  return 'ANNEN_OPPFØLGING';
}
function mapKeyToValueGrunnerTilBehovForOppfølging(key: GrunnerTilBehovForOppfølgingApi) {
  if (key === 'ARBEIDSRETTET_TILTAK') return GrunnerTilBehovForOppfølging.ARBEIDSRETTET_TILTAK;
  if (key === 'AKTIV_BEHANDLING') return GrunnerTilBehovForOppfølging.AKTIV_BEHANDLING;
  //'ANNEN_OPPFØLGING':
  return GrunnerTilBehovForOppfølging.ANNEN_OPPFØLGING;
}
export const Oppfølging = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');
  function validateGrunner(grunner: string[]) {
    // skal inneholde enten bokstavA og/eller bokstavB, eller kun bokstavC
    if (grunner?.includes(GrunnerTilBehovForOppfølging.ANNEN_OPPFØLGING)) return grunner?.length === 1;
    return true;
  }
  const defaultGrunner: GrunnerTilBehovForOppfølging[] = (grunnlag?.vurdering?.grunnerTilBehovForBistand || []).map(
    (key) => mapKeyToValueGrunnerTilBehovForOppfølging(key)
  );
  const { formFields, form } = useConfigForm<FormFields>(
    {
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevant for vurdering av §11-6',
        description: 'Tilknytt minst ett dokument som er relevant for vurderingen av §11-6',
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om søker har behov for oppfølging',
        description:
          'Beskriv oppfølgingsbehov, behovet for arbeidsrettet oppfølging og vurdering om det er en mulighet for å komme tilbake i arbeid og eventuell annen oppfølging fra nav',
        defaultValue: grunnlag?.vurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      vilkårOppfylt: {
        type: 'radio',
        label: 'Er vilkårene i § 11-6 oppfylt?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForBistand),
        rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
        options: JaEllerNeiOptions,
      },
      grunner: {
        type: 'checkbox',
        label: 'Velg minst én grunn for at § 11-6 er oppfylt',
        options: [
          GrunnerTilBehovForOppfølging.AKTIV_BEHANDLING,
          GrunnerTilBehovForOppfølging.ARBEIDSRETTET_TILTAK,
          GrunnerTilBehovForOppfølging.ANNEN_OPPFØLGING,
        ],
        defaultValue: defaultGrunner,
        rules: { validate: (val) => (validateGrunner(val as string[]) ? true : grunnerErrorMessage) },
      },
    },
    { readOnly: readOnly }
  );
  const oppfølgingsGrunner = form.watch('grunner');
  useEffect(() => {
    if (oppfølgingsGrunner?.length && !validateGrunner(oppfølgingsGrunner)) {
      form.setError('grunner', { message: grunnerErrorMessage });
    } else {
      form.clearErrors();
    }
  }, [oppfølgingsGrunner, form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const grunnerTilBehovForBistand: GrunnerTilBehovForOppfølgingApi[] = data.grunner.map(
        mapValueToKeyGrunnerTilBehovForOppfølging
      );
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
          bistandsVurdering: {
            begrunnelse: data.begrunnelse,
            erBehovForBistand: data.vilkårOppfylt === JaEllerNei.Ja,
            grunnerTilBehovForBistand,
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
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.vilkårOppfylt} />
        {form.watch('vilkårOppfylt') === JaEllerNei.Ja && <FormField form={form} formField={formFields.grunner} />}
      </Form>
    </VilkårsKort>
  );
};
