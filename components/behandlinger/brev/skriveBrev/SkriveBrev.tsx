'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { Button } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useDebounce } from 'hooks/DebounceHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { mellomlagreBrev } from 'lib/clientApi';
import { Brev } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

export const SkriveBrev = ({
  referanse,
  behandlingVersjon,
  grunnlag,
}: {
  referanse: string;
  behandlingVersjon: number;
  grunnlag: Brev;
}) => {
  const behandlingsReferanse = useBehandlingsReferanse();
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

  const { løsBehovOgGåTilNesteSteg } = useLøsBehovOgGåTilNesteSteg('BREV');

  return (
    <div>
      <Brevbygger brevmal={brev} onBrevChange={onChange} logo={NavLogo} />
      <Button
        onClick={() =>
          // TODO: Mellomlagre brev før vi ferdigstiller
          løsBehovOgGåTilNesteSteg({
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.SKRIV_BREV_KODE,
              brevbestillingReferanse: { referanse },
            },
            referanse: behandlingsReferanse,
          })
        }
      >
        Ferdigstill brev
      </Button>
    </div>
  );
};
