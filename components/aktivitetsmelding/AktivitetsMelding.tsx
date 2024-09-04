'use client';

import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { AktivitetsTabell } from 'components/aktivitetstabell/AktivitetsTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';
import { AktivitetDtoType, Aktivitetsmeldinger } from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { PeriodeDato } from 'components/aktivitetsmeldingdato/PeriodeDato';
import { EnkeltDagDato } from 'components/aktivitetsmeldingdato/EnkeltDagDato';

interface Props {
  saksnummer: string;
  aktivitetsMeldinger: Aktivitetsmeldinger;
}

type Paragraf = '11-8' | '11-9'; // TODO Denne må komme fra backend

interface Periode {
  // TODO Finn en mer egnet plass
  fom?: string;
  tom?: string;
  id: string;
}

interface EnkeltDag {
  // TODO Finn en mer egnet plass
  dato?: string;
  id: string;
}

interface DatoBruddPåAktivitetsplikt {
  // TODO Finn en mer egnet plass
  perioder: Periode[];
  enkeltDager: EnkeltDag[];
}

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
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Ikke bidratt til egen avklaring', value: 'IKKE_AKTIVT_BIDRAG' },
] as const;

export const AktivitetsMelding = ({ saksnummer, aktivitetsMeldinger }: Props) => {
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
      datoForBrudd: {
        type: 'date',
        label: 'Her kommer det en dynamisk label',
        rules: { required: 'Du må sette en dato for brudd på aktivitetsplikten' },
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

  const [bruddPåAktivitetsDatoer, setBruddPåAktivitetsDatoer] = useState<DatoBruddPåAktivitetsplikt>({
    enkeltDager: [],
    perioder: [],
  });

  function leggTilNyEnkeltDato() {
    setBruddPåAktivitetsDatoer((prevState) => ({
      ...prevState,
      enkeltDager: [...prevState.enkeltDager, { id: uuidv4() }],
    }));
  }

  function leggTilNyPeriode() {
    setBruddPåAktivitetsDatoer((prevState) => ({
      ...prevState,
      perioder: [...prevState.perioder, { id: uuidv4() }],
    }));
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

  console.log(bruddPåAktivitetsDatoer);

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
            // TODO Send inn til backend når endepunkt er på plass
            console.log(data);
          })}
        >
          <FormField form={form} formField={formFields.brudd} />
          {harIkkeMøttTilTiltakBehandlingEllerSendtInnDokumentasjon && (
            <FormField form={form} formField={formFields.paragraf} />
          )}
          {paragrafErValgt && (
            <>
              <b>{hentDatoLabel(valgtBrudd)}</b>
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
              <div className={'flex-column'}>
                {bruddPåAktivitetsDatoer.perioder.map((periode) => (
                  <PeriodeDato key={periode.id} />
                ))}

                {bruddPåAktivitetsDatoer.enkeltDager.map((dag) => (
                  <EnkeltDagDato key={dag.id} />
                ))}
              </div>

              {/*<FormField form={form} formField={{ ...formFields.datoForBrudd, label: hentDatoLabel(valgtBrudd) }} />*/}
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
