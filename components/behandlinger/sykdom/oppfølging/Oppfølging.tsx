import { PersonGroupIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { JaEllerNei } from 'lib/utils/form';

interface FormFields {
  begrunnelse: string;
  vilkårOppfylt: string;
  grunner: string[];
}

export const Oppfølging = () => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om søker har behov for oppfølging',
      description:
        'Beskriv oppfølgingsbehov, behovet for arbeidsrettet oppfølging og vurdering om det er en mulighet for å komme tilbake i arbeid og eventuell annen oppfølging fra nav',
    },
    vilkårOppfylt: {
      type: 'radio',
      label: 'Er vilkårene i § 11-6 oppfylt?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
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
  });
  return (
    <VilkårsKort heading="Behov for oppfølging § 11-6" icon={<PersonGroupIcon />}>
      <Form steg="VURDER_BISTANDSBEHOV" onSubmit={() => {}}>
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.vilkårOppfylt} />
        {form.watch('vilkårOppfylt') === JaEllerNei.Ja && <FormField form={form} formField={formFields.grunner} />}
      </Form>
    </VilkårsKort>
  );
};
