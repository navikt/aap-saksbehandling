'use client';

import { Detail, HStack, Label, Link, VStack } from '@navikt/ds-react';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import type { SøkeResultat } from './Kelvinsøk';
import styles from './Kelvinsøkeresultat.module.css';
interface Props {
  søkeresultat: SøkeResultat;
}

export const Kelvinsøkeresultat = ({ søkeresultat: { oppgaver, saker, kontor, person, behandlingsStatus } }: Props) => (
  <HStack gap={'8'}>
    <div>
      <Label spacing>Bruker</Label>
      <VStack gap="2">
        {!person?.length ? (
          <Detail>Fant ikke navn på person</Detail>
        ) : (
          person.map((søk, index) => (
            <Link className={styles.linkName} key={`sak-resultat-${index}`} href={søk.href}>
              {søk.label}
            </Link>
          ))
        )}
      </VStack>
    </div>

    <div>
      <Label spacing>Saker</Label>
      <VStack gap="2">
        {!saker?.length ? (
          <Detail>Fant ingen saker</Detail>
        ) : (
          saker.map((søk, index) => (
            <Link className={styles.link} key={`sak-resultat-${index}`} href={søk.href}>
              {søk.label}
            </Link>
          ))
        )}
      </VStack>
    </div>

    <div>
      <Label spacing>Oppgaver</Label>
      <VStack gap="2">
        {!oppgaver?.length ? (
          <Detail>Fant ingen oppgaver</Detail>
        ) : (
          oppgaver.map((søk, index) => (
            <Link className={styles.link} key={`oppgave-resultat-${index}`} href={søk.href}>
              {søk.label}
            </Link>
          ))
        )}
      </VStack>
    </div>

    <div>
      <Label spacing>Status</Label>
      <VStack gap="2">
        {!oppgaver?.length ? (
          <Detail>Fant ingen oppgaver</Detail>
        ) : (
          oppgaver.map((søk, index) => {
            const mapped = mapStatus(søk.status);
            if (!mapped) return null;
            return <OppgaveStatus key={`oppgave-status-${index}`} oppgaveStatus={mapped} />;
          })
        )}
      </VStack>
    </div>

    <div>
      <Label spacing>Kontor</Label>
      <VStack gap="2">
        {!kontor?.length ? (
          <Detail>Fant ikke kontor</Detail>
        ) : (
          kontor.map((søk, index) => <Detail key={index}>{søk.enhet}</Detail>)
        )}
      </VStack>
    </div>

    <div>
      <Label spacing>Status</Label>
      <VStack gap="2">
        {!behandlingsStatus?.length ? (
          <Detail>Fant ikke status</Detail>
        ) : (
          behandlingsStatus.map((søk, index) => <Behandlingsstatus key={index} status={søk.status} />)
        )}
      </VStack>
    </div>
  </HStack>
);

function mapStatus(status: string): OppgaveStatusType | null {
  if (status === 'PÅ_VENT') {
    return { status: 'PÅ_VENT', label: 'På vent' };
  } else if (status === 'RESERVERT') {
    return { status: 'RESERVERT', label: 'Reservert' };
  }
  return null;
}
