import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import Link from 'next/link';
import { Heading } from '@navikt/ds-react';
import styles from './page.module.css';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';
import { isLocal } from 'lib/utils/environment';
import { DummyMeldekort } from 'components/dummymeldekort/DummyMeldekort';

const Page = async (props: { params: Promise<{ saksId: string }> }) => {
  const params = await props.params;
  const sak = await hentSak(params.saksId);

  return (
    <div className={styles.saksoversikt}>
      <Heading size={'medium'}>Alle behandlinger for en sak:</Heading>
      <table style={{ maxWidth: '30rem' }}>
        <thead>
          <tr>
            <th>Referanse</th>
            <th>Opprettet</th>
          </tr>
        </thead>
        <tbody>
          {sak?.behandlinger?.map((behandling) => (
            <tr key={behandling.referanse}>
              <td>
                <Link href={`/sak/${params.saksId}/${behandling.referanse}`}>{behandling.referanse}</Link>
              </td>
              <td>{formaterDatoTidForVisning(behandling.opprettet)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Heading size={'medium'}>Aktivitet</Heading>
      <Link href={`/sak/${params.saksId}/aktivitet`}>Registrer brudd på aktivitetsplikten</Link>
      {isLocal() && (
        <>
          <Heading size={'medium'}>Send et meldekort for inneværende mnd</Heading>
          <DummyMeldekort saksid={params.saksId} />
        </>
      )}
    </div>
  );
};

export default Page;
