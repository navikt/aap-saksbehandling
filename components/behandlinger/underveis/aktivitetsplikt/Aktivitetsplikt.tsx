'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { Link, Table } from '@navikt/ds-react';
import {
  hentBruddTekst,
  hentGrunnTekst,
} from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/aktivitetsplikthendelsertabellrad/AktivitetspliktHendelserTabellRad';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { AktivitetspliktGrunnlag, AktivitetspliktPeriode } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';

import styles from './Aktivitetsplikt.module.css';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

interface Props {
  grunnlag?: AktivitetspliktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
}

export const Aktivitetsplikt = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const saksnummer = useSaksnummer();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('EFFEKTUER_11_7');
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurdering',
      defaultValue: grunnlag?.begrunnelse || undefined, // TODO sjekk ut denne
      rules: { required: 'Du må begrunne' },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.EFFEKTUER_11_7_KODE,
          begrunnelse: data.begrunnelse,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  if (!grunnlag || grunnlag.gjeldendeBrudd.length === 0) {
    return;
  }

  return (
    <VilkårsKort steg={'EFFEKTUER_11_7'} heading={'§ 11-7 Bidrar ikke til egen avklaring / behandling'}>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Brudd</Table.HeaderCell>
            <Table.HeaderCell>Grunn</Table.HeaderCell>
            <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.gjeldendeBrudd.map((gjeldendeBrudd) => (
            <Table.Row key={gjeldendeBrudd.brudd + gjeldendeBrudd.grunn}>
              <Table.DataCell>{hentBruddTekst(gjeldendeBrudd.brudd)}</Table.DataCell>
              <Table.DataCell>{hentGrunnTekst(gjeldendeBrudd.grunn)}</Table.DataCell>
              <Table.DataCell>{gjeldendeBrudd.begrunnelse}</Table.DataCell>
              <Table.DataCell>{formaterPeriodeForVisning(gjeldendeBrudd.periode)}</Table.DataCell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.DataCell colSpan={4} className={styles.linkCell}>
              <Link href={`/sak/${saksnummer}/aktivitet`}>Registrer ny informasjon</Link>
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
      <section className={styles.statusrad}>
        <div className={styles.statusfelt}>
          <StatusIkon visOkStatusIkon={!!grunnlag.forhåndsvarselDato} />
          Forhåndsvarsel sendt: {grunnlag.forhåndsvarselDato && formaterDatoForVisning(grunnlag.forhåndsvarselDato)}
        </div>
        <div className={styles.statusfelt}>
          <StatusIkon visOkStatusIkon={!!grunnlag.forhåndsvarselSvar?.mottattDato} />
          Svar mottatt fra innbygger:
          {grunnlag.forhåndsvarselSvar && formaterDatoForVisning(grunnlag.forhåndsvarselSvar.mottattDato)}
        </div>
      </section>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'EFFEKTUER_11_7'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};

const StatusIkon = ({ visOkStatusIkon }: { visOkStatusIkon: boolean }) =>
  visOkStatusIkon ? (
    <CheckmarkCircleIcon className={`${styles.statusikon} ${styles.green}`} />
  ) : (
    <XMarkOctagonIcon className={`${styles.statusikon} ${styles.red}`} />
  );

function formaterPeriodeForVisning(periode: AktivitetspliktPeriode) {
  if (periode.tom) {
    return `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`;
  }
  return `${formaterDatoForFrontend(periode.fom)} - `;
}
