'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VitalsIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Label, List, ReadMore } from '@navikt/ds-react';
import { SykdomsGrunnlag } from 'lib/types/types';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';
import { stringToDate } from 'lib/utils/date';
import { SykdomsvurderingDto } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { useForm } from 'react-hook-form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erÅrsakssammenheng: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  skadetidspunkt: Date;
  andelAvNedsettelse: string;
  dokumenterBruktIVurderingen: string[];
  dokumentasjonMangler: string[];
}

export const SykdomsvurderingMedYrkesskade = ({ behandlingsReferanse, grunnlag }: Props) => {
  const form = useForm<FormFields>();
  const { formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description: 'Hvilken sykdom/skade/lyte? Hva er det mest vesentlige? Hvis yrkesskade er funnet: vurder mot YS',
      defaultValue: grunnlag.sykdomsvurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    erSkadeSykdomEllerLyteVesentligdel: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
      rules: {
        required: 'Du må svare på om det er sykdom, skade eller lyte som er medvirkende til nedsatt arbeidsevne.',
      },
    },
    erÅrsakssammenheng: {
      type: 'radio',
      label: 'Er yrkesskaden helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen? (§ 11-22 1.ledd).',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.erÅrsakssammenheng),
      rules: {
        required: 'Du må svare på om yrkesskaden er helt eller delvis medvirkende årsak til den nedsatte arbeidsevnen.',
      },
    },
    erNedsettelseIArbeidsevneHøyereEnnNedreGrense: {
      type: 'radio',
      label:
        form.watch('erÅrsakssammenheng') === JaEllerNei.Nei || !form.watch('erÅrsakssammenheng')
          ? 'Er arbeidsevnen nedsatt med minst 50%?'
          : 'Er arbeidsevnen nedsatt med minst 30%?',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
      rules: { required: 'Du må svare på om arbeidsevnen er nedsatt.' },
    },
    skadetidspunkt: {
      type: 'date',
      label: 'Dato for skadetidspunkt for yrkesskaden',
      defaultValue: stringToDate(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.skadetidspunkt),
      rules: {
        required: 'Du må sette en dato for skadetidspunktet',
      },
    },
    andelAvNedsettelse: {
      type: 'number',
      label: 'Hvor stor andel av den nedsatte arbeidsevnen er nedsatt på grunn av yrkesskaden?',
      description:
        'Eksempel: hvis den nedsatte arbeidsevnen er 50% og yrkesskade er hele årsaken til dette settes 100%',
      rules: {
        required: 'Du må sette en andel av den nedsatte arbeidsevnen som er nedsatt på grunn av yrkesskaden',
        validate: (value) => {
          const valueFromString = Number(value);
          if (valueFromString < 0 || valueFromString > 100) {
            return 'Verdien må være mellom 0 og 100';
          }
        },
      },
    },
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: '',
    },
    dokumentasjonMangler: {
      type: 'checkbox',
      label: '',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    },
  });

  const dokumenterBruktIVurderingen = form.watch('dokumenterBruktIVurderingen');

  return (
    <VilkårsKort
      heading={'Yrkesskade og nedsatt arbeidsevne § 11-22 1.ledd, 11-5'}
      steg={'AVKLAR_SYKDOM'}
      icon={<VitalsIcon />}
    >
      <Form
        steg={'AVKLAR_SYKDOM'}
        onSubmit={form.handleSubmit(async (data) => {
          const sykdomsVurdering: SykdomsvurderingDto = {
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: data.erÅrsakssammenheng === JaEllerNei.Ja ? 'TRETTI' : 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
              ? data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja
              : undefined,
            yrkesskadevurdering: {
              erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
              andelAvNedsettelse: Number(data.andelAvNedsettelse),
              skadetidspunkt: data.skadetidspunkt ? format(new Date(data.skadetidspunkt), 'yyyy-MM-dd') : undefined,
            },
          };

          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.SYKDOMSVURDERING,
              // @ts-ignore Feil generert type i backend
              sykdomsvurdering: sykdomsVurdering,
            },
            referanse: behandlingsReferanse,
          });
        })}
      >
        <Alert variant="warning">Vi har funnet en eller flere registrerte yrkesskader</Alert>
        <div>
          <Label as="p">Har søker godkjent yrkesskade?</Label>
          <BodyShort>Ja</BodyShort>
        </div>
        <div>
          <Label as="p">Saksopplysninger</Label>
          <BodyShort>Yrkesskaderegisteret</BodyShort>
          <BodyShort>Dato for skadetidspunkt: 03.09.2017</BodyShort>
        </div>

        <RegistrertBehandler />

        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>

        <FormField form={form} formField={formFields.dokumentasjonMangler} />

        <ReadMore header={'Slik vurderes vilkåret'}>
          ref § ... Her kan vi gi en fin veiledning til hvordan man skal begrunne vilkårsvurderingen hvis de er usikre
        </ReadMore>

        <FormField form={form} formField={formFields.begrunnelse} />

        {dokumenterBruktIVurderingen && dokumenterBruktIVurderingen.length > 0 && (
          <List as={'ul'} title={'Tilknyttede dokumenter'}>
            {dokumenterBruktIVurderingen.map((dokument) => (
              <List.Item key={dokument}>{dokument}</List.Item>
            ))}
          </List>
        )}

        <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} />

        <FormField form={form} formField={formFields.erÅrsakssammenheng} />

        {form.watch('erÅrsakssammenheng') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.skadetidspunkt} />
            <FormField form={form} formField={formFields.andelAvNedsettelse} />
          </>
        )}

        <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense} />

        {(form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Nei ||
          form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') === JaEllerNei.Nei) && (
          <Alert variant={'warning'}>Avslag AAP søknad (Snakk med Therese om bedre tekst her)</Alert>
        )}
      </Form>
    </VilkårsKort>
  );
};
