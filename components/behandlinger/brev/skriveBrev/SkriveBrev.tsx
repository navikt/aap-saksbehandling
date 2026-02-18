'use client';

import { BrevbyggerBeta } from '@navikt/aap-breveditor/';
import { ActionMenu, Alert, Button, HStack, Label, Loader, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useDebounce } from 'hooks/DebounceHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { clientHentFlyt, clientMellomlagreBrev } from 'lib/clientApi';
import { Brev, BrevMottaker, BrevStatus, Mottaker, Signatur } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';

import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';
import { revalidateFlyt } from 'lib/actions/actions';
import { ChevronDownIcon, GlassIcon, TrashIcon } from '@navikt/aksel-icons';
import { ForhåndsvisBrevModal } from 'components/behandlinger/brev/skriveBrev/ForhåndsvisBrevModal';
import { IkkeSendBrevModal } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { isError, isSuccess } from 'lib/utils/api';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { Distribusjonssjekk } from 'components/brev/Distribusjonssjekk';

export const SkriveBrev = ({
  referanse,
  behovstype,
  behandlingVersjon,
  mottaker,
  fullmektigMottaker,
  brukerMottaker,
  saksnummer,
  grunnlag,
  signaturer,
  visAvbryt = true,
  status,
  readOnly,
}: {
  referanse: string;
  behovstype: Behovstype;
  mottaker: BrevMottaker;
  fullmektigMottaker?: Mottaker;
  brukerMottaker?: Mottaker;
  saksnummer?: string;
  behandlingVersjon: number;
  grunnlag: Brev;
  signaturer: Signatur[];
  visAvbryt?: boolean;
  status: BrevStatus;
  readOnly: boolean;
}) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const [brev, setBrev] = useState<Brev>(grunnlag);
  const [sistLagret, setSistLagret] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [distribusjonssjekkFeil, setDistribusjonssjekkFeil] = useState<string>();
  const debouncedBrev = useDebounce<Brev>(brev, 2000);
  const [kanMellomlagreBrev, setKanMellomlagreBrev] = useState(true);
  const [valgteMottakere, setMottakere] = useState<Mottaker[]>([]);

  const [forhåndsvisModalOpen, setForhåndsvisModalOpen] = useState(false);
  const [ikkeSendBrevModalOpen, settIkkeSendBrevModalOpen] = useState(false);

  const mellomlagreBackendRequest = useCallback(async () => {
    setIsSaving(true);
    const res = await clientMellomlagreBrev(referanse, debouncedBrev);
    if (isSuccess(res) && res.data != undefined) {
      setSistLagret(new Date());
      setError(undefined);
    } else if (isError(res)) {
      setError(`Feil ved mellomlagring av brevet. ${res.apiException.message}`);
    }
    setIsSaving(false);
  }, [debouncedBrev, referanse]);

  const {
    løsBehovOgGåTilNesteSteg,
    status: løsBehovStatus,
    isLoading,
    løsBehovOgGåTilNesteStegError,
  } = useLøsBehovOgGåTilNesteSteg('BREV');

  useEffect(() => {
    if (kanMellomlagreBrev && !readOnly) {
      mellomlagreBackendRequest();
    }
  }, [debouncedBrev, mellomlagreBackendRequest, kanMellomlagreBrev, readOnly]);

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

  return (
    <>
      {fullmektigMottaker && brukerMottaker && (
        <VelgeMottakere
          setMottakere={setMottakere}
          readOnly={readOnly}
          brukerNavn={mottaker.navn}
          bruker={brukerMottaker}
          fullmektig={fullmektigMottaker}
        />
      )}
      <div>
        <HStack gap="4" justify="space-between" wrap={false} align="center" marginBlock="0 4">
          <HStack gap="2">
            {sistLagret && <Label as="p">Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Label>}
            {isSaving && <Loader />}
            {error && (
              <Alert variant="error" size="small">
                {error}
              </Alert>
            )}
          </HStack>
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
                  {visAvbryt && (
                    <ActionMenu.Item
                      variant="danger"
                      icon={<TrashIcon />}
                      onSelect={() => settIkkeSendBrevModalOpen(true)}
                    >
                      Ikke send brev
                    </ActionMenu.Item>
                  )}
                </ActionMenu.Group>
              </ActionMenu.Content>
            </ActionMenu>
          )}
        </HStack>

        <VStack gap={'4'}>
          <BrevbyggerBeta
            brevmal={brev}
            mottaker={mottaker}
            saksnummer={saksnummer}
            onBrevChange={onChange}
            logo={NavLogo}
            signatur={signaturer}
            readonly={readOnly}
          />
          <LøsBehovOgGåTilNesteStegStatusAlert
            status={løsBehovStatus}
            løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
          />
          <Distribusjonssjekk
            readOnly={readOnly}
            referanse={referanse}
            valgteMottakere={valgteMottakere}
            distribusjonssjekkFeil={distribusjonssjekkFeil}
            setDistribusjonssjekkFeil={setDistribusjonssjekkFeil}
            brukerMottaker={brukerMottaker}
          />
          {!readOnly && (
            <Button
              disabled={status !== 'FORHÅNDSVISNING_KLAR' || !!distribusjonssjekkFeil}
              onClick={async () => {
                await clientMellomlagreBrev(referanse, brev);
                const flyt = await clientHentFlyt(behandlingsReferanse);
                if (isSuccess(flyt) && flyt.data.behandlingVersjon) {
                  setKanMellomlagreBrev(false);
                  løsBehovOgGåTilNesteSteg({
                    behandlingVersjon: flyt.data.behandlingVersjon,
                    behov: {
                      behovstype: behovstype,
                      brevbestillingReferanse: referanse,
                      mottakere: valgteMottakere,
                      handling: 'FERDIGSTILL',
                    },
                    referanse: behandlingsReferanse,
                  });
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
    </>
  );
};

function VelgeMottakere({
  setMottakere,
  readOnly,
  fullmektig,
  brukerNavn,
  bruker,
}: {
  setMottakere: (mottakere: Mottaker[]) => void;
  readOnly: boolean;
  brukerNavn: string;
  bruker: Mottaker;
  fullmektig: Mottaker;
}) {
  interface FormFields {
    mottakere: ('BRUKER' | 'FULLMEKTIG')[];
  }

  const fullmektigNavn = fullmektig.navnOgAdresse?.navn;

  const { formFields, form } = useConfigForm<FormFields>(
    {
      mottakere: {
        type: 'checkbox',
        label: 'Velg mottakere',
        options: [
          { label: brukerNavn ? `${brukerNavn} (Bruker)` : 'Bruker', value: 'BRUKER' },
          { label: fullmektigNavn ? `${fullmektigNavn} (Fullmektig)` : 'Fullmektig', value: 'FULLMEKTIG' },
        ],
        defaultValue: ['FULLMEKTIG'],
      },
    },
    { readOnly }
  );

  const valgteMottakere = form.watch('mottakere');
  useEffect(() => {
    const mottakere = valgteMottakere.map((mottaker) => (mottaker === 'BRUKER' ? bruker : fullmektig));
    setMottakere(mottakere);
  }, [bruker, fullmektig, setMottakere, valgteMottakere]);

  return (
    <div>
      <FormField form={form} formField={formFields.mottakere} />
    </div>
  );
}
