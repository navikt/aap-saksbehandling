'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { ActionMenu, Button, Label, Loader, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useDebounce } from 'hooks/DebounceHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { clientHentFlyt, clientMellomlagreBrev } from 'lib/clientApi';
import { BehandlingFlytOgTilstand, Brev, BrevMottaker, BrevStatus, Signatur } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

import style from './SkrivBrev.module.css';
import { revalidateFlyt } from 'lib/actions/actions';
import { ChevronDownIcon, GlassIcon, TrashIcon } from '@navikt/aksel-icons';
import { ActionMenuDivider } from '@navikt/ds-react/esm/overlays/action-menu';

export const SkriveBrev = ({
  referanse,
  behandlingVersjon,
  mottaker,
  saksnummer,
  grunnlag,
  signaturer,
  status,
}: {
  referanse: string;
  mottaker: BrevMottaker;
  saksnummer?: string;
  behandlingVersjon: number;
  grunnlag: Brev;
  signaturer: Signatur[];
  status: BrevStatus;
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

  const slettBrev = async () => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      behov: {
        behovstype: Behovstype.SKRIV_BREV_KODE,
        brevbestillingReferanse: referanse,
        handling: 'AVBRYT',
      },
      referanse: behandlingsReferanse,
    });
    await revalidateFlyt(behandlingsReferanse);
  };

  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BREV');

  return (
    <div className={style.brevbygger}>
      <div className={style.topBar}>
        <div className={style.sistLagret}>
          {sistLagret && <Label as="p">Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Label>}
          {isSaving && <Loader />}
        </div>
        <div>
          <ActionMenu>
            <ActionMenu.Trigger>
              <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                Andre handlinger
              </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
              <ActionMenu.Group label="Brev">
                <ActionMenu.Item icon={<GlassIcon />} onSelect={() => {}}>
                  Forhåndsvis brev
                </ActionMenu.Item>
                <ActionMenuDivider />
                <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={slettBrev}>
                  Slett brev
                </ActionMenu.Item>
              </ActionMenu.Group>
            </ActionMenu.Content>
          </ActionMenu>
        </div>
      </div>

      <VStack gap={'4'}>
        <Brevbygger
          brevmal={brev}
          mottaker={mottaker}
          saksnummer={saksnummer}
          onBrevChange={onChange}
          logo={NavLogo}
          signatur={signaturer}
        />
        <Button
          disabled={status !== 'FORHÅNDSVISNING_KLAR'}
          onClick={async () => {
            await clientMellomlagreBrev(referanse, brev);
            // @ts-ignore
            const flyt: BehandlingFlytOgTilstand = await clientHentFlyt(behandlingsReferanse);
            console.log('flyt', flyt);
            løsBehovOgGåTilNesteSteg({
              behandlingVersjon: flyt.behandlingVersjon,
              behov: {
                behovstype: Behovstype.SKRIV_BREV_KODE,
                brevbestillingReferanse: referanse,
                handling: 'FERDIGSTILL',
              },
              referanse: behandlingsReferanse,
            });
            await revalidateFlyt(behandlingsReferanse);
          }}
          className={'fit-content'}
          loading={isLoading}
        >
          Send brev
        </Button>
      </VStack>
    </div>
  );
};
