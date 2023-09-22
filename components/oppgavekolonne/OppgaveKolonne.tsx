'use client';

import { Alert, BodyShort, Button, Label, ReadMore } from '@navikt/ds-react';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { løsBehov } from 'lib/api';
import { useForm } from 'react-hook-form';
import { useConfigForm } from '../../hooks/FormHook';
import { FormField } from '../input/formfield/FormField';
import { VilkårsKort } from '../vilkårskort/VilkårsKort';
import { Buldings2Icon, VitalsIcon } from '@navikt/aksel-icons';

import styles from './OppgaveKolonne.module.css';
import { Dokument, SykdomsGrunnlag } from 'lib/types/types';

enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

interface Props {
  className: string;
  sykdomsGrunnlag?: SykdomsGrunnlag;
  behandlingsReferanse: string;
}

const dokumenter: Dokument[] = [
  {
    journalpostId: '123',
    dokumentId: '123',
    tittel: 'Tittel',
    åpnet: new Date(),
    erTilknyttet: false,
  },
];

interface FormFields {
  yrkesskade_dokumentasjonMangler: string[];
  yrkesskade_årssakssammenheng: string;
  yrkesskade_begrunnelse: string;
  yrkesskade_dato: string;
  arbeidsevne_dokumentasjonMangler: string[];
  arbeidsevne_erSykdom: string;
  arbeidsevne_nedsattMinst50: string;
  arbeidsevne_begrunnelse: string;
  arbeidsevne_dato: string;
}

export const OppgaveKolonne = ({ className, sykdomsGrunnlag, behandlingsReferanse }: Props) => {
  const form = useForm<FormFields>();
  const { formFields } = useConfigForm<FormFields>({
    yrkesskade_dokumentasjonMangler: {
      type: 'checkbox',
      label: 'Dokumentasjon mangler',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    },
    yrkesskade_årssakssammenheng: {
      type: 'radio',
      label: 'Er vilkåret (årssakssammenheng) i 11.22 oppfylt?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
    },
    yrkesskade_begrunnelse: {
      type: 'textarea',
      label: 'Vurder om yrkesskaden er medvirkende årsak til den nedsatte arbeidsevnen',
      description: 'Se eksempel på vilkårsvurderingstekst',
    },
    yrkesskade_dato: {
      type: 'date',
      label: 'Dato for skadetidspunkt for yrkesskaden',
    },
    arbeidsevne_dokumentasjonMangler: {
      type: 'checkbox',
      label: 'Dokumentasjon mangler',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    },
    arbeidsevne_erSykdom: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som fører til nedsatt arbeidsevne?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
    },
    arbeidsevne_nedsattMinst50: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 50%?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
    },
    arbeidsevne_begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description:
        'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige. Hvorfor vurderes nedsatt arbeidsevne med minst 50%?',
    },
    arbeidsevne_dato: {
      type: 'date',
      label: 'Dato for nedsatt arbeidsevne med minst 50%',
    },
  });

  return (
    <div className={className}>
      <form
        className={styles.form}
        onSubmit={form.handleSubmit(async (data) => {
          console.log('løser behov', data);
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              begrunnelse: data.begrunnelse,
              // @ts-ignore Feil generert type i backend
              endretAv: '',
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <VilkårsKort heading={'Yrkesskade - § 11.22'} icon={<Buldings2Icon />}>
          <Alert variant="warning">Vi har funnet en eller flere registrerte yrkesskader</Alert>
          <div>
            <Label as="p" spacing>
              Har søker oppgitt at de har en yrkesskade i søknaden?
            </Label>
            <BodyShort>{sykdomsGrunnlag?.opplysninger.oppgittYrkesskadeISøknad ? 'Ja' : 'Nei'}</BodyShort>
          </div>
          <div>
            <Label as="p" spacing>
              Saksopplysninger
            </Label>
            {sykdomsGrunnlag?.opplysninger.innhentedeYrkesskader.map((innhentetYrkesskade) => (
              <div key={innhentetYrkesskade.ref}>
                <BodyShort spacing>{innhentetYrkesskade.kilde}</BodyShort>
                <BodyShort spacing>Periode: {innhentetYrkesskade.periode}</BodyShort>
              </div>
            ))}
            {sykdomsGrunnlag?.opplysninger.innhentedeYrkesskader.length === 0 && (
              <BodyShort>Ingen innhentede yrkesskader</BodyShort>
            )}
          </div>
        </VilkårsKort>
        <VilkårsKort heading={'Yrkesskade - årsakssammenheng § 11.22'} icon={<Buldings2Icon />}>
          <div>
            <Label as="p" spacing>
              Dokumenter funnet som er relevante for vurdering av årsakssammenheng § 11.22
            </Label>
            <BodyShort>Les dokumentene og tilknytt minst ett dokument til 11.22 vurderingen</BodyShort>
          </div>
          <DokumentTabell dokumenter={dokumenter} onTilknyttetClick={() => {}} onVedleggClick={() => {}} />

          <FormField form={form} formField={formFields.yrkesskade_dokumentasjonMangler} />

          <FormField form={form} formField={formFields.yrkesskade_årssakssammenheng} />

          <ReadMore header="Slik vurderes vilkåret">
            <BodyShort spacing>Søker må ha søkt om...</BodyShort>
          </ReadMore>

          <FormField form={form} formField={formFields.yrkesskade_begrunnelse} />

          <FormField form={form} formField={formFields.yrkesskade_dato} />
        </VilkårsKort>

        <VilkårsKort heading={'Nedsatt arbeidsevne - § 11.5'} icon={<VitalsIcon />}>
          <Alert variant="warning">Legeerklæring er av gammel dato, vurder å be om en ny fra behandler</Alert>
          <div>
            <Label as="p" spacing>
              Registrert behandler
            </Label>
            <BodyShort>Fast Lege</BodyShort>
            <BodyShort>Lillegrensen Legesenter</BodyShort>
            <BodyShort>0123 Legeby, 815 493 00</BodyShort>
          </div>

          <FormField form={form} formField={formFields.arbeidsevne_dokumentasjonMangler} />

          <FormField form={form} formField={formFields.arbeidsevne_erSykdom} />

          <FormField form={form} formField={formFields.arbeidsevne_nedsattMinst50} />

          <FormField form={form} formField={formFields.arbeidsevne_begrunnelse} />

          <FormField form={form} formField={formFields.arbeidsevne_dato} />

          <Button>Lagre og gå til neste steg</Button>
        </VilkårsKort>
      </form>
    </div>
  );
};
