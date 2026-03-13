'use client';

import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagretVurdering } from 'lib/types/types';
import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { UseFormWatch } from 'react-hook-form';

export function useMellomlagring<T extends object>(
  behovstype: Behovstype,
  initialMellomlagring: MellomlagretVurdering | undefined,
  watch?: UseFormWatch<T>
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

  async function lagreMellomlagring(vurdering: object) {
    const res = await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: JSON.stringify(vurdering),
    });

    if (isSuccess(res)) {
      setMellomlagretVurdering(res.data.mellomlagretVurdering);
    }
  }

  const debouncedSave = useRef(
    debounce((data: object) => {
      lagreMellomlagring(data);
    }, 5000)
  ).current;

  useEffect(() => {
    if (!watch) return;

    const subscription = watch((value) => {
      debouncedSave(value);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

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
