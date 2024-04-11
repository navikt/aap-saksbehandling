'use client';

import { Rolle } from 'app/api/rolle/route';
import { fetchProxy } from 'lib/clientApi';
import { Select, VStack } from '@navikt/ds-react';
import useSWR from 'swr';
const roller = ['SAKSBEHANDLER', 'BESLUTTER', 'LESEVISNING'];

export const Rollevelger = () => {
  const getAktivRolle = async () => await fetchProxy<{ rolle: Rolle }>('/api/rolle', 'GET');
  const { data } = useSWR('/api/data', getAktivRolle);
  async function postVelgRolle(rolle: Rolle) {
    await fetchProxy(`/api/rolle`, 'POST', { rolle });
  }
  return (
    <VStack gap={'4'}>
      <Select onChange={(event) => postVelgRolle(event.target.value as Rolle)} label="Velg rolle">
        {roller.map((rolle) => (
          <option value={rolle} selected={rolle === data?.rolle} key={rolle}>
            {rolle}
          </option>
        ))}
      </Select>
    </VStack>
  );
};
