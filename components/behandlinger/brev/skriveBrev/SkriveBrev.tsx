'use client';

import { Brevbygger, BrevbyggerBeta } from '@navikt/aap-breveditor/';
import { ActionMenu, Button, Label, Loader, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useDebounce } from 'hooks/DebounceHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { clientHentFlyt, clientMellomlagreBrev } from 'lib/clientApi';
import { Brev, BrevMottaker, BrevStatus, Signatur } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

import style from './SkrivBrev.module.css';
import { revalidateFlyt } from 'lib/actions/actions';
import { ChevronDownIcon, GlassIcon, TrashIcon } from '@navikt/aksel-icons';
import { ForhåndsvisBrevModal } from 'components/behandlinger/brev/skriveBrev/ForhåndsvisBrevModal';
import { IkkeSendBrevModal } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { isSuccess } from 'lib/utils/api';
import { isProd } from 'lib/utils/environment';

export const SkriveBrev = ({
  referanse,
  behovstype,
  behandlingVersjon,
  mottaker,
  saksnummer,
  grunnlag,
  signaturer,
  status,
  readOnly,
}: {
  referanse: string;
  behovstype: Behovstype;
  mottaker: BrevMottaker;
  saksnummer?: string;
  behandlingVersjon: number;
  grunnlag: Brev;
  signaturer: Signatur[];
  status: BrevStatus;
  readOnly: boolean;
}) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const [brev, setBrev] = useState<Brev>(grunnlag);
  const [sistLagret, setSistLagret] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const debouncedBrev = useDebounce<Brev>(brev, 2000);

  const [forhåndsvisModalOpen, setForhåndsvisModalOpen] = useState(false);
  const [ikkeSendBrevModalOpen, settIkkeSendBrevModalOpen] = useState(false);

  const mellomlagreBackendRequest = useCallback(async () => {
    setIsSaving(true);
    const res = await clientMellomlagreBrev(referanse, debouncedBrev);
    if (isSuccess(res) && res.data != undefined) {
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
        behovstype: behovstype,
        brevbestillingReferanse: referanse,
        handling: 'AVBRYT',
      },
      referanse: behandlingsReferanse,
    });
    await revalidateFlyt(behandlingsReferanse);
    settIkkeSendBrevModalOpen(false);
  };

  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BREV');

  return (
    <div className={style.brevbygger}>
      <div className={style.topBar}>
        <div className={style.sistLagret}>
          {sistLagret && <Label as="p">Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Label>}
          {isSaving && <Loader />}
        </div>
        {!readOnly && (
          <ActionMenu>
            <ActionMenu.Trigger>
              <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                Andre handlinger
              </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
              <ActionMenu.Group label="Brev">
                <ActionMenu.Item
                  icon={<GlassIcon />}
                  onSelect={() => {
                    setForhåndsvisModalOpen(true);
                  }}
                >
                  Forhåndsvis brev
                </ActionMenu.Item>
                <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={() => settIkkeSendBrevModalOpen(true)}>
                  Ikke send brev
                </ActionMenu.Item>
              </ActionMenu.Group>
            </ActionMenu.Content>
          </ActionMenu>
        )}
      </div>

      <VStack gap={'4'}>
        {isProd() ? (
          <Brevbygger
            brevmal={brev}
            mottaker={mottaker}
            saksnummer={saksnummer}
            onBrevChange={onChange}
            logo={NavLogo}
            signatur={signaturer}
            readOnly={readOnly}
          />
        ) : (
          <BrevbyggerBeta
            brevmal={brev}
            mottaker={mottaker}
            saksnummer={saksnummer}
            onBrevChange={onChange}
            logo={NavLogo}
            signatur={signaturer}
            readonly={readOnly}
          />
        )}
        {!readOnly && (
          <Button
            disabled={status !== 'FORHÅNDSVISNING_KLAR'}
            onClick={async () => {
              await clientMellomlagreBrev(referanse, brev);
              const flyt = await clientHentFlyt(behandlingsReferanse);
              if (flyt.type === 'SUCCESS' && flyt.data.behandlingVersjon) {
                løsBehovOgGåTilNesteSteg({
                  behandlingVersjon: flyt.data.behandlingVersjon,
                  behov: {
                    behovstype: behovstype,
                    brevbestillingReferanse: referanse,
                    handling: 'FERDIGSTILL',
                  },
                  referanse: behandlingsReferanse,
                });
                await revalidateFlyt(behandlingsReferanse);
              }
            }}
            className={'fit-content'}
            loading={isLoading}
          >
            Send brev
          </Button>
        )}
      </VStack>

      <ForhåndsvisBrevModal
        isOpen={forhåndsvisModalOpen}
        brevbestillingReferanse={referanse}
        onClose={() => {
          setForhåndsvisModalOpen(false);
        }}
      />
      <IkkeSendBrevModal
        isOpen={ikkeSendBrevModalOpen}
        onClose={() => {
          settIkkeSendBrevModalOpen(false);
        }}
        onDelete={() => {
          slettBrev();
        }}
      />
    </div>
  );
};
