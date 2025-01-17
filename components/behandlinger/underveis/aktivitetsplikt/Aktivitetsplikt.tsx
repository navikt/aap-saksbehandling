'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { BodyShort, Link, Table } from '@navikt/ds-react';
import {
  hentBruddTekst,
  hentGrunnTekst,
} from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/aktivitetsplikthendelsertabellrad/AktivitetspliktHendelserTabellRad';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { AktivitetspliktGrunnlag, AktivitetspliktPeriode } from 'lib/types/types';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';

import styles from './Aktivitetsplikt.module.css';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

interface Props {
  grunnlag?: AktivitetspliktGrunnlag;
  behandlingVersjon: number;
  readOnly?: boolean; // ikke i bruk, kun midlertidig
}

interface FormFields {
  begrunnelse: string;
}

export const Aktivitetsplikt = ({ grunnlag, behandlingVersjon }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const saksnummer = useSaksnummer();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('EFFEKTUER_11_7');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurdering',
        defaultValue: grunnlag?.begrunnelse || undefined, // TODO sjekk ut denne
        rules: { required: 'Du må begrunne' },
      },
    }
    //{ readOnly: readOnly } //ignorerer flagg fra backend midlertidig
  );

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

  const finnTidligsteDato = () =>
    grunnlag.gjeldendeBrudd.map((brudd) => brudd.periode.fom).sort(sorterEtterNyesteDato)[0];

  return (
    <VilkårsKort steg={'EFFEKTUER_11_7'} heading={'§ 11-7 Bidrar ikke til egen avklaring / behandling'}>
      <Table size={'small'} className={styles.bruddTabell}>
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
        </Table.Body>
      </Table>
      <Link className={styles.link} href={`/sak/${saksnummer}/aktivitet`}>
        Registrer ny / endre informasjon
      </Link>
      <section className={styles.statusrad}>
        <div className={styles.statusfelt}>
          <StatusIkon visOkStatusIkon={!!grunnlag.forhåndsvarselDato} />
          <span>
            Forhåndsvarsel sendt: {grunnlag.forhåndsvarselDato && formaterDatoForVisning(grunnlag.forhåndsvarselDato)}
          </span>
        </div>
      </section>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'EFFEKTUER_11_7'}
        visBekreftKnapp={true} // OIST ignorerer flagg fra backend midlertidig
      >
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
        <BodyShort>
          Med gjeldende § 11-7 brudd vil innbygger få stans i ytelsen fra {formaterDatoForVisning(finnTidligsteDato())}
        </BodyShort>
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
