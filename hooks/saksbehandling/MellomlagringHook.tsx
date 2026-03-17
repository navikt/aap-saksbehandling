'use client';

import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagretVurdering } from 'lib/types/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce, isEqual } from 'lodash';
import { UseFormReturn } from 'react-hook-form';

export function useMellomlagring<T extends object>(
  behovstype: Behovstype,
  initialMellomlagring: MellomlagretVurdering | undefined,
  form?: UseFormReturn<T>
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

  const debouncedLagreMellomlagring = useMemo(() => debounce(lagreMellomlagring, 600), [lagreMellomlagring]);

  useEffect(() => {
    if (!form) return;

    let previousValues: T | undefined;

    const unsubscribe = form.subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        if (form.formState.isSubmitting) {
          debouncedLagreMellomlagring.cancel();
          return;
        }

        /**
         * Hindrer unødvendig autosave:
         * - Sammenligner med defaultValues for å sjekke om brukeren faktisk har gjort endringer (RHF sin isDirty er ikke alltid pålitelig).
         * - Sammenligner med previousValues for å unngå å lagre samme data flere ganger når RHF trigges uten reelle endringer.
         */
        const erForskjellig =
          !isEqual(form.getValues(), form.formState.defaultValues) && !isEqual(form.getValues(), previousValues);

        if (erForskjellig && form.formState.isDirty) {
          previousValues = values;
          debouncedLagreMellomlagring(values);
        }
      },
    });

    return () => {
      debouncedLagreMellomlagring.cancel();
      unsubscribe();
    };
  }, [form, debouncedLagreMellomlagring]);

  async function slettMellomlagring(callback?: () => void) {
    debouncedLagreMellomlagring.cancel();
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
