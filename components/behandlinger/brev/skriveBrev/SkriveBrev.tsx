'use client';

import { BrevbyggerBeta } from '@navikt/aap-breveditor/';
import { ChevronDownIcon, GlassIcon, TrashIcon } from '@navikt/aksel-icons';
import { ActionMenu, BodyShort, Button, HStack, Label, List, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { useDebounce } from 'hooks/DebounceHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { revalidateBehandlingPath } from 'lib/actions/actions';
import { clientHentFlyt, clientMellomlagreBrev } from 'lib/clientApi';
import { Brev, BrevBehovstype, BrevGrunnlagBrev, BrevStatus, IdentOgNavn, Mottaker, Signatur } from 'lib/types/types';
import { isError, isSuccess } from 'lib/utils/api';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { loggUmamiBrevVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import NavLogo from 'public/nav_logo.png';
import { useCallback, useEffect, useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { ForhåndsvisBrevModal } from 'components/behandlinger/brev/skriveBrev/ForhåndsvisBrevModal';
import { IkkeSendBrevModal, IkkeSendFields } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { FerdigstillBrevDialog } from 'components/brevbygger/FerdigstillBrevDialog';
import { VelgMottakere_SkriveBrev } from 'components/brevbygger/mottaker/VelgMottakere_SkriveBrev';

export const SkriveBrev = ({
  referanse,
  behovstype,
  behandlingVersjon,
  mottaker,
  kopimottaker,
  fullmektigMottaker,
  bruker,
  grunnlag,
  signaturer,
  visAvbryt = true,
  status,
  readOnly,
  brevtype,
  visGReguleringInfoboks = true,
}: {
  referanse: string;
  behovstype: BrevBehovstype;
  mottaker: Mottaker;
  kopimottaker?: Mottaker;
  fullmektigMottaker?: Mottaker;
  bruker: IdentOgNavn;
  behandlingVersjon: number;
  grunnlag: Brev;
  signaturer: Signatur[];
  visAvbryt?: boolean;
  status: BrevStatus;
  readOnly: boolean;
  brevtype: BrevGrunnlagBrev['brevtype'];
  visGReguleringInfoboks?: boolean;
}) => {
  const [visFerdigstillBrevDialog, settVisFerdigstillBrevDialog] = useState(false);
  const { behandlingsreferanse, saksnummer } = useParamsMedType();
  const [brev, setBrev] = useState<Brev>(grunnlag);
  const [sistLagret, setSistLagret] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();
  const debouncedBrev = useDebounce<Brev>(brev, 2000);
  const [kanMellomlagreBrev, setKanMellomlagreBrev] = useState(true);
  const umamiStartTidspunkt = useUmamiStartTidspunkt('AKTIV');

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

  const { løsAvklaringsbehov, løsAvklaringsbehovStatus, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('BREV');

  useEffect(() => {
    if (kanMellomlagreBrev && !readOnly) {
      mellomlagreBackendRequest();
    }
  }, [debouncedBrev, mellomlagreBackendRequest, kanMellomlagreBrev, readOnly]);

  const onChange = (brev: Brev) => {
    setBrev(brev);
  };

  const slettBrev = async (ikkeSendBrevForm: IkkeSendFields) => {
    løsAvklaringsbehov({
      behandlingVersjon: behandlingVersjon,
      behov: {
        behovstype: behovstype,
        brevbestillingReferanse: referanse,
        begrunnelse: ikkeSendBrevForm.begrunnelse,
        handling: 'AVBRYT',
      },
      referanse: behandlingsreferanse,
    });
    await revalidateBehandlingPath(saksnummer, behandlingsreferanse);
    settIkkeSendBrevModalOpen(false);
  };

  const sendBrev = async () => {
    await clientMellomlagreBrev(referanse, brev);
    const flyt = await clientHentFlyt(behandlingsreferanse);
    if (isSuccess(flyt) && flyt.data.behandlingVersjon) {
      setKanMellomlagreBrev(false);
      løsAvklaringsbehov(
        {
          behandlingVersjon: flyt.data.behandlingVersjon,
          behov: {
            behovstype: behovstype,
            brevbestillingReferanse: referanse,
            handling: 'FERDIGSTILL',
          },
          referanse: behandlingsreferanse,
        },
        () => loggUmamiBrevVarighet('STEG_SKRIVBREV_VARIGHET', umamiStartTidspunkt, Date.now(), brevtype)
      );
    }
  };

  return (
    <>
      <div>
        <VelgMottakere_SkriveBrev
          bestillingsreferanse={referanse}
          readOnly={readOnly}
          bruker={bruker}
          initellMottaker={mottaker}
          initiellKopimottaker={kopimottaker}
          fullmektig={fullmektigMottaker}
        />

        <HStack gap="space-16" justify="space-between" wrap={false} align="center" marginBlock="space-0 space-16">
          <HStack gap="space-8">
            {sistLagret && <Label as="p">Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Label>}
            {isSaving && <Loader />}
            {error && <Alert variant="error">{error}</Alert>}
          </HStack>
          {!readOnly && (
            <ActionMenu>
              <ActionMenu.Trigger>
                <Button
                  data-color="neutral"
                  variant="secondary"
                  icon={<ChevronDownIcon aria-hidden />}
                  iconPosition="right"
                >
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

        <VStack gap={'space-16'}>
          {visGReguleringInfoboks && (
            <LocalAlert status={'warning'} size={'small'} style={{ maxWidth: '210mm' }}>
              <LocalAlert.Header>
                <LocalAlert.Title>G-regulering for AAP i Kelvin 2026</LocalAlert.Title>
              </LocalAlert.Header>
              <LocalAlert.Content>
                <BodyShort size={'small'}>
                  Se over om bruker har fått innvilget AAP i en periode før 1. mai. Hvis virkningstidspunktet er før 1.
                  mai 2026, må beslutter i dagens løsning
                </BodyShort>
                <List as={'ul'} size={'small'}>
                  <List.Item>Manuelt skrive inn den nye dagsatsen som gjelder fra 1. mai 2026.</List.Item>
                  <List.Item>Dagsatsen på virkningstidspunktet kommer automatisk i brevet.</List.Item>
                </List>
                <BodyShort size={'small'} style={{ marginTop: 'var(--ax-space-8)' }}>
                  Begge satsene finnes i steget «Tilkjent ytelse».
                </BodyShort>
              </LocalAlert.Content>
            </LocalAlert>
          )}
          <BrevbyggerBeta
            brevmal={brev}
            // Selve brevet skal alltid innholde den som mottar ytelsen, ikke den som mottar brevet.
            mottaker={{ ident: bruker.ident || 'Mangler', navn: bruker.navn || 'Mangler' }}
            saksnummer={saksnummer}
            onBrevChange={onChange}
            logo={NavLogo}
            signatur={signaturer}
            readonly={readOnly}
          />
          <LøsBehovOgGåTilNesteStegStatusAlert
            status={løsAvklaringsbehovStatus}
            løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
          />
          {!readOnly && (
            <HStack justify="end">
              <Button
                type="button"
                onClick={() => settVisFerdigstillBrevDialog(true)}
                disabled={status !== 'FORHÅNDSVISNING_KLAR'}
              >
                Ferdigstill brev
              </Button>

              <FerdigstillBrevDialog
                referanse={referanse}
                isOpen={visFerdigstillBrevDialog}
                onClose={() => settVisFerdigstillBrevDialog(false)}
                sendBrev={sendBrev}
                senderBrev={løsAvklaringsbehovIsLoading}
                løsBehovStatus={løsAvklaringsbehovStatus}
                løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
              />
            </HStack>
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
          onDelete={slettBrev}
        />
      </div>
    </>
  );
};
