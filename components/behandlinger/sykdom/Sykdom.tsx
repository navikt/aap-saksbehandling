'use client';

import { Buldings2Icon, VitalsIcon } from '@navikt/aksel-icons';
import { Alert, Label, BodyShort, ReadMore } from '@navikt/ds-react';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { FormField } from 'components/input/formfield/FormField';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { format } from 'date-fns';
import { useConfigForm } from 'hooks/FormHook';
import { løsBehov } from 'lib/api';
import { Dokument, SykdomsGrunnlag } from 'lib/types/types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { JaEllerNei, getJaNeiEllerUndefined } from 'lib/utils/form';
import { stringToDate } from 'lib/utils/date';
import { Form } from '../Form';
import { useParams, useRouter } from 'next/navigation';

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
  yrkesskade_dato: Date;
  arbeidsevne_dokumentasjonMangler: string[];
  arbeidsevne_erSykdom: string;
  arbeidsevne_nedsattMinst50: string;
  arbeidsevne_nedsattMinst30: string;
  arbeidsevne_begrunnelse: string;
  arbeidsevne_dato: Date;
}

export const Sykdom = ({
  sykdomsGrunnlag,
  behandlingsReferanse,
}: {
  sykdomsGrunnlag?: SykdomsGrunnlag;
  behandlingsReferanse: string;
}) => {
  const router = useRouter();
  const params = useParams();

  const form = useForm<FormFields>({
    defaultValues: {
      yrkesskade_begrunnelse: sykdomsGrunnlag?.yrkesskadevurdering?.begrunnelse,
      arbeidsevne_begrunnelse: sykdomsGrunnlag?.sykdomsvurdering?.begrunnelse,
      yrkesskade_årssakssammenheng: getJaNeiEllerUndefined(sykdomsGrunnlag?.yrkesskadevurdering?.erÅrsakssammenheng),
      arbeidsevne_erSykdom: getJaNeiEllerUndefined(
        sykdomsGrunnlag?.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel
      ),
      arbeidsevne_nedsattMinst50: getJaNeiEllerUndefined(
        sykdomsGrunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
      ),
      yrkesskade_dato: stringToDate(sykdomsGrunnlag?.yrkesskadevurdering?.skadetidspunkt),
      arbeidsevne_dato: stringToDate(sykdomsGrunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato),
    },
  });
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
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    yrkesskade_begrunnelse: {
      type: 'textarea',
      label: 'Vurder om yrkesskaden er medvirkende årsak til den nedsatte arbeidsevnen',
      description: 'Se eksempel på vilkårsvurderingstekst',
      rules: { required: 'Du må begrunne' },
    },
    yrkesskade_dato: {
      type: 'date',
      label: 'Dato for skadetidspunkt for yrkesskaden',
      rules: {
        validate: {
          required: (value) => {
            if (!value && form.getValues('yrkesskade_årssakssammenheng') === JaEllerNei.Ja) {
              return 'Du må sette en dato for skadetidspunktet';
            }
          },
        },
      },
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
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    arbeidsevne_nedsattMinst50: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 50%?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: {
        validate: {
          required: (value) => {
            if (!value && form.getValues('yrkesskade_årssakssammenheng') === JaEllerNei.Nei) {
              return 'Du må svare på om arbeidsevnen er nedsatt med minst 50%';
            }
          },
        },
      },
    },
    arbeidsevne_nedsattMinst30: {
      type: 'radio',
      label: 'Er arbeidsevnen nedsatt med minst 30%?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: {
        validate: {
          required: (value) => {
            if (!value && form.getValues('yrkesskade_årssakssammenheng') === JaEllerNei.Ja) {
              return 'Du må svare på om arbeidsevnen er nedsatt med minst 30%';
            }
          },
        },
      },
    },
    arbeidsevne_begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description:
        'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige. Hvorfor vurderes nedsatt arbeidsevne med minst 50%?',
      rules: { required: 'Du må begrunne' },
    },
    arbeidsevne_dato: {
      type: 'date',
      label: 'Dato for nedsatt arbeidsevne',
      rules: {
        validate: {
          required: (value) => {
            if (
              (!value && form.getValues('arbeidsevne_nedsattMinst50') === JaEllerNei.Ja) ||
              form.getValues('arbeidsevne_nedsattMinst30') === JaEllerNei.Ja
            ) {
              return 'Du må svare på når arbeidsevnen ble nedsatt';
            }
          },
        },
      },
    },
  });

  useEffect(() => {
    form.reset();
  }, [form, sykdomsGrunnlag]);

  // TODO: Gjøre mer generisk, kjøre som onClick på alle steg
  const listenSSE = () => {
    const eventSource = new EventSource(`/api/behandling/hent/${behandlingsReferanse}/AVKLAR_SYKDOM/nesteSteg/`, {
      withCredentials: true,
    });
    console.log('Lytter på SSE', eventSource);
    eventSource.onmessage = (event: any) => {
      console.log('event onMessage', event);
      router.push(`/sak/${params.saksId}/${params.behandlingsReferanse}/${event.data}`);
      eventSource.close();
    };
    eventSource.onerror = (event: any) => {
      console.log('event onError', event);
    };
  };

  return (
    <Form
      onSubmit={form.handleSubmit(async (data) => {
        console.log('løser behov', data);
        await løsBehov({
          behandlingVersjon: 0,
          behov: {
            // @ts-ignore Feil generert type i backend
            '@type': '5001',
            // @ts-ignore Feil generert type i backend
            yrkesskadevurdering: {
              begrunnelse: data.yrkesskade_begrunnelse,
              dokumenterBruktIVurdering: [],
              erÅrsakssammenheng: data.yrkesskade_årssakssammenheng === JaEllerNei.Ja,
              // skadetidspunkt: format(new Date(data.yrkesskade_dato), 'yyyy-MM-dd'),
              skadetidspunkt: format(data.yrkesskade_dato, 'yyyy-MM-dd'),
            },
            // @ts-ignore Feil generert type i backend
            sykdomsvurdering: {
              begrunnelse: data.arbeidsevne_begrunnelse,
              dokumenterBruktIVurdering: [],
              erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.arbeidsevne_nedsattMinst50 === JaEllerNei.Ja,
              erSkadeSykdomEllerLyteVesentligdel: data.arbeidsevne_erSykdom === JaEllerNei.Ja,
              nedreGrense: data.yrkesskade_årssakssammenheng === JaEllerNei.Ja ? 'TRETTI' : 'FEMTI',
              nedsattArbeidsevneDato: format(new Date(data.arbeidsevne_dato), 'yyyy-MM-dd'),
            },
          },
          referanse: behandlingsReferanse,
        });

        listenSSE();

        //const flyt = await hentFlyt(behandlingsReferanse);

        // TODO: Lytte på endringer i backend og redirecte til neste steg
        //router.push(`/sak/${params.saksId}/${params.behandlingsReferanse}/${flyt?.aktivtSteg}`);
      })}
    >
      <VilkårsKort heading={'Yrkesskade - § 11-22'} icon={<Buldings2Icon />}>
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
              <Label as="p" spacing>
                Periode
              </Label>
              <BodyShort spacing>Fra: {format(new Date(innhentetYrkesskade.periode.fom), 'dd.MM.yyyy')}</BodyShort>
              <BodyShort spacing>Til: {format(new Date(innhentetYrkesskade.periode.tom), 'dd.MM.yyyy')}</BodyShort>
            </div>
          ))}
          {sykdomsGrunnlag?.opplysninger.innhentedeYrkesskader.length === 0 && (
            <BodyShort>Ingen innhentede yrkesskader</BodyShort>
          )}
        </div>
      </VilkårsKort>
      <VilkårsKort heading={'Yrkesskade - årsakssammenheng § 11-22'} icon={<Buldings2Icon />}>
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

        {form.watch('yrkesskade_årssakssammenheng') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.yrkesskade_dato} />
        )}
      </VilkårsKort>

      <VilkårsKort heading={'Nedsatt arbeidsevne - § 11-5'} icon={<VitalsIcon />}>
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

        {form.watch('yrkesskade_årssakssammenheng') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.arbeidsevne_nedsattMinst30} />
        )}
        {form.watch('yrkesskade_årssakssammenheng') === JaEllerNei.Nei && (
          <FormField form={form} formField={formFields.arbeidsevne_nedsattMinst50} />
        )}

        <FormField form={form} formField={formFields.arbeidsevne_begrunnelse} />

        {(form.watch('arbeidsevne_nedsattMinst50') === JaEllerNei.Ja ||
          form.watch('arbeidsevne_nedsattMinst30') === JaEllerNei.Ja) && (
          <FormField form={form} formField={formFields.arbeidsevne_dato} />
        )}
      </VilkårsKort>
    </Form>
  );
};
