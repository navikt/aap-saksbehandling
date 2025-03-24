'use client';

import { Detail, HStack, Label, Link, VStack } from '@navikt/ds-react';
import type { SøkeResultat } from './Kelvinsøk';

interface Props {
  søkeresultat: SøkeResultat;
}

export const Kelvinsøkeresultat = ({ søkeresultat: { oppgaver, saker } }: Props) => (
  <HStack gap={'8'}>
    <div>
      <Label spacing>Saker</Label>
      <VStack gap="2">
        {!saker?.length ? (
          <Detail>Fant ingen saker</Detail>
        ) : (
          saker.map((søk, index) => (
            <Link key={`sak-resultat-${index}`} href={søk.href}>
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
            <Link key={`oppgave-resultat-${index}`} href={søk.href}>
              {søk.label}
            </Link>
          ))
        )}
      </VStack>
    </div>
  </HStack>
);
