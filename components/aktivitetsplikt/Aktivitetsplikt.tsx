'use client';

import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { AktivitetspliktTabell } from 'components/aktivitetsplikttabell/AktivitetspliktTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';
import { AktivitetType } from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { useState } from 'react';
import { AktivitetsmeldingDatoTabell } from 'components/aktivitetsmeldingdatotabell/AktivitetsmeldingDatoTabell';

import { v4 as uuidv4 } from 'uuid';

type Paragraf = '11-7' | '11-8' | '11-9'; // TODO Denne må komme fra backend

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
  brudd: AktivitetType;
  paragraf?: Paragraf;
  begrunnelse?: string;
}

const paragrafOptions: ValuePair<Paragraf>[] = [
  { label: '11-7 noe tekst her som forklarer hva 11-7 er for noe', value: '11-7' },
  { label: '11-8 fravær fra fastsatt aktivitet', value: '11-8' },
  { label: '11-9 reduksjon av AAP ved brudd på nærmere bestemte aktivitetsplikter', value: '11-9' },
];

const bruddOptions: ValuePair<AktivitetType>[] = [
  { label: 'Ikke møtt i tiltak', value: 'IKKE_MØTT_TIL_TILTAK' },
  { label: 'Ikke møtt i behandling/ utredning', value: 'IKKE_MØTT_TIL_BEHANDLING' },
  { label: 'Ikke møtt til møte med Nav', value: 'IKKE_MØTT_TIL_MØTE' },
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Ikke bidratt til egen avklaring', value: 'IKKE_AKTIVT_BIDRAG' },
];

export const Aktivitetsplikt = () => {
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
        rules: { required: 'Du må velge en paragraf' },
        options: paragrafOptions.filter((paragraf) => paragraf.value !== '11-7'),
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        description: 'Skriv begrunnelse og henvis eventuelt til rett kilde/dokumentasjon',
        rules: { required: 'Du må skrive en begrunnelse for brudd på aktivitetsplikten' },
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

  function hentDatoLabel(valgtBrudd: AktivitetType): string {
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
  const valgtParagraf = form.watch('paragraf');

  const skalVelgeParagraf = ['IKKE_MØTT_TIL_TILTAK', 'IKKE_MØTT_TIL_BEHANDLING'].includes(valgtBrudd);

  const skalViseDatoFeltOgBegrunnelsesfelt =
    Boolean(valgtParagraf) ||
    valgtBrudd == 'IKKE_AKTIVT_BIDRAG' ||
    valgtBrudd == 'IKKE_SENDT_INN_DOKUMENTASJON' ||
    valgtBrudd == 'IKKE_MØTT_TIL_MØTE';

  console.log('paragraf', form.watch('paragraf'));

  return (
    <SideProsessKort
      heading={'Registrering av gyldig og ugyldig fravær - (aktivitetsplikten §§ 11-7, 11-8, 11-9)'}
      icon={<FigureIcon fontSize={'inherit'} />}
    >
      <div className={'flex-column'}>
        <AktivitetspliktTabell />
        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (data) => {
            // TODO Send inn til backend når endepunkt er på plass
            console.log(data);
          })}
        >
          <FormField form={form} formField={formFields.brudd} />
          {skalVelgeParagraf && <FormField form={form} formField={formFields.paragraf} />}

          {skalViseDatoFeltOgBegrunnelsesfelt && (
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
            </div>
          )}
          <Button className={'fit-content-button'}>Bekreft</Button>
        </form>
      </div>
    </SideProsessKort>
  );
};
