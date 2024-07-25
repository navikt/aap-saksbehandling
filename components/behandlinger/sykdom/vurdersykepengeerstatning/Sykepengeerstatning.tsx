'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FigureIcon } from '@navikt/aksel-icons';
import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Veiledning } from 'components/veiledning/Veiledning';
import { SykepengeerstatningGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  grunnlag?: SykepengeerstatningGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
  erOppfylt: string;
  grunn: string[];
}

export const Sykepengeerstatning = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('VURDER_SYKEPENGEERSTATNING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevant for vurdering av §11-13',
        description: 'Tilknytt minst ett dokument til vurdering',
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om søker har rett til sykepengeerstatning',
        rules: { required: 'Du må begrunne avgjørelsen din.' },
        defaultValue: grunnlag?.vurdering?.begrunnelse,
      },
      erOppfylt: {
        type: 'radio',
        label: 'Krav på sykepengeerstatning?',
        rules: { required: 'Du må ta stilling til om søkeren har rett på AAP som sykepengeerstatning.' },
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harRettPå),
      },
      grunn: {
        type: 'checkbox',
        label: 'Velg minst en grunn',
        rules: { required: 'Du må velge minst en grunn' },
        options: [
          'Medlemmet har tidligere mottatt arbeidsavklaringspenger og innen seks måneder etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av en annen sykdom',
          'Medlemmet har tidligere mottatt arbeidsavklaringspenger og innen ett år etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av samme sykdom',
          'Medlemmet har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og igjen blir arbeidsufør på grunn av sykdom eller skade mens han eller hun er i arbeid',
          'Medlemmet har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og fortsatt er arbeidsufør på grunn av sykdom eller skade',
          'Medlemmet har mottatt arbeidsavklaringspenger og deretter foreldrepenger og innen seks måneder etter foreldrepengene opphørte, blir arbeidsufør på grunn av sykdom eller skade, se § 8-2 andre ledd',
        ],
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_SYKEPENGEERSTATNING_KODE,
          sykepengeerstatningVurdering: {
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            harRettPå: data.erOppfylt === JaEllerNei.Ja,
          },
        },
        referanse: behandlingsReferanse,
      })
    )(event);
  };

  return (
    <VilkårsKort heading={'Sykepengeerstatning § 11-13'} steg="VURDER_SYKEPENGEERSTATNING" icon={<FigureIcon />}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'VURDER_SYKEPENGEERSTATNING'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erOppfylt} />
        {form.watch('erOppfylt') === JaEllerNei.Ja && <FormField form={form} formField={formFields.grunn} />}
      </Form>
    </VilkårsKort>
  );
};
