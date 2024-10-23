'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HospitalIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormEvent } from 'react';
import { Behovstype, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/etannetsted/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';

type Props = {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
};

interface FormFields {
  begrunnelse: string;
  faarFriKostOgLosji: JaEllerNei;
  forsoergerEktefelle: JaEllerNei;
  harFasteUtgifter: JaEllerNei;
}

export const Helseinstitusjonsvurdering = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
        rules: { required: 'Du må begrunne vurderingen din' },
      },
      forsoergerEktefelle: {
        type: 'radio',
        label: 'Forsørger søker ektefelle eller tilsvarende?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker forsørger ektefelle eller tilsvarende' },
      },
      harFasteUtgifter: {
        type: 'radio',
        label: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om søker har faste utgifter nødvendig for å beholde bolig og andre eiendeler',
        },
      },
      faarFriKostOgLosji: {
        type: 'radio',
        label: 'Får søker fri kost og losji?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker får fri kost og losji' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      console.log(data);
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
          //@ts-ignore Fiks denne når backend er klar
          helseinstitusjonVurdering: {},
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  const visFaarFriKostOgLosji =
    form.watch('harFasteUtgifter') === JaEllerNei.Nei && form.watch('forsoergerEktefelle') === JaEllerNei.Nei;

  return (
    <VilkårsKort heading={'Helseinstitusjon § 11-25'} steg={'DU_ER_ET_ANNET_STED'} icon={<HospitalIcon />}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_STUDENT'}
        visBekreftKnapp={!readOnly}
      >
        <InstitusjonsoppholdTabell
          label={'Søker har følgende institusjonsopphold på helseinstitusjon'}
          beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP ytelse'}
          instutisjonsopphold={[]}
        />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.forsoergerEktefelle} />
        <FormField form={form} formField={formFields.harFasteUtgifter} />
        {visFaarFriKostOgLosji && <FormField form={form} formField={formFields.faarFriKostOgLosji} />}
      </Form>
    </VilkårsKort>
  );
};
