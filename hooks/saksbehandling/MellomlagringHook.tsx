'use client';

import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagretVurdering } from 'lib/types/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce, isEqual } from 'lodash';
import { UseFormReturn } from 'react-hook-form';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { useBekreftVurderingerGrunnlag } from 'hooks/saksbehandling/BekrefteVurderingerHook';
import { useFeatureFlag } from 'context/UnleashContext';

export function useMellomlagring<T extends object>(
  behovstype: Behovstype,
  initialMellomlagring: MellomlagretVurdering | undefined,
  form: UseFormReturn<T>
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: (callback?: () => void) => void;
  mellomlagretVurdering?: MellomlagretVurdering;
  nullstillMellomlagretVurdering: () => void;
} {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { flyt } = useRequiredFlyt();
  const { refetchBekreftVurderingerGrunnlagClient } = useBekreftVurderingerGrunnlag();
  const automatiskMellomlagringFeatureFlag = useFeatureFlag('automatiskMellomlagring');

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

        if (flyt.aktivtSteg === 'BEKREFT_VURDERINGER_OPPFØLGING') {
          refetchBekreftVurderingerGrunnlagClient();
        }
      }
    },
    [behovstype, behandlingsReferanse, flyt.aktivtSteg, refetchBekreftVurderingerGrunnlagClient]
  );

  const debouncedLagreMellomlagring = useMemo(() => debounce(lagreMellomlagring, 2000), [lagreMellomlagring]);

  const isSubmitting = form.formState.isSubmitting;

  // Vi må avbryte lagring når bruker løser behov
  useEffect(() => {
    if (!automatiskMellomlagringFeatureFlag) return;
    if (isSubmitting) {
      debouncedLagreMellomlagring.cancel();
    }
  }, [isSubmitting, debouncedLagreMellomlagring, automatiskMellomlagringFeatureFlag]);

  useEffect(() => {
    if (!automatiskMellomlagringFeatureFlag) return;

    let previousValues: T | undefined;

    const unsubscribe = form.subscribe({
      formState: {
        values: true,
        isDirty: true,
      },
      callback: ({ values, isDirty }) => {
        /**
         * Hindrer unødvendig autosave:
         * - Sammenligner med defaultValues for å sjekke om brukeren faktisk har gjort endringer (RHF sin isDirty er ikke alltid pålitelig).
         * - Sammenligner med previousValues for å unngå å lagre samme data flere ganger når RHF trigges uten reelle endringer.
         */
        const erForskjellig = !isEqual(values, form.formState.defaultValues) && !isEqual(values, previousValues);

        if (erForskjellig && isDirty) {
          previousValues = values;
          debouncedLagreMellomlagring(values);
        }
      },
    });

    return () => {
      debouncedLagreMellomlagring.cancel();
      unsubscribe();
    };
  }, [form, debouncedLagreMellomlagring, automatiskMellomlagringFeatureFlag]);

  async function slettMellomlagring(callback?: () => void) {
    debouncedLagreMellomlagring.cancel();
    const res = await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });

    if (isSuccess(res)) {
      setMellomlagretVurdering(undefined);

      if (flyt.aktivtSteg === 'BEKREFT_VURDERINGER_OPPFØLGING') {
        refetchBekreftVurderingerGrunnlagClient();
      }

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
