'use client';

import { FigureIcon } from '@navikt/aksel-icons';
import { AktivitetsTabell } from 'components/aktivitetstabell/AktivitetsTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';
import { AktivitetDtoType, Aktivitetsmeldinger } from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';

interface Props {
  saksnummer: string;
  aktivitetsMeldinger: Aktivitetsmeldinger;
}

type Paragraf = '11-8' | '11-9'; // TODO Denne må komme fra backend

interface FormFields {
  brudd: AktivitetDtoType;
  paragraf?: Paragraf;
  datoForBrudd?: Date;
  begrunnelse?: string;
  skalSendeForhåndsvarsel: string;
}

const paragrafOptions: ValuePair<Paragraf>[] = [
  { label: '11-8 fravær fra fastsatt aktivitet', value: '11-8' },
  { label: '11-9 reduksjon av AAP ved brudd på nærmere bestemte aktivitetsplikter', value: '11-9' },
];

const bruddOptions: ValuePair<AktivitetDtoType>[] = [
  { label: 'Ikke møtt i tiltak', value: 'IKKE_MØTT_TIL_TILTAK' },
  { label: 'Ikke møtt i behandling/ utredning', value: 'IKKE_MØTT_TIL_BEHANDLING' },
  { label: 'Ikke møtt til møte med Nav', value: 'IKKE_MØTT_TIL_MØTE' },
  // { label: 'Ikke møtt til annen fastsatt aktivitet', value: 'IKKE_MØTT_TIL_ANNEN_AKTIVITET' }, // TODO Fjern fra backend
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Ikke bidratt til egen avklaring', value: 'IKKE_AKTIVT_BIDRAG' },
] as const;

export const AktivitetsMelding = ({ saksnummer, aktivitetsMeldinger }: Props) => {
  console.log(saksnummer)
  const { form, formFields } = useConfigForm<FormFields>(
    {
      brudd: {
        type: 'radio',
        label: 'Registrer brudd på aktivitetsplikt',
        options: bruddOptions,
      },
      paragraf: {
        type: 'radio',
        label: 'Velg paragraf',
        options: paragrafOptions,
      },
      datoForBrudd: {
        type: 'date',
        label: 'Her kommer det en dynamisk label',
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        description: 'Skriv begrunnelse og henvis eventuelt til rett kilde/dokumentasjon',
      },
      skalSendeForhåndsvarsel: {
        type: 'checkbox',
        options: ['Send forhåndsvarsel'],
      },
    },
    { shouldUnregister: true }
  );

  function hentDatoLabel(valgtBrudd: AktivitetDtoType): string {
    switch (valgtBrudd) {
      case 'IKKE_MØTT_TIL_MØTE':
        return 'Dato for ikke møtt i tiltak';
      case 'IKKE_MØTT_TIL_BEHANDLING':
        return 'Dato for ikke møtt til behandling';
      case 'IKKE_MØTT_TIL_TILTAK':
        return 'Dato for ikke møtt til tiltak';
      case 'IKKE_MØTT_TIL_ANNEN_AKTIVITET':
        return 'Dato for møtt til annen aktivitet';
      case 'IKKE_SENDT_INN_DOKUMENTASJON':
        return 'Dato for ikke sendt inn dokumentasjon';
      case 'IKKE_AKTIVT_BIDRAG':
        return 'Dato for ikke bidratt til egen avklaring';
      default: {
        return 'Dato for fravær';
      }
    }
  }

  const valgtBrudd = form.watch('brudd');
  const bruddErValgt =
    valgtBrudd === 'IKKE_MØTT_TIL_TILTAK' ||
    valgtBrudd === 'IKKE_MØTT_TIL_BEHANDLING' ||
    valgtBrudd === 'IKKE_SENDT_INN_DOKUMENTASJON';

  const valgtParagraf = form.watch('paragraf');
  const paragrafErValgt = valgtParagraf != undefined;

  return (
    <SideProsessKort
      heading={'Registrering av gyldig og ugyldig fravær - (aktivitetsplikten §§ 11-7, 11-8, 11-9)'}
      icon={<FigureIcon fontSize={'inherit'} />}
    >
      <div className={'flex-column'}>
        <AktivitetsTabell aktivitetsmeldinger={aktivitetsMeldinger} />
        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (data) => {
            console.log(data);
          })}
        >
          <FormField form={form} formField={formFields.brudd} />
          {bruddErValgt && <FormField form={form} formField={formFields.paragraf} />}
          {paragrafErValgt && (
            <>
              <FormField form={form} formField={{ ...formFields.datoForBrudd, label: hentDatoLabel(valgtBrudd) }} />
              <FormField form={form} formField={formFields.begrunnelse} />
              <FormField form={form} formField={formFields.skalSendeForhåndsvarsel} />
            </>
          )}
          <Button className={'fit-content-button'}>Bekreft</Button>
        </form>
      </div>
    </SideProsessKort>
  );
};
