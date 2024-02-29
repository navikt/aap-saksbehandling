'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, getStringEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { VitalsIcon } from '@navikt/aksel-icons';
import { Alert, Label, Link, List, ReadMore } from '@navikt/ds-react';
import { SykdomsGrunnlag } from 'lib/types/types';
import { løsBehov } from 'lib/api';
import { SykdomsvurderingDto } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { useForm } from 'react-hook-form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';

import styles from './SykdomsvurderingMedYrkesskade.module.css';

interface Props {
  behandlingsReferanse: string;
  grunnlag: SykdomsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erÅrsakssammenheng: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  skadetidspunkt: string;
  andelAvNedsettelse: string;
  dokumenterBruktIVurderingen: string[];
  dokumentasjonMangler: string[];
}

export const SykdomsvurderingMedYrkesskade = ({ behandlingsReferanse, grunnlag }: Props) => {
  const form = useForm<FormFields>({
    defaultValues: {
      begrunnelse: grunnlag.sykdomsvurdering?.begrunnelse,
      erSkadeSykdomEllerLyteVesentligdel: getJaNeiEllerUndefined(
        grunnlag.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel
      ),
      erÅrsakssammenheng: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.erÅrsakssammenheng),
      erNedsettelseIArbeidsevneHøyereEnnNedreGrense: getJaNeiEllerUndefined(
        grunnlag.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
      ),
      skadetidspunkt: grunnlag?.sykdomsvurdering?.yrkesskadevurdering?.skadetidspunkt || undefined,
      andelAvNedsettelse: getStringEllerUndefined(grunnlag.sykdomsvurdering?.yrkesskadevurdering?.andelAvNedsettelse),
    },
    shouldUnregister: true,
  });

  const { formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder den nedsatte arbeidsevnen',
      description: 'Hvilken sykdom/skade/lyte? Hva er det mest vesentlige? Hvis yrkesskade er funnet: vurder mot YS',
      rules: { required: 'Du må begrunne' },
    },
    erSkadeSykdomEllerLyteVesentligdel: {
      type: 'radio',
      label: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
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
      rules: { required: 'Du må svare på om arbeidsevnen er nedsatt.' },
    },
    skadetidspunkt: {
      type: 'radio',
      label: 'Dato for skadetidspunkt for yrkesskaden',
      options: [
        { label: '03.09.2017', value: '2017-09-03' },
        { label: '20.10.2022', value: '2022-10-20' },
      ],
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
      label: 'Dokumenter funnet som er relevant for vurdering av §11-22 1.ledd og §11-5',
      description: 'Tilknytt minst ett dokument til §11-22 1.ledd oog §11-5 vurdering',
    },
    dokumentasjonMangler: {
      type: 'checkbox',
      label: '',
      options: [{ label: 'Dokumentasjon mangler', value: 'dokumentasjonMangler' }],
    }, //TODO Trenger vi denne?
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
            dokumenterBruktIVurdering: data.dokumenterBruktIVurderingen || [],
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: data.erÅrsakssammenheng === JaEllerNei.Ja ? 'TRETTI' : 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense: data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense
              ? data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja
              : undefined,
            yrkesskadevurdering: {
              erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
              andelAvNedsettelse: data.andelAvNedsettelse ? Number(data.andelAvNedsettelse) : undefined,
              skadetidspunkt: data.skadetidspunkt,
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

        <div className={styles.yrkesskader}>
          <Label as="p">Godkjente yrkesskade(r)</Label>
          <List as={'ol'} size={'small'}>
            <List.Item>
              <b>Dato for skadetidspunkt:</b> 03.09.2017
            </List.Item>
            <List.Item>
              <b>Dato for skadetidspunkt:</b> 20.10.2022
            </List.Item>
          </List>
          <Link href={'www.nav.no'}>Yrkesskaderegisteret</Link>
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

        <FormField form={form} formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense} />

        {form.watch('erÅrsakssammenheng') === JaEllerNei.Ja &&
          form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') == JaEllerNei.Ja && (
            <>
              <FormField form={form} formField={formFields.skadetidspunkt} />
              <FormField form={form} formField={formFields.andelAvNedsettelse} />
            </>
          )}

        {(form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Nei ||
          form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') === JaEllerNei.Nei) && (
          <Alert variant={'warning'}>Avslag AAP søknad (Snakk med Therese om bedre tekst her)</Alert>
        )}
      </Form>
    </VilkårsKort>
  );
};
