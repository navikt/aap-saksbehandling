import { Brevmal } from 'lib/services/sanityservice/sanityservice';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { hentBrevmalFraSanity } from 'lib/api';

export function useBrev(): {
  brevmal?: Brevmal;
  setBrevmalId: Dispatch<string>;
} {
  const [brevmal, setBrevmal] = useState<Brevmal>();
  const [brevmalId, setBrevmalId] = useState<string>();

  const hentBrevmal = useCallback(() => {
    brevmalId && hentBrevmalFraSanity(brevmalId).then((data) => setBrevmal(data));
  }, [brevmalId]);

  useEffect(hentBrevmal, [hentBrevmal]);

  return { brevmal, setBrevmalId };
}
