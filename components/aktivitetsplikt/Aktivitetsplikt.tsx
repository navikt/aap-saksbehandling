'use client';

import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { AktivitetspliktHendelserTabell } from 'components/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Button } from '@navikt/ds-react';
import {
  AktivitetspliktBrudd,
  AktivitetspliktHendelse,
  AktivitetspliktParagraf,
  PeriodeAktivitet,
} from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { useState } from 'react';
import { AktivitetsmeldingDatoTabell } from 'components/aktivitetsmeldingdatotabell/AktivitetsmeldingDatoTabell';

import { v4 as uuidv4 } from 'uuid';
import { opprettAktivitetspliktBrudd } from 'lib/clientApi';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { revalidateAktivitetspliktHendelser } from 'lib/actions/actions';

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

interface Props {
  aktivitetspliktHendelser: AktivitetspliktHendelse[];
}

interface FormFields {
  brudd: AktivitetspliktBrudd;
  paragraf?: AktivitetspliktParagraf;
  begrunnelse: string;
}

const paragrafOptions: ValuePair<AktivitetspliktParagraf>[] = [
  { label: '11-7 noe tekst her som forklarer hva 11-7 er for noe', value: 'PARAGRAF_11_7' },
  { label: '11-8 fravær fra fastsatt aktivitet', value: 'PARAGRAF_11_8' },
  { label: '11-9 reduksjon av AAP ved brudd på nærmere bestemte aktivitetsplikter', value: 'PARAGRAF_11_9' },
];

const bruddOptions: ValuePair<AktivitetspliktBrudd>[] = [
  { label: 'Ikke møtt i tiltak', value: 'IKKE_MØTT_TIL_TILTAK' },
  { label: 'Ikke møtt i behandling/ utredning', value: 'IKKE_MØTT_TIL_BEHANDLING' },
  { label: 'Ikke møtt til møte med Nav', value: 'IKKE_MØTT_TIL_MØTE' },
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Ikke bidratt til egen avklaring', value: 'IKKE_AKTIVT_BIDRAG' },
];

export interface PeriodeError {
  id: string;
  felt: 'fom' | 'tom' | 'dato';
  errorMessage: string;
}

export const Aktivitetsplikt = ({ aktivitetspliktHendelser }: Props) => {
  const saksnummer = useSaksnummer();
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
        options: paragrafOptions.filter((paragraf) => paragraf.value !== 'PARAGRAF_11_7'),
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

  const [bruddPåAktivitetDatoer, setBruddPåAktivitetDatoer] = useState<DatoBruddPåAktivitetsplikt[]>([]);
  const [errors, setErrors] = useState<PeriodeError[]>([]);

  function leggTilNyEnkeltDato() {
    setBruddPåAktivitetDatoer((prevState) => [...prevState, { type: 'enkeltdag', id: uuidv4(), dato: '' }]);
  }

  function leggTilNyPeriode() {
    setBruddPåAktivitetDatoer((prevState) => [...prevState, { type: 'periode', id: uuidv4(), tom: '', fom: '' }]);
  }

  function hentDatoLabel(valgtBrudd: AktivitetspliktBrudd): string {
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

  /**
   * På mandag så renskriver vi denne og tester at den fungerer. Det må legges til state på inputfeltene.
   */
  function validerDatoer(): PeriodeAktivitet | undefined {
    setErrors([]);
    const validertePerioder: PeriodeAktivitet = [];
    const periodeErrors: PeriodeError[] = [];

    bruddPåAktivitetDatoer.forEach((brudd) => {
      if (brudd.type === 'enkeltdag') {
        if (brudd.dato) {
          const errorMessage = validerDato(brudd.dato);
          if (errorMessage) {
            periodeErrors.push({
              errorMessage,
              id: brudd.id,
              felt: 'dato',
            });
          } else {
            validertePerioder.push({
              tom: formaterDatoForBackend(new Date(brudd.dato)),
              fom: formaterDatoForBackend(new Date(brudd.dato)),
            });
          }
        }
      } else {
        const errorMessageTom = validerDato(brudd.tom);
        const errorMessageFom = validerDato(brudd.fom);

        if (errorMessageFom) {
          periodeErrors.push({
            errorMessage: errorMessageFom,
            id: brudd.id,
            felt: 'fom',
          });
        }

        if (errorMessageTom) {
          periodeErrors.push({
            errorMessage: errorMessageTom,
            id: brudd.id,
            felt: 'tom',
          });
        }

        if (!errorMessageTom && !errorMessageFom && brudd.tom && brudd.fom) {
          validertePerioder.push({
            tom: formaterDatoForBackend(new Date(brudd.tom)),
            fom: formaterDatoForBackend(new Date(brudd.fom)),
          });
        }
      }
    });

    if (periodeErrors.length > 0) {
      setErrors(periodeErrors);
      return undefined;
    } else {
      return validertePerioder;
    }
  }

  function validerDato(value?: string) {
    if (!value) {
      return 'Du må skrive inn en dato';
    }

    const inputDato = parseDatoFraDatePicker(value);
    if (!inputDato) {
      return 'Dato for når søker har forsørgeransvar fra er ikke gyldig';
    }
  }

  return (
    <SideProsessKort
      heading={'Registrering av gyldig og ugyldig fravær - (aktivitetsplikten §§ 11-7, 11-8, 11-9)'}
      icon={<FigureIcon fontSize={'inherit'} />}
    >
      <div className={'flex-column'}>
        <AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />
        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (data) => {
            const validertePerioder = validerDatoer();

            if (validertePerioder) {
              await opprettAktivitetspliktBrudd({
                brudd: data.brudd,
                begrunnelse: data.begrunnelse,
                paragraf: data.paragraf !== undefined ? data.paragraf : 'PARAGRAF_11_7',
                perioder: validertePerioder,
                saksnummer: saksnummer,
              });

              await revalidateAktivitetspliktHendelser(saksnummer);
            }
          })}
        >
          <FormField form={form} formField={formFields.brudd} />
          {skalVelgeParagraf && <FormField form={form} formField={formFields.paragraf} />}

          {skalViseDatoFeltOgBegrunnelsesfelt && (
            <div className={'flex-column'}>
              <b>{hentDatoLabel(valgtBrudd)}</b>
              <AktivitetsmeldingDatoTabell
                bruddDatoPerioder={bruddPåAktivitetDatoer}
                setBruddDatoPerioder={setBruddPåAktivitetDatoer}
                errors={errors}
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
