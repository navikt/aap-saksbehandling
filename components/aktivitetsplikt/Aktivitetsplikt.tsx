'use client';

import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { AktivitetspliktTabell } from 'components/aktivitetsplikttabell/AktivitetspliktTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';
import { AktivitetDtoType, Aktivitetsmeldinger } from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { useState } from 'react';
import { AktivitetsmeldingDatoTabell } from 'components/aktivitetsmeldingdatotabell/AktivitetsmeldingDatoTabell';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  saksnummer: string;
  aktivitetsMeldinger: Aktivitetsmeldinger;
}

type Paragraf = '11-8' | '11-9'; // TODO Denne må komme fra backend

export interface BruddDatoPeriode {
  type: 'enkeltdag' | 'periode';
  id: string;
}

export interface Periode extends BruddDatoPeriode {
  // TODO Finn en mer egnet plass
  fom?: string;
  tom?: string;
}

export interface EnkeltDag extends BruddDatoPeriode {
  // TODO Finn en mer egnet plass
  dato?: string;
}

export type DatoBruddPåAktivitetsplikt = EnkeltDag & Periode;

interface FormFields {
  brudd: AktivitetDtoType;
  paragraf?: Paragraf;
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
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Ikke bidratt til egen avklaring', value: 'IKKE_AKTIVT_BIDRAG' },
] as const;

export const Aktivitetsplikt = ({ saksnummer, aktivitetsMeldinger }: Props) => {
  console.log(saksnummer);
  const { form, formFields } = useConfigForm<FormFields>(
    {
      brudd: {
        type: 'radio',
        label: 'Registrer brudd på aktivitetsplikt',
        options: bruddOptions,
        rules: { required: 'Du må registrere et brudd på aktivitetsplikten' },
      },
      paragraf: {
        type: 'radio',
        label: 'Velg paragraf',
        options: paragrafOptions,
        rules: { required: 'Du må velge en paragraf' },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        description: 'Skriv begrunnelse og henvis eventuelt til rett kilde/dokumentasjon',
        rules: { required: 'Du må skrive en begrunnelse for brudd på aktivitetsplikten' },
      },
      skalSendeForhåndsvarsel: {
        type: 'checkbox',
        options: ['Send forhåndsvarsel'],
      },
    },
    { shouldUnregister: true }
  );

  const [bruddPåAktivitetsDatoer, setBruddPåAktivitetsDatoer] = useState<DatoBruddPåAktivitetsplikt[]>([]);

  function leggTilNyEnkeltDato() {
    setBruddPåAktivitetsDatoer((prevState) => [...prevState, { type: 'enkeltdag', id: uuidv4(), dato: '' }]);
  }

  function leggTilNyPeriode() {
    setBruddPåAktivitetsDatoer((prevState) => [...prevState, { type: 'periode', id: uuidv4(), tom: '', fom: '' }]);
  }

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
  const harIkkeMøttTilTiltakBehandlingEllerSendtInnDokumentasjon =
    valgtBrudd === 'IKKE_MØTT_TIL_TILTAK' ||
    valgtBrudd === 'IKKE_MØTT_TIL_BEHANDLING' ||
    valgtBrudd === 'IKKE_SENDT_INN_DOKUMENTASJON';

  const paragrafErValgt = form.watch('paragraf') != undefined;

  return (
    <SideProsessKort
      heading={'Registrering av gyldig og ugyldig fravær - (aktivitetsplikten §§ 11-7, 11-8, 11-9)'}
      icon={<FigureIcon fontSize={'inherit'} />}
    >
      <div className={'flex-column'}>
        <AktivitetspliktTabell aktivitetsmeldinger={aktivitetsMeldinger} />
        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (data) => {
            // TODO Send inn til backend når endepunkt er på plass
            console.log(data);
          })}
        >
          <FormField form={form} formField={formFields.brudd} />
          {harIkkeMøttTilTiltakBehandlingEllerSendtInnDokumentasjon && (
            <FormField form={form} formField={formFields.paragraf} />
          )}
          {paragrafErValgt && (
            <div className={'flex-column'}>
              <b>{hentDatoLabel(valgtBrudd)}</b>
              <AktivitetsmeldingDatoTabell
                bruddDatoPerioder={bruddPåAktivitetsDatoer}
                setBruddDatoPerioder={setBruddPåAktivitetsDatoer}
              />
              <div className={'flex-row'}>
                <Button
                  icon={<PlusCircleIcon />}
                  type={'button'}
                  variant={'tertiary'}
                  size={'small'}
                  onClick={() => leggTilNyEnkeltDato()}
                >
                  Legg til enkeltdato
                </Button>
                <Button
                  icon={<PlusCircleIcon />}
                  type={'button'}
                  variant={'tertiary'}
                  size={'small'}
                  onClick={() => leggTilNyPeriode()}
                >
                  Legg til periode
                </Button>
              </div>

              <FormField form={form} formField={formFields.begrunnelse} />
              <FormField form={form} formField={formFields.skalSendeForhåndsvarsel} />
            </div>
          )}
          <Button className={'fit-content-button'}>Bekreft</Button>
        </form>
      </div>
    </SideProsessKort>
  );
};
