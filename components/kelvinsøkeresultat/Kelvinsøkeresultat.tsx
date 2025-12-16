'use client';

import { Alert, BodyShort, Detail, HStack, Link, VStack } from '@navikt/ds-react';
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
  if (!saker || saker.length == 0) {
    return (
      <HStack>
        <Alert variant={'info'} size={'small'} className={styles.info}>
          Du fikk ingen treff. Sjekk at saksnummeret eller fødselsnummer er riktig skrevet.
        </Alert>
      </HStack>
    );
  }

  return (
    <VStack gap={'2'}>
      {!harTilgang && (
        <HStack>
          <Alert variant={'info'} size={'small'} className={styles.info}>
            {harAdressebeskyttelse
              ? 'Du har ikke tilgang til saken fordi personen er egen ansatt eller har adressebeskyttelse.'
              : 'Du har ikke tilgang til saken.'}
          </Alert>
        </HStack>
      )}
      <HStack gap={'8'}>
        <VStack gap={'1'}>
          <Detail className={styles.detail}>Bruker</Detail>
          <VStack gap="2">
            {!person?.length ? (
              <BodyShort size={'small'}>Fant ikke navn på person</BodyShort>
            ) : (
              person.map((søk, index) => (
                <LenkeHvisHarTilgang
                  className={styles.linkName}
                  key={`sak-resultat-${index}`}
                  href={søk.href}
                  skalViseLenke={harTilgang}
                >
                  <BodyShort size={'small'}>{storForbokstavIHvertOrd(søk.label)}</BodyShort>
                </LenkeHvisHarTilgang>
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
                <LenkeHvisHarTilgang
                  className={styles.link}
                  key={`sak-resultat-${index}`}
                  href={søk.href}
                  skalViseLenke={harTilgang}
                >
                  <BodyShort size={'small'}>{søk.label}</BodyShort>
                </LenkeHvisHarTilgang>
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
                    <LenkeHvisHarTilgang
                      className={styles.link}
                      key={`oppgave-resultat-${index}`}
                      href={søk.href}
                      skalViseLenke={harTilgang}
                    >
                      <BodyShort size={'small'}>{søk.label}</BodyShort>
                    </LenkeHvisHarTilgang>
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
    </VStack>
  );
};

function mapStatus(status: string): OppgaveStatusType | null {
  if (status === 'PÅ_VENT') {
    return { status: 'PÅ_VENT', label: 'På vent' };
  } else if (status === 'TILDELT') {
    return { status: 'TILDELT', label: 'Tildelt' };
  }
  return null;
}

const LenkeHvisHarTilgang = ({
  href,
  children,
  skalViseLenke,
  className,
}: {
  href: string;
  children: React.ReactNode;
  skalViseLenke: boolean;
  className?: string;
}) => {
  if (skalViseLenke) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }
  return <span>{children}</span>;
};
