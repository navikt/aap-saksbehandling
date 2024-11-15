import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import Link from 'next/link';
import { Heading } from '@navikt/ds-react';
import styles from './page.module.css';

const Page = async (props: { params: Promise<{ saksId: string }> }) => {
  const params = await props.params;
  const sak = await hentSak(params.saksId);

  return (
    <div className={styles.saksoversikt}>
      <Heading size={'medium'}>Alle behandlinger for en sak:</Heading>
      <ul>
        {sak?.behandlinger?.map((behandling) => (
          <li key={behandling.referanse}>
            <Link href={`/sak/${params.saksId}/${behandling.referanse}`}>{behandling.referanse}</Link>
          </li>
        ))}
      </ul>
      <Heading size={'medium'}>Aktivitet</Heading>
      <Link href={`/sak/${params.saksId}/aktivitet`}>Registrer brudd på aktivitetsplikten</Link>
    </div>
  );
};

export default Page;
