'use client';

import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { AktivitetspliktHendelserTabell } from 'components/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';
import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { Alert, Button } from '@navikt/ds-react';
import { AktivitetspliktBrudd, AktivitetspliktHendelse, AktivitetspliktParagraf } from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { AktivitetsmeldingDatoTabell } from 'components/aktivitetsmeldingdatotabell/AktivitetsmeldingDatoTabell';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { revalidateAktivitetspliktHendelser } from 'lib/actions/actions';
import { useFieldArray } from 'react-hook-form';
import { perioderSomOverlapper } from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';
import { useState } from 'react';
import { opprettAktivitetspliktBrudd } from 'lib/clientApi';
import { DATO_FORMATER, formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface AktvitetsPeriode {
  type: 'periode';
  fom: string;
  tom: string;
}

interface EnkeltDag {
  type: 'enkeltdag';
  dato: string;
}

export type DatoBruddPåAktivitetsplikt = EnkeltDag | AktvitetsPeriode;

interface Props {
  aktivitetspliktHendelser: AktivitetspliktHendelse[];
}

export interface AktivitetspliktFormFields {
  brudd: AktivitetspliktBrudd;
  paragraf: AktivitetspliktParagraf;
  begrunnelse: string;
  perioder: DatoBruddPåAktivitetsplikt[];
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

export const Aktivitetsplikt = ({ aktivitetspliktHendelser }: Props) => {
  const saksnummer = useSaksnummer();
  const [errorMessage, setErrorMessage] = useState('');
  const { form, formFields } = useConfigForm<AktivitetspliktFormFields>(
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
      perioder: {
        type: 'fieldArray',
      },
    },
    { shouldUnregister: true }
  );

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'perioder',
  });

  const valgtBrudd = form.watch('brudd');
  const valgtParagraf = form.watch('paragraf');

  const skalVelgeParagraf = ['IKKE_MØTT_TIL_TILTAK', 'IKKE_MØTT_TIL_BEHANDLING'].includes(valgtBrudd);
  const skalViseDatoFeltOgBegrunnelsesfelt =
    Boolean(valgtParagraf) ||
    ['IKKE_AKTIVT_BIDRAG', 'IKKE_SENDT_INN_DOKUMENTASJON', 'IKKE_MØTT_TIL_MØTE'].includes(valgtBrudd);

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
            const perioder = data.perioder.map((periode) => {
              if (periode.type === 'enkeltdag') {
                return { fom: periode.dato, tom: periode.dato };
              } else {
                return { fom: periode.fom, tom: periode.tom };
              }
            });

            const harOverlappendePerioder = perioderSomOverlapper(perioder);

            let paragraf: AktivitetspliktParagraf;

            if (['IKKE_MØTT_TIL_MØTE', 'IKKE_SENDT_INN_DOKUMENTASJON'].includes(data.brudd)) {
              paragraf = 'PARAGRAF_11_9';
            } else if (data.brudd === 'IKKE_AKTIVT_BIDRAG') {
              paragraf = 'PARAGRAF_11_7';
            } else {
              paragraf = data.paragraf;
            }

            if (harOverlappendePerioder) {
              setErrorMessage('Det finnes overlappende perioder');
            } else {
              await opprettAktivitetspliktBrudd({
                brudd: data.brudd,
                begrunnelse: data.begrunnelse,
                paragraf: paragraf,
                perioder: perioder.map((periode) => {
                  return {
                    fom: formaterDatoForBackend(parse(periode.fom, DATO_FORMATER.ddMMyyyy, new Date())),
                    tom: formaterDatoForBackend(parse(periode.tom, DATO_FORMATER.ddMMyyyy, new Date())),
                  };
                }),
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
              <AktivitetsmeldingDatoTabell form={form} fields={fields} remove={remove} />
              <div className={'flex-row'}>
                <Button
                  icon={<PlusCircleIcon />}
                  type={'button'}
                  variant={'tertiary'}
                  size={'small'}
                  onClick={() => append({ type: 'enkeltdag', dato: '' })}
                >
                  Legg til enkeltdato
                </Button>
                <Button
                  icon={<PlusCircleIcon />}
                  type={'button'}
                  variant={'tertiary'}
                  size={'small'}
                  onClick={() => append({ type: 'periode', fom: '', tom: '' })}
                >
                  Legg til periode
                </Button>
              </div>
              {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
              <FormField form={form} formField={formFields.begrunnelse} />
            </div>
          )}
          <Button className={'fit-content-button'}>Bekreft</Button>
        </form>
      </div>
    </SideProsessKort>
  );
};

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
