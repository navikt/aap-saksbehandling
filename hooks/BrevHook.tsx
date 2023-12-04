import { Brevmal } from 'lib/services/sanityservice/sanityservice';
import { Dispatch, useCallback, useEffect, useState } from 'react';

export function useBrev(): {
  brevmal?: Brevmal;
  setBrevmalId: Dispatch<string>;
} {
  const [brevmal, setBrevmal] = useState<Brevmal>();
  const [brevmalId, setBrevmalId] = useState<string>();

  const hentBrevmal = useCallback(() => {
    brevmalId && fetch(`/api/sanity/brevmal/${brevmalId}`).then(async (data) => setBrevmal(await data.json()));
  }, [brevmalId]);

  useEffect(hentBrevmal, [hentBrevmal]);

  return { brevmal, setBrevmalId };
}
