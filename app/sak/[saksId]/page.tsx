import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import Link from 'next/link';
import { Heading } from '@navikt/ds-react';
import styles from './page.module.css';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';
import { isLocal } from 'lib/utils/environment';
import { DummyMeldekort } from 'components/devtools/DummyMeldekort';
import { SendNySoknad } from 'components/devtools/SendNySoknad';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';

const Page = async (props: { params: Promise<{ saksId: string }> }) => {
  const params = await props.params;
  const sak = await hentSak(params.saksId);

  return (
    <div className={styles.saksoversikt}>
      <Heading size={'medium'}>Alle behandlinger for en sak:</Heading>
      <table className={styles.behandlingstabell}>
        <thead>
          <tr className={styles.row}>
            <th className={styles.th}>Referanse</th>
            <th className={styles.th}>Opprettet</th>
            {isLocal() && <th></th>}
          </tr>
        </thead>
        <tbody>
          {sak?.behandlinger?.map((behandling) => (
            <tr key={behandling.referanse} className={styles.row}>
              <td>
                <Link href={`/sak/${params.saksId}/${behandling.referanse}`}>{behandling.referanse}</Link>
              </td>
              <td>{formaterDatoTidForVisning(behandling.opprettet)}</td>
              {isLocal() && (
                <td>
                  <BestillBrevTestKnapp behandlingReferanse={behandling.referanse} />
                </td>
              )}
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
          <SendNySoknad saksid={params.saksId} />
        </>
      )}
    </div>
  );
};

export default Page;
