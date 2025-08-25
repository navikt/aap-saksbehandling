'use client';

import { BodyShort, Detail, HStack, Link, VStack } from '@navikt/ds-react';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';

import styles from 'components/kelvinsøkeresultat/Kelvinsøkeresultat.module.css';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { AdressebeskyttelseStatus } from 'components/adressebeskyttelsestatus/AdressebeskyttelseStatus';
import { Adressebeskyttelsesgrad } from 'lib/utils/adressebeskyttelse';
import { SøkeResultat } from 'app/api/kelvinsok/route';
import { MarkeringStatus } from 'components/markeringstatus/MarkeringStatus';

interface Props {
  søkeresultat: SøkeResultat;
}

export const Kelvinsøkeresultat = ({
  søkeresultat: { oppgaver, saker, kontor, person, behandlingsStatus, harTilgang, harAdressebeskyttelse },
}: Props) => {
  if (!harTilgang && harAdressebeskyttelse) {
    return (
      <HStack gap={'8'}>
        <BodyShort>Du har ikke tilgang til denne brukeren.</BodyShort>
      </HStack>
    );
  }

  return (
    <HStack gap={'8'}>
      <VStack gap={'1'}>
        <Detail className={styles.detail}>Bruker</Detail>
        <VStack gap="2">
          {!person?.length ? (
            <BodyShort size={'small'}>Fant ikke navn på person</BodyShort>
          ) : (
            person.map((søk, index) => (
              <Link className={styles.linkName} key={`sak-resultat-${index}`} href={søk.href}>
                <BodyShort size={'small'}>{storForbokstavIHvertOrd(søk.label)}</BodyShort>
              </Link>
            ))
          )}
        </VStack>
      </VStack>

      <VStack gap={'1'}>
        <Detail className={styles.detail}>Saker</Detail>
        <VStack gap="2">
          {!saker?.length ? (
            <BodyShort size={'small'}>Fant ingen saker</BodyShort>
          ) : (
            saker.map((søk, index) => (
              <Link className={styles.link} key={`sak-resultat-${index}`} href={søk.href}>
                <BodyShort size={'small'}>{søk.label}</BodyShort>
              </Link>
            ))
          )}
        </VStack>
      </VStack>

      <VStack gap="1">
        <Detail className={styles.detail}>Oppgaver</Detail>
        <VStack gap="2">
          {!oppgaver?.length ? (
            <BodyShort size={'small'}>Fant ingen oppgaver</BodyShort>
          ) : (
            oppgaver.map((søk, index) => {
              const oppgaveStatus = mapStatus(søk.status);

              return (
                <HStack gap={'2'} key={index}>
                  <Link className={styles.link} key={`oppgave-resultat-${index}`} href={søk.href}>
                    <BodyShort size={'small'}>{søk.label}</BodyShort>
                  </Link>
                  {oppgaveStatus && <OppgaveStatus size={'xsmall'} oppgaveStatus={oppgaveStatus} showLabel={false} />}
                  {harAdressebeskyttelse && (
                    <AdressebeskyttelseStatus
                      size={'xsmall'}
                      showLabel={false}
                      adressebeskyttelsesGrad={Adressebeskyttelsesgrad.FORTROLIG}
                    />
                  )}
                  {søk.markeringer.map((markeringtype) => {
                    return <MarkeringStatus markeringType={markeringtype} key={markeringtype} />;
                  })}
                </HStack>
              );
            })
          )}
        </VStack>
      </VStack>

      <VStack gap={'1'}>
        <Detail className={styles.detail}>Kontor</Detail>
        <VStack gap="2">
          {!kontor?.length ? (
            <BodyShort size={'small'}>Fant ikke kontor</BodyShort>
          ) : (
            kontor.map((søk, index) => (
              <BodyShort size={'small'} key={index}>
                {søk.enhet}
              </BodyShort>
            ))
          )}
        </VStack>
      </VStack>

      <VStack gap={'1'}>
        <Detail className={styles.detail}>Status</Detail>
        <VStack gap="2">
          {!behandlingsStatus?.length ? (
            <BodyShort size={'small'}>Fant ikke status</BodyShort>
          ) : (
            behandlingsStatus.map((søk, index) => <Behandlingsstatus key={index} status={søk.status} />)
          )}
        </VStack>
      </VStack>
    </HStack>
  );
};

function mapStatus(status: string): OppgaveStatusType | null {
  if (status === 'PÅ_VENT') {
    return { status: 'PÅ_VENT', label: 'På vent' };
  } else if (status === 'RESERVERT') {
    return { status: 'RESERVERT', label: 'Reservert' };
  }
  return null;
}
