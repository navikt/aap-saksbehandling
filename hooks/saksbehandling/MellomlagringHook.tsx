'use client';

import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagretVurdering } from 'lib/types/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { UseFormSubscribe } from 'react-hook-form';

export function useMellomlagring<T extends object>(
  behovstype: Behovstype,
  initialMellomlagring: MellomlagretVurdering | undefined,
  subscribe?: UseFormSubscribe<T>
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: (callback?: () => void) => void;
  mellomlagretVurdering?: MellomlagretVurdering;
  nullstillMellomlagretVurdering: () => void;
} {
  const behandlingsReferanse = useBehandlingsReferanse();
  const [mellomlagretVurdering, setMellomlagretVurdering] = useState<MellomlagretVurdering | undefined>(
    initialMellomlagring
  );

  const lagreMellomlagring = useCallback(
    async (vurdering: object) => {
      const res = await clientLagreMellomlagring({
        avklaringsbehovkode: behovstype,
        behandlingsReferanse: behandlingsReferanse,
        data: JSON.stringify(vurdering),
      });

      if (isSuccess(res)) {
        setMellomlagretVurdering(res.data.mellomlagretVurdering);
      }
    },
    [behovstype, behandlingsReferanse]
  );

  const debouncedLagreMellomlagring = useMemo(() => debounce(lagreMellomlagring, 1000), [lagreMellomlagring]);

  useEffect(() => {
    if (!subscribe) return;
    const callback = subscribe({
      formState: {
        values: true,
        isDirty: true,
      },
      callback: ({ values, isDirty }) => {
        if (!isDirty) return;
        debouncedLagreMellomlagring(values);
      },
    });

    return () => callback();
  }, [subscribe, debouncedLagreMellomlagring]);

  async function slettMellomlagring(callback?: () => void) {
    const res = await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });

    if (isSuccess(res)) {
      setMellomlagretVurdering(undefined);
      if (callback) {
        callback();
      }
    }
  }

  function nullstillMellomlagretVurdering() {
    setMellomlagretVurdering(undefined);
  }

  return {
    lagreMellomlagring,
    slettMellomlagring,
    nullstillMellomlagretVurdering,
    mellomlagretVurdering,
  };
}
