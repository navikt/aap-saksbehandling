'use client';

import { Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';

import { BrevdataDto, BrevMottaker, Mottaker, RefusjonskravGrunnlag, TypeBehandling } from 'lib/types/types';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { Behovstype } from 'lib/utils/form';
import { clientOppdaterBrevmal } from 'lib/clientApi';
import { revalidateBehandlingPath } from 'lib/actions/actions';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { VelgeMottakere } from 'components/brevbygger/VelgeMottakere';
import { IkkeSendBrevModal, IkkeSendFields } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { RefusjonskravVisning } from 'components/brevbygger/RefusjonskravVisning';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { Distribusjonssjekk } from 'components/brev/Distribusjonssjekk';

import { BrevFormVerdier } from 'components/brevbygger/types';
import { initialiserFormVerdier } from 'components/brevbygger/formUtils';
import { Delmal } from 'components/brevbygger/Delmal';
import { useMellomlagringAvBrev } from 'components/brevbygger/useMellomlagringAvBrev';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { loggUmamiEvent, useUmamiStartTidspunkt } from 'lib/utils/umami';
import { FerdigstillBrevDialog } from 'components/brevbygger/FerdigstillBrevDialog';

import styles from './Brevbygger.module.css';
import { StandardtekstBoks } from 'components/brevbygger/StandardtekstBoks';

interface BrevbyggerProps {
  referanse: string;
  behovstype: Behovstype;
  mottaker: BrevMottaker;
  behandlingVersjon: number;
  readOnly: boolean;
  visAvbryt?: boolean;
  fullmektigMottaker?: Mottaker;
  brukerMottaker?: Mottaker;
  brevmal?: string | null;
  brevdata?: BrevdataDto;
  refusjonskravgrunnlag?: RefusjonskravGrunnlag;
  behandlingstype: TypeBehandling;
}

export const Brevbygger = ({
  referanse,
  brevmal,
  brevdata,
  behovstype,
  mottaker,
  fullmektigMottaker,
  brukerMottaker,
  behandlingVersjon,
  readOnly,
  visAvbryt = true,
  refusjonskravgrunnlag,
  behandlingstype,
}: BrevbyggerProps) => {
  const parsedBrevmal: BrevmalType = useMemo(() => JSON.parse(brevmal ?? ''), [brevmal]);
  const { control, trigger } = useForm<BrevFormVerdier>({
    values: initialiserFormVerdier(parsedBrevmal, brevdata),
  });
  const umamiStartTidspunkt = useUmamiStartTidspunkt('AKTIV');
  const { brevPreview, lasterHtml } = useMellomlagringAvBrev({ referanse, control, brevmal: parsedBrevmal, brevdata });

  const router = useRouter();
  const { behandlingsreferanse, saksnummer } = useParamsMedType();
  const {
    løsBehovOgGåTilNesteSteg,
    status: løsBehovStatus,
    isLoading,
    løsBehovOgGåTilNesteStegError,
  } = useLøsBehovOgGåTilNesteSteg('BREV');

  const [valgteMottakere, setMottakere] = useState<Mottaker[]>([]);
  const [distribusjonssjekkFeil, setDistribusjonssjekkFeil] = useState<string | undefined>();
  const [ikkeSendBrevModalOpen, settIkkeSendBrevModalOpen] = useState(false);
  const [visFerdigstillBrevDialog, settVisFerdigstillBrevDialog] = useState(false);
  const [pdfViewExpanded, setPdfViewExpanded] = useState(false);

  const ferdigstillBrev = async () => {
    const isValid = await trigger();
    if (!isValid) return;
    settVisFerdigstillBrevDialog(true);
  };

  const sendBrev = async () => {
    løsBehovOgGåTilNesteSteg({
        behandlingVersjon,
        behov: {
          behovstype,
          brevbestillingReferanse: referanse,
          mottakere: valgteMottakere,
          handling: 'FERDIGSTILL',
        },
        referanse: behandlingsreferanse,
      },
      () =>
        loggUmamiEvent('brevbygger-varighet', {
          varighet_sekunder: Math.floor((Date.now() - umamiStartTidspunkt) / 1000),
          typeBehandling: behandlingstype,
        })
    );
  };

  const slettBrev = async (ikkeSendBrevForm: IkkeSendFields) => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon,
      behov: {
        behovstype,
        brevbestillingReferanse: referanse,
        begrunnelse: ikkeSendBrevForm.begrunnelse,
        handling: 'AVBRYT',
      },
      referanse: behandlingsreferanse,
    });
    await revalidateBehandlingPath(saksnummer, behandlingsreferanse);
  };

  const oppdaterBrevmal = async () => {
    await clientOppdaterBrevmal(referanse);
    router.refresh();
  };

  return (
    <>
      <Box>
        {fullmektigMottaker && brukerMottaker && (
          <VelgeMottakere
            setMottakere={setMottakere}
            readOnly={readOnly}
            brukerNavn={mottaker.navn}
            bruker={brukerMottaker}
            fullmektig={fullmektigMottaker}
          />
        )}

        <VStack gap="space-16">
          <RefusjonskravVisning refusjonskravgrunnlag={refusjonskravgrunnlag} />
          <HGrid columns={'1fr 2fr'} gap={'space-12'}>
            <StandardtekstBoks />
            <div
              style={{
                background: '#fff',
                padding: '1rem',
                marginLeft: '1rem',
              }}
              className={styles.brevheader}
              dangerouslySetInnerHTML={{ __html: brevPreview?.header.htmlString ?? '' }}
            />
            {parsedBrevmal.delmaler.map((delmalRef) => (
              <Delmal
                key={delmalRef._key}
                delmalRef={delmalRef}
                control={control}
                delmalInnhold={
                  brevPreview?.delmaler.find((innholdNode) => innholdNode.sanityNoekkel === delmalRef._key)?.htmlString
                }
                isLoading={lasterHtml}
              />
            ))}
          </HGrid>
        </VStack>

        <HStack gap="space-8" justify="space-between" marginBlock="space-8">
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
          <HStack gap={'space-8'}>
            {visAvbryt && (
              <Button
                data-color="danger"
                type="button"
                onClick={() => settIkkeSendBrevModalOpen(true)}
                variant="primary"
                size="small"
                disabled={isLoading}
              >
                Ikke send brev
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={oppdaterBrevmal} size="small" disabled={isLoading}>
              Oppdater brevmal
            </Button>
          </HStack>
          <Button type="button" onClick={ferdigstillBrev} size={'small'}>
            Ferdigstill brev
          </Button>
        </HStack>
      </Box>

      <VStack gap="space-8">
        <div>
          <Button
            type="button"
            onClick={() => setPdfViewExpanded(!pdfViewExpanded)}
            size="small"
            variant="tertiary"
            icon={pdfViewExpanded ? <ShrinkIcon /> : <ExpandIcon />}
          />
        </div>
      </VStack>
      <IkkeSendBrevModal
        isOpen={ikkeSendBrevModalOpen}
        onClose={() => settIkkeSendBrevModalOpen(false)}
        onDelete={slettBrev}
      />
      <FerdigstillBrevDialog
        referanse={referanse}
        isOpen={visFerdigstillBrevDialog}
        onClose={() => settVisFerdigstillBrevDialog(false)}
        sendBrev={sendBrev}
        senderBrev={isLoading}
      />
    </>
  );
};
