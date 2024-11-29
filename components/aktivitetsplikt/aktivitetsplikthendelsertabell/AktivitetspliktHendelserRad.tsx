'use client';

import { Button, Table } from '@navikt/ds-react';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import {
  AktivitetspliktBrudd,
  AktivitetspliktGrunn,
  AktivitetspliktHendelseParagraf,
  OppdaterAktivitetsplitGrunn,
} from 'lib/types/types';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { useState } from 'react';
import { revalidateAktivitetspliktHendelser } from 'lib/actions/actions';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { clientFeilregistrerAktivitetspliktBrudd, clientOppdaterAktivitetspliktBrudd } from 'lib/clientApi';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { AktivitetspliktHendelserMedFormId } from 'components/aktivitetsplikt/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';

interface Props {
  aktivitetspliktHendelse: AktivitetspliktHendelserMedFormId;
}

interface Formfields {
  erFeilregistrering: string;
  grunn: OppdaterAktivitetsplitGrunn;
}

export const AktivitetspliktHendelserRad = ({ aktivitetspliktHendelse }: Props) => {
  const saksnummer = useSaksnummer();
  const [isOpen, setIsOpen] = useState(false);

  const { form, formFields } = useConfigForm<Formfields>({
    erFeilregistrering: {
      type: 'radio',
      label: 'Er dette fraværet en feilregistrering?',
      options: JaEllerNeiOptions,
      rules: { required: 'Du må besvare om dette er en feilregistrering' },
    },
    grunn: {
      type: 'radio',
      label: 'Grunn',
      defaultValue: aktivitetspliktHendelse.grunn,
      options: [
        { label: 'Ingen gyldig grunn', value: 'INGEN_GYLDIG_GRUNN' },
        { label: 'Sykdom eller skade', value: 'SYKDOM_ELLER_SKADE' },
        { label: 'Sterke velferdsgrunner', value: 'STERKE_VELFERDSGRUNNER' },
        { label: 'Rimelig grunn', value: 'RIMELIG_GRUNN' },
      ],
    },
  });

  return (
    <Table.ExpandableRow
      open={isOpen}
      togglePlacement={'right'}
      onOpenChange={() => setIsOpen(!isOpen)}
      content={
        <form
          onSubmit={form.handleSubmit(async (data) => {
            if (data.erFeilregistrering === JaEllerNei.Ja) {
              await clientFeilregistrerAktivitetspliktBrudd(saksnummer, {
                brudd: aktivitetspliktHendelse.brudd,
                periode: {
                  fom: formaterDatoForBackend(new Date(aktivitetspliktHendelse.periode.fom)),
                  tom: formaterDatoForBackend(new Date(aktivitetspliktHendelse.periode.tom)),
                },
                paragraf: aktivitetspliktHendelse.paragraf,
              });
            } else {
              await clientOppdaterAktivitetspliktBrudd(saksnummer, {
                brudd: aktivitetspliktHendelse.brudd,
                periode: aktivitetspliktHendelse.periode,
                paragraf: aktivitetspliktHendelse.paragraf,
                grunn: data.grunn,
              });
            }
            await revalidateAktivitetspliktHendelser(saksnummer);
          })}
        >
          <div className={'flex-column'}>
            <FormField form={form} formField={formFields.erFeilregistrering} />
            {form.watch('erFeilregistrering') === JaEllerNei.Nei && (
              <FormField form={form} formField={formFields.grunn} />
            )}

            <div className={'flex-row'}>
              <Button size={'small'}>Lagre</Button>
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
      <Table.DataCell>{hentParagrafTekst(aktivitetspliktHendelse.paragraf)}</Table.DataCell>
      <Table.DataCell>{hentBruddTekst(aktivitetspliktHendelse.brudd)}</Table.DataCell>
      <Table.DataCell>{hentGrunnTekst(aktivitetspliktHendelse.grunn)}</Table.DataCell>
      <Table.DataCell>{formaterDatoForFrontend(aktivitetspliktHendelse.periode.fom)}</Table.DataCell>
      <Table.DataCell>{formaterDatoForFrontend(aktivitetspliktHendelse.periode.tom)}</Table.DataCell>
    </Table.ExpandableRow>
  );
};

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
  }
}
