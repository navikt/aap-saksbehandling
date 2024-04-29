'use client';

import { PersonGroupIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { BistandsGrunnlag } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  grunnlag?: BistandsGrunnlag;
}

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
  vilkårOppfylt: string;
  grunner: string[];
}

export const Oppfølging = ({ behandlingsReferanse, grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

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
          'Behov for aktiv behandling',
          'Behov for arbeidsrettet tiltak',
          'Etter å ha prøvd tiltakene etter bokstav a eller b fortsatt anses for å ha en viss mulighet for å komme i arbeid, og får annen oppfølging fra Arbeids- og velferdsetaten',
        ],
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: 0,
        behov: {
          behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
          bistandsVurdering: {
            begrunnelse: data.begrunnelse,
            erBehovForBistand: data.vilkårOppfylt === JaEllerNei.Ja,
          },
        },
        referanse: behandlingsReferanse,
      })
    )(event);
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
