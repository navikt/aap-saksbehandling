'use client';

import { BodyLong, Button, Label, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  AktivitetspliktBrudd,
  AktivitetspliktGrunn,
  AktivitetspliktHendelseParagraf,
  OppdaterAktivitetsplitGrunn,
  Periode,
} from 'lib/types/types';
import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { useState } from 'react';
import { revalidateAktivitetspliktHendelser } from 'lib/actions/actions';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { clientOppdaterAktivitetspliktBrudd } from 'lib/clientApi';
import { AktivitetspliktHendelserMedFormId } from 'components/aktivitetsplikt/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';
import { useFetch } from 'hooks/FetchHook';

import styles from './AktivitetspliktHendelserTabell.module.css';

interface Props {
  aktivitetspliktHendelse: AktivitetspliktHendelserMedFormId;
}

interface Formfields {
  grunn: OppdaterAktivitetsplitGrunn;
  begrunnelse: string;
}

export const AktivitetspliktHendelserRad = ({ aktivitetspliktHendelse }: Props) => {
  const saksnummer = useSaksnummer();
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, method: oppdaterAktivitetspliktBrudd } = useFetch(clientOppdaterAktivitetspliktBrudd);

  function hentOptionsForBrudd(brudd: AktivitetspliktHendelseParagraf): ValuePair[] {
    switch (brudd) {
      case 'PARAGRAF_11_7':
        return [{ label: 'Feilregistrering (Konsekvens tekst kommer her)', value: 'FEILREGISTRERING' }];
      case 'PARAGRAF_11_8':
        return [
          { label: 'Ingen gyldig grunn', value: 'INGEN_GYLDIG_GRUNN' },
          { label: 'Sykdom eller skade', value: 'SYKDOM_ELLER_SKADE' },
          { label: 'Sterke velferdsgrunner', value: 'STERKE_VELFERDSGRUNNER' },
          { label: 'Feilregistrering (Konsekvens tekst kommer her)', value: 'FEILREGISTRERING' },
        ];
      case 'PARAGRAF_11_9':
        return [
          { label: 'Ingen gyldig grunn', value: 'INGEN_GYLDIG_GRUNN' },
          { label: 'Rimelig grunn', value: 'RIMELIG_GRUNN' },
          { label: 'Feilregistrering (Konsekvens tekst kommer her)', value: 'FEILREGISTRERING' },
        ];
    }
  }

  const { form, formFields } = useConfigForm<Formfields>({
    grunn: {
      type: 'radio',
      label: 'Endre grunn',
      defaultValue: aktivitetspliktHendelse.grunn,
      options: hentOptionsForBrudd(aktivitetspliktHendelse.paragraf),
      rules: { required: 'Du må velge én grunn' },
    },
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      rules: { required: 'Du må skrive en begrunnelse' },
    },
  });

  const erFeilregistrering = aktivitetspliktHendelse.grunn === 'FEILREGISTRERING';

  return (
    <Table.ExpandableRow
      open={isOpen}
      expandOnRowClick={true}
      togglePlacement={'right'}
      onOpenChange={() => setIsOpen(!isOpen)}
      content={
        <form
          onSubmit={form.handleSubmit(async (data) => {
            await oppdaterAktivitetspliktBrudd(saksnummer, {
              brudd: aktivitetspliktHendelse.brudd,
              periode: aktivitetspliktHendelse.periode,
              paragraf: aktivitetspliktHendelse.paragraf,
              grunn: data.grunn,
              begrunnelse: data.begrunnelse,
            });

            await revalidateAktivitetspliktHendelser(saksnummer);
          })}
        >
          <div className={'flex-column'}>
            {aktivitetspliktHendelse.begrunnelse && (
              <div>
                <Label size={'small'}>Begrunnelse</Label>
                <BodyLong>{aktivitetspliktHendelse.begrunnelse}</BodyLong>
              </div>
            )}

            <FormField form={form} formField={formFields.grunn} />
            <FormField form={form} formField={formFields.begrunnelse} />

            <div className={'flex-row'}>
              <Button size={'small'} loading={isLoading}>
                Lagre
              </Button>
              <Button
                size={'small'}
                type={'button'}
                variant={'secondary'}
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
              >
                Avbryt
              </Button>
            </div>
          </div>
        </form>
      }
    >
      <Table.DataCell className={erFeilregistrering ? styles.feilregistrering : ''}>
        {hentParagrafTekst(aktivitetspliktHendelse.paragraf)}
      </Table.DataCell>
      <Table.DataCell className={erFeilregistrering ? styles.feilregistrering : ''}>
        {hentBruddTekst(aktivitetspliktHendelse.brudd)}
      </Table.DataCell>
      <Table.DataCell>{hentGrunnTekst(aktivitetspliktHendelse.grunn)}</Table.DataCell>
      <Table.DataCell className={styles.begrunnelse}>{aktivitetspliktHendelse.begrunnelse}</Table.DataCell>
      <Table.DataCell>{formaterPeriodeForVisning(aktivitetspliktHendelse.periode)}</Table.DataCell>
    </Table.ExpandableRow>
  );
};

function formaterPeriodeForVisning(periode: Periode): string {
  if (periode.fom === periode.tom) {
    return formaterDatoForFrontend(periode.fom);
  } else {
    return `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`;
  }
}

function hentBruddTekst(valgtBrudd: AktivitetspliktBrudd): string {
  switch (valgtBrudd) {
    case 'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING':
      return 'Ikke møtt til behandling eller utredning';
    case 'IKKE_MØTT_TIL_MØTE':
      return 'Ikke møtt til møte';
    case 'IKKE_MØTT_TIL_TILTAK':
      return 'Ikke møtt til tiltak';
    case 'IKKE_MØTT_TIL_ANNEN_AKTIVITET':
      return 'Ikke møtt til annen aktivitet';
    case 'IKKE_SENDT_INN_DOKUMENTASJON':
      return 'Ikke sendt inn dokumentasjon';
    case 'IKKE_AKTIVT_BIDRAG':
      return 'Ikke bidratt til egen avklaring';
  }
}

function hentParagrafTekst(valgtBrudd: AktivitetspliktHendelseParagraf): string {
  switch (valgtBrudd) {
    case 'PARAGRAF_11_7':
      return '11-7';
    case 'PARAGRAF_11_8':
      return '11-8';
    case 'PARAGRAF_11_9':
      return '11-9';
  }
}

function hentGrunnTekst(grunn: AktivitetspliktGrunn): string {
  switch (grunn) {
    case 'INGEN_GYLDIG_GRUNN':
      return 'Ingen gyldig grunn';
    case 'RIMELIG_GRUNN':
      return 'Rimelig grunn';
    case 'STERKE_VELFERDSGRUNNER':
      return 'Sterkre velferdsgrunner';
    case 'SYKDOM_ELLER_SKADE':
      return 'Sykdom eller skade';
    case 'FEILREGISTRERING':
      return 'Feilregistrering';
  }
}
