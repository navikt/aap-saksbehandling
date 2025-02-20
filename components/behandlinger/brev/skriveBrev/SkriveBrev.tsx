'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { Button, Label, Loader } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useDebounce } from 'hooks/DebounceHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { clientMellomlagreBrev } from 'lib/clientApi';
import { Brev, BrevMottaker } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

import style from './SkrivBrev.module.css';
import { revalidateFlyt } from 'lib/actions/actions';

export const SkriveBrev = ({
  referanse,
  behandlingVersjon,
  mottaker,
  saksnummer,
  grunnlag,
}: {
  referanse: string;
  mottaker: BrevMottaker;
  saksnummer?: string;
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
    <div className={style.brevbygger}>
      <div className={style.sistLagret}>
        {sistLagret && <Label as="p">Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Label>}
        {isSaving && <Loader />}
      </div>
      <Brevbygger brevmal={brev} mottaker={mottaker} saksnummer={saksnummer} onBrevChange={onChange} logo={NavLogo} />
      <Button
        onClick={async () => {
          // TODO: Mellomlagre brev før vi ferdigstiller
          løsBehovOgGåTilNesteSteg({
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.SKRIV_BREV_KODE,
              brevbestillingReferanse: referanse,
            },
            referanse: behandlingsReferanse,
          });
          await revalidateFlyt(behandlingsReferanse);
        }}
      >
        Ferdigstill brev
      </Button>
    </div>
  );
};
