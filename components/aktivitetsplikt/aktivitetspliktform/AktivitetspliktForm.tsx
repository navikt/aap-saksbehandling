import styles from 'app/sak/[saksId]/aktivitet/page.module.css';
import { perioderSomOverlapper } from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { revalidateAktivitetspliktHendelser } from 'lib/actions/actions';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';
import { Alert, BodyShort, Button, Label, Radio } from '@navikt/ds-react';
import { AktivitetspliktDatoTabell } from 'components/aktivitetsplikt/aktivitetspliktdatotabell/AktivitetspliktDatoTabell';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Dispatch, useEffect, useState } from 'react';
import { useAktivitetsplikt } from 'hooks/FetchHook';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { AktivitetspliktBrudd, AktivitetspliktGrunn, AktivitetspliktParagraf, SaksInfo } from 'lib/types/types';
import { useFieldArray } from 'react-hook-form';
import { hentDatoLabel } from 'components/aktivitetsplikt/util/AktivitetspliktUtil';

interface Props {
  sak: SaksInfo;
  setSkalRegistrereBrudd: Dispatch<boolean>;
}

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

export interface AktivitetspliktFormFields {
  brudd: AktivitetspliktBrudd;
  begrunnelse: string;
  perioder: DatoBruddPåAktivitetsplikt[];
  paragraf?: AktivitetspliktParagraf;
  grunn?: AktivitetspliktGrunn | null;
}

const bruddOptions: ValuePair<AktivitetspliktBrudd>[] = [
  { label: 'Ikke møtt i tiltak', value: 'IKKE_MØTT_TIL_TILTAK' },
  { label: 'Ikke møtt i behandling/ utredning', value: 'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING' },
  { label: 'Ikke møtt til møte med Nav', value: 'IKKE_MØTT_TIL_MØTE' },
  {
    label: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    value: 'IKKE_SENDT_INN_DOKUMENTASJON',
  },
  { label: 'Ikke bidratt til egen avklaring', value: 'IKKE_AKTIVT_BIDRAG' },
  { label: 'Ikke møtt til annen aktivitet', value: 'IKKE_MØTT_TIL_ANNEN_AKTIVITET' },
];

