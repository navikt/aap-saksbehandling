'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { useDebounce } from 'hooks/DebounceHook';
import { mellomlagreBrev } from 'lib/clientApi';
import { Brev } from 'lib/types/types';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

export const SkriveBrev = ({ referanse, grunnlag }: { referanse: string; grunnlag: Brev }) => {
  const [brev, setBrev] = useState<Brev>(grunnlag);

  const debouncedBrev = useDebounce<Brev>(brev, 2000);

  const mellomlagreBackendRequest = useCallback(async () => {
    await mellomlagreBrev(referanse, debouncedBrev);
  }, [debouncedBrev, referanse]);

  useEffect(() => {
    mellomlagreBackendRequest();
  }, [debouncedBrev, mellomlagreBackendRequest]);

  const onChange = (brev: Brev) => {
    setBrev(brev);
  };

  return <Brevbygger brevmal={brev} onBrevChange={onChange} logo={NavLogo} />;
};
