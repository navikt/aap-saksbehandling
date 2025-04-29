'use client';

import { BodyShort, Link, Table, VStack } from '@navikt/ds-react';
import {
  hentBruddTekst,
  hentGrunnTekst,
} from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/aktivitetsplikthendelsertabellrad/AktivitetspliktHendelserTabellRad';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { AktivitetspliktGrunnlag, AktivitetspliktPeriode } from 'lib/types/types';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';

import styles from './Aktivitetsplikt.module.css';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  grunnlag?: AktivitetspliktGrunnlag;
  behandlingVersjon: number;
  readOnly?: boolean; // ikke i bruk, kun midlertidig
}

interface FormFields {
  begrunnelse: string;
}

export const Aktivitetsplikt = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const saksnummer = useSaksnummer();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('EFFEKTUER_11_7');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurdering',
        defaultValue: grunnlag?.begrunnelse || undefined, // TODO sjekk ut denne
        rules: { required: 'Du må begrunne' },
      },
    },
    { readOnly: readOnly }
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
    <VilkårsKortMedForm
      steg={'EFFEKTUER_11_7'}
      heading={'§ 11-7 Bidrar ikke til egen avklaring / behandling'}
      vilkårTilhørerNavKontor
      onSubmit={handleSubmit}
      status={status}
      resetStatus={resetStatus}
      isLoading={isLoading}
      visBekreftKnapp={true} // OIST ignorerer flagg fra backend midlertidig
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      erAktivtSteg={true}
    >
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
      <Link className={styles.link} href={`/saksbehandling/sak/${saksnummer}/aktivitet`}>
        Registrer ny / endre informasjon
      </Link>
      <section className={styles.statusrad}>
        <div className={styles.statusfelt}>
          <StatusIkon visOkStatusIkon={!!grunnlag.forhåndsvarselDato} />
          <span>
            Forhåndsvarsel sendt: {grunnlag.forhåndsvarselDato && formaterDatoForFrontend(grunnlag.forhåndsvarselDato)}
          </span>
        </div>
      </section>
      <VStack gap={'4'}>
        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
        <BodyShort>
          Med gjeldende § 11-7 brudd vil bruker få stans i ytelsen fra {formaterDatoForFrontend(finnTidligsteDato())}
        </BodyShort>
      </VStack>
    </VilkårsKortMedForm>
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
