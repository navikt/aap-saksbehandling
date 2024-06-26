'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { BooksIcon } from '@navikt/aksel-icons';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNeiOptions } from 'lib/utils/form';
import { getHeaderForSteg, mapStegTypeTilDetaljertSteg } from 'lib/utils/steg';
import { StudentGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { BodyShort, Label } from '@navikt/ds-react';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';

interface Props {
  behandlingVersjon: number;
  grunnlag?: StudentGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  harAvbruttStudie: string;
  godkjentStudie: string;
  avbruttPgaSykdomSkade: string;
  harBehovForBehandling: string;
  avbruttDato: string;
  forventetGjenopptatt: string;
  avbruddMerEnn6Mnd: string;
  dokumenterBruktIVurderingen: string[];
}

export const Student = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        description: 'Begrunn vurderingen',
        label: 'Vurder §11-14 og vilkårene i §7 i forskriften',
        defaultValue: grunnlag?.studentvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne vurderingen.' },
      },
      harAvbruttStudie: {
        type: 'radio',
        label: 'Har søker avbrutt et studie?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker har avbrutt studie.' },
      },
      godkjentStudie: {
        type: 'radio',
        label: 'Er studiet godkjent av Lånekassen?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om studiet er godkjent av Lånekassen.' },
      },
      avbruttPgaSykdomSkade: {
        type: 'radio',
        label: 'Er studie avbrutt pga sykdom eller skade?',
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om søker har avbrutt studie på grunn av sykdom eller skade.',
        },
      },
      harBehovForBehandling: {
        type: 'radio',
        label: 'Har bruker behov for behandling for å gjenoppta studiet?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker har behov for behandling for å gjenoppta studiet.' },
      },
      avbruttDato: {
        type: 'date',
        label: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?',
        rules: { required: 'Du må svare på når studieevnen ble 100% nedsatt, eller når studiet ble avbrutt.' },
      },
      forventetGjenopptatt: {
        type: 'radio',
        label: 'Er det forventet at søker skal gjenoppta studiet?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om det er forventet at søker skal gjenoppta studiet.' },
      },
      avbruddMerEnn6Mnd: {
        type: 'radio',
        label: 'Er avbruddet forventet å vare mer enn 6 mnd?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.' },
      },
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevante for vurdering av student §11-14',
        description: 'Les dokumentene og tilknytt minst ett dokument til 11-14 vurderingen.',
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_STUDENT_KODE,
          studentvurdering: {
            begrunnelse: data.begrunnelse,
            oppfyller11_14: false, // Legger inn at den ikke er oppfylt slik at det ikke tryner foreløpig
            dokumenterBruktIVurdering: [],
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={getHeaderForSteg(mapStegTypeTilDetaljertSteg('AVKLAR_STUDENT'))}
      steg={'AVKLAR_STUDENT'}
      icon={<BooksIcon fontSize={'inherit'} />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_STUDENT'}
        visBekreftKnapp={!readOnly}
      >
        <div>
          <Label>Har søker oppgitt at hen har avbrutt studiet helt pga sykdom?</Label>
          <BodyShort>{getJaNeiEllerUndefined(grunnlag?.oppgittStudent?.harAvbruttStudie)}</BodyShort>
        </div>

        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <FormField form={form} formField={formFields.begrunnelse} />
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        <FormField form={form} formField={formFields.harAvbruttStudie} />
        <FormField form={form} formField={formFields.godkjentStudie} />
        <FormField form={form} formField={formFields.avbruttPgaSykdomSkade} />
        <FormField form={form} formField={formFields.harBehovForBehandling} />
        <FormField form={form} formField={formFields.forventetGjenopptatt} />
        <FormField form={form} formField={formFields.avbruttDato} />
        <FormField form={form} formField={formFields.avbruddMerEnn6Mnd} />
      </Form>
    </VilkårsKort>
  );
};
