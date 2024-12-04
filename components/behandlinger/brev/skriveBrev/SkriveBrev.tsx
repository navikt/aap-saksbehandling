'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { Button, Label, Loader } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useDebounce } from 'hooks/DebounceHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { clientMellomlagreBrev } from 'lib/clientApi';
import { Brev } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

import style from './SkrivBrev.module.css';

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
  const [sistLagret, setSistLagret] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const debouncedBrev = useDebounce<Brev>(brev, 2000);

  const mellomlagreBackendRequest = useCallback(async () => {
    setIsSaving(true);
    const res = await clientMellomlagreBrev(referanse, debouncedBrev);
    if (res != undefined) {
      console.log('res', res);
      setSistLagret(new Date());
    }
    setIsSaving(false);
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
      <div className={style.sistLagret}>
        {sistLagret && <Label as="p">Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Label>}
        {isSaving && <Loader />}
      </div>
      <Brevbygger brevmal={brev} onBrevChange={onChange} logo={NavLogo} />
      <Button
        onClick={() =>
          // TODO: Mellomlagre brev før vi ferdigstiller
          løsBehovOgGåTilNesteSteg({
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.SKRIV_BREV_KODE,
              brevbestillingReferanse: { brevbestillingReferanse: referanse },
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
