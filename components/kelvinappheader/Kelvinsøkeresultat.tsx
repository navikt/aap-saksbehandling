'use client';

import { Detail, HStack, Label, Link, VStack } from '@navikt/ds-react';
import type { SøkeResultat } from './Kelvinsøk';
import styles from './Kelvinsøkeresultat.module.css';
interface Props {
  søkeresultat: SøkeResultat;
}

export const Kelvinsøkeresultat = ({ søkeresultat: { oppgaver, saker, kontor, oppfølgingsenhet, behandlingsStatus } }: Props) => (
  <HStack gap={'8'}>
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
          <Label spacing>Kontor</Label>
          <VStack gap="2">
              {!kontor?.length ? (
                  <Detail>Fant ikke kontor</Detail>
              ) : (
                  kontor.map((søk, index) => (
                      <Detail key={index}>
                          {søk.enhet}
                      </Detail>
                  ))
              )}
          </VStack>
      </div>

      <div>
          <Label spacing>Oppfølgingsenhet</Label>
          <VStack gap="2">
              {oppfølgingsenhet?.map((søk, index) =>
                  søk.enhet == null ? (
                      <Detail key={index}>
                          Ingen oppfølgingsenhet funnet
                      </Detail>
                  ) : <Detail key={index}>
                         {søk.enhet}
                      </Detail>
              )}
          </VStack>
      </div>

      <div>
          <Label spacing>Status</Label>
          <VStack gap="2">
              {!behandlingsStatus?.length ? (
                  <Detail>Fant ikke status</Detail>
              ) : (
                  behandlingsStatus.map((søk, index) => (
                      <Detail key={index}>
                          {søk.status}
                      </Detail>
                  ))
              )}
          </VStack>
      </div>
  </HStack>
);