export const AktivitetspliktForm = ({ sak, setSkalRegistrereBrudd }: Props) => {
  const saksnummer = useSaksnummer();
  const [errorMessage, setErrorMessage] = useState('');
  const { isLoading, opprettAktivitetsplikt } = useAktivitetsplikt(saksnummer);

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
        options: [
          { label: '11-8 fravær fra fastsatt aktivitet', value: 'PARAGRAF_11_8' },
          { label: '11-9 reduksjon av AAP ved brudd på nærmere bestemte aktivitetsplikter', value: 'PARAGRAF_11_9' },
        ],
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        description: 'Skriv begrunnelse og henvis eventuelt til rett kilde/dokumentasjon',
        rules: { required: 'Du må skrive en begrunnelse for brudd på aktivitetsplikten' },
      },
      grunn: {
        type: 'radio_nested',
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

  const bruddSomSkalViseDatoFeltOgBegrennelsesfelt: AktivitetspliktBrudd[] = [
    'IKKE_AKTIVT_BIDRAG',
    'IKKE_SENDT_INN_DOKUMENTASJON',
    'IKKE_MØTT_TIL_MØTE',
    'IKKE_MØTT_TIL_ANNEN_AKTIVITET',
  ];

  const bruddSomSkalViseParagrafValg: AktivitetspliktBrudd[] = [
    'IKKE_MØTT_TIL_TILTAK',
    'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING',
  ];

  const brudd = form.watch('brudd');
  const paragraf = form.watch('paragraf');

  const skalVelgeParagraf = bruddSomSkalViseParagrafValg.includes(brudd);
  const skalViseDatoFeltOgBegrunnelsesfelt =
    Boolean(paragraf) || bruddSomSkalViseDatoFeltOgBegrennelsesfelt.includes(brudd);
  const erMuligÅLeggeTilPeriode = brudd !== 'IKKE_MØTT_TIL_MØTE' && brudd !== 'IKKE_SENDT_INN_DOKUMENTASJON';

  const grunnForBruddHvis119 = [
    { label: 'Ingen gyldig grunn', value: 'INGEN_GYLDIG_GRUNN' },
    { label: 'Rimelig grunn', value: 'RIMELIG_GRUNN' },
  ];
  const grunnForBruddHvis118 = [
    { label: 'Ingen gyldig grunn', value: 'INGEN_GYLDIG_GRUNN' },
    { label: 'Sykdom eller skade', value: 'SYKDOM_ELLER_SKADE' },
    { label: 'Sterke velferdsgrunner', value: 'STERKE_VELFERDSGRUNNER' },
  ];

  /**
   * Feltet for grunn må nullstilles dersom brudd eller paragraf endres, siden alternativene for grunn varierer avhengig av valgene i paragraf/brudd.
   */
  useEffect(() => {
    form.setValue('grunn', null);
  }, [brudd, paragraf, form]);

  return (
    <form
      className={styles.form}
      onSubmit={form.handleSubmit(async (data) => {
        setErrorMessage('');

        const perioder = data.perioder.map((periode) => {
          if (periode.type === 'enkeltdag') {
            if (data.brudd === 'IKKE_AKTIVT_BIDRAG') {
              return { fom: periode.dato, tom: undefined };
            } else {
              return { fom: periode.dato, tom: periode.dato };
            }
          } else {
            return { fom: periode.fom, tom: periode.tom };
          }
        });

        const harOverlappendePerioder = perioderSomOverlapper(perioder);

        if (perioder && perioder.length <= 0) {
          setErrorMessage('Du må legge til en enkeltdato eller periode');
        } else if (harOverlappendePerioder) {
          setErrorMessage('Det finnes overlappende perioder');
        } else {
          await opprettAktivitetsplikt({
            brudd: data.brudd,
            begrunnelse: data.begrunnelse,
            paragraf: data.paragraf,
            perioder: perioder.map((periode) => {
              return {
                fom: formaterDatoForBackend(parse(periode.fom, DATO_FORMATER.ddMMyyyy, new Date())),
                tom: periode.tom
                  ? formaterDatoForBackend(parse(periode.tom, DATO_FORMATER.ddMMyyyy, new Date()))
                  : undefined,
              };
            }),
            grunn: data.grunn ? data.grunn : undefined,
          });
          form.reset();
          remove();
          setSkalRegistrereBrudd(false);
          await revalidateAktivitetspliktHendelser(saksnummer);
        }
      })}
    >
      <FormField form={form} formField={formFields.brudd} />
      {skalVelgeParagraf && <FormField form={form} formField={formFields.paragraf} />}
      {(paragraf === 'PARAGRAF_11_9' || brudd === 'IKKE_MØTT_TIL_MØTE' || brudd === 'IKKE_SENDT_INN_DOKUMENTASJON') && (
        <RadioGroupWrapper
          control={form.control}
          name={'grunn'}
          label={'Velg grunn for bruddet'}
          rules={{ required: 'Du må velge en grunn' }}
        >
          {grunnForBruddHvis119.map((grunn, index) => {
            return (
              <Radio key={index} value={grunn.value}>
                {grunn.label}
              </Radio>
            );
          })}
        </RadioGroupWrapper>
      )}

      {(paragraf === 'PARAGRAF_11_8' || brudd === 'IKKE_MØTT_TIL_ANNEN_AKTIVITET') && (
        <RadioGroupWrapper
          control={form.control}
          name={'grunn'}
          label={'Velg grunn for bruddet'}
          rules={{ required: 'Du må velge en grunn' }}
        >
          {grunnForBruddHvis118.map((grunn, index) => {
            return (
              <Radio key={index} value={grunn.value}>
                {grunn.label}
              </Radio>
            );
          })}
        </RadioGroupWrapper>
      )}

      {skalViseDatoFeltOgBegrunnelsesfelt && (
        <div className={'flex-column'}>
          <div>
            <Label size={'small'}>{hentDatoLabel(brudd)}</Label>
            <BodyShort size={'small'}>Søknadstidspunkt: {formaterDatoForFrontend(sak.opprettetTidspunkt)}</BodyShort>
          </div>
          <AktivitetspliktDatoTabell
            form={form}
            fields={fields}
            remove={remove}
            søknadstidspunkt={new Date(sak.opprettetTidspunkt)}
          />
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
            {erMuligÅLeggeTilPeriode && (
              <Button
                icon={<PlusCircleIcon />}
                type={'button'}
                variant={'tertiary'}
                size={'small'}
                onClick={() => append({ type: 'periode', fom: '', tom: '' })}
              >
                Legg til periode
              </Button>
            )}
          </div>
          {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
          <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
        </div>
      )}
      <div className={'flex-row'}>
        <Button className={'fit-content'} loading={isLoading}>
          Bekreft
        </Button>
        <Button
          className={'fit-content'}
          onClick={() => setSkalRegistrereBrudd(false)}
          variant={'secondary'}
          type={'button'}
        >
          Avbryt
        </Button>
      </div>
    </form>
  );
};
