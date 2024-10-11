'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HospitalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FormEvent } from 'react';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
  jaNeiEllerUndefinedToNullableBoolean,
} from 'lib/utils/form';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/etannetsted/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  harFasteUtgifter: JaEllerNei;
  forsoergerEktefelle: JaEllerNei;
  faarFriKostOgLosji: JaEllerNei;
}

export const Helseinstitusjonsvurdering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
        defaultValue: grunnlag?.helseinstitusjonGrunnlag?.begrunnelse,
        rules: { required: 'Du må begrunne vurderingen din' },
      },
      forsoergerEktefelle: {
        type: 'radio',
        label: 'Forsørger søker ektefelle eller tilsvarende?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.helseinstitusjonGrunnlag?.forsoergerEktefelle),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker forsørger ektefelle eller tilsvarende' },
      },
      harFasteUtgifter: {
        type: 'radio',
        label: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.helseinstitusjonGrunnlag?.harFasteUtgifter),
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om søker har faste utgifter nødvendig for å beholde bolig og andre eiendeler',
        },
      },
      faarFriKostOgLosji: {
        type: 'radio',
        label: 'Får søker fri kost og losji?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.helseinstitusjonGrunnlag?.faarFriKostOgLosji),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker får fri kost og losji' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
          // @ts-ignore TODO Fiks når backend er fikset
          helseinstitusjonVurdering: {
            begrunnelse: data.begrunnelse,
            faarFriKostOgLosji: data.faarFriKostOgLosji === JaEllerNei.Ja,
            forsoergerEktefelle: jaNeiEllerUndefinedToNullableBoolean(data.forsoergerEktefelle),
            harFasteUtgifter: jaNeiEllerUndefinedToNullableBoolean(data.harFasteUtgifter),
            periode: {
              fom: '',
              tom: '',
            },
          },
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
          instutisjonsopphold={grunnlag.helseinstitusjonOpphold}
        />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.forsoergerEktefelle} />
        <FormField form={form} formField={formFields.harFasteUtgifter} />
        {visFaarFriKostOgLosji && <FormField form={form} formField={formFields.faarFriKostOgLosji} />}
        <Alert variant={'info'}>
          <Heading size={'small'}>Institusjonsoppholdet kan medføre redusert ytelse fra dd.mm.yyyy</Heading>
          <BodyShort>
            Innbygger vil få 50% reduksjon i ytelse fra og med dd.mm.yyyy hvis oppholdet vedvarer forbi denne datoen
          </BodyShort>
        </Alert>
      </Form>
    </VilkårsKort>
  );
};
