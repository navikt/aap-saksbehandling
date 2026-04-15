'use client';

import { Box, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';

import { BrevdataDto, BrevMottaker, Mottaker, RefusjonskravGrunnlag } from 'lib/types/types';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { Behovstype } from 'lib/utils/form';
import { clientOppdaterBrevmal } from 'lib/clientApi';
import { revalidateFlyt } from 'lib/actions/actions';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { ForhåndsvisBrev } from 'components/brevbygger/ForhåndsvisBrev';
import { VelgeMottakere } from 'components/brevbygger/VelgeMottakere';
import { IkkeSendBrevModal } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { RefusjonskravVisning } from 'components/brevbygger/RefusjonskravVisning';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { Distribusjonssjekk } from 'components/brev/Distribusjonssjekk';

import { BrevFormVerdier } from 'components/brevbygger/brevbyggerNy/types';
import { initialiserFormVerdier } from 'components/brevbygger/brevbyggerNy/formUtils';
import { Delmal } from 'components/brevbygger/brevbyggerNy/Delmal';
import { useMellomlagringAvBrev } from 'components/brevbygger/brevbyggerNy/useMellomlagringAvBrev';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

interface BrevbyggerNyProps {
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
}

export const BrevbyggerNy = ({
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
}: BrevbyggerNyProps) => {
  const parsedBrevmal: BrevmalType = JSON.parse(brevmal ?? '');
  const { control, trigger, watch } = useForm<BrevFormVerdier>({
    values: initialiserFormVerdier(parsedBrevmal, brevdata),
  });

  const { pdfDataUri, lasterPdf } = useMellomlagringAvBrev({ referanse, control, brevmal: parsedBrevmal, brevdata });

  const router = useRouter();
  const { behandlingsreferanse } = useParamsMedType();
  const {
    løsBehovOgGåTilNesteSteg,
    status: løsBehovStatus,
    isLoading,
    løsBehovOgGåTilNesteStegError,
  } = useLøsBehovOgGåTilNesteSteg('BREV');

  const [valgteMottakere, setMottakere] = useState<Mottaker[]>([]);
  const [distribusjonssjekkFeil, setDistribusjonssjekkFeil] = useState<string | undefined>();
  const [ikkeSendBrevModalOpen, settIkkeSendBrevModalOpen] = useState(false);
  const [pdfViewExpanded, setPdfViewExpanded] = useState(false);

  const sendBrev = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    løsBehovOgGåTilNesteSteg({
      behandlingVersjon,
      behov: {
        behovstype,
        brevbestillingReferanse: referanse,
        mottakere: valgteMottakere,
        handling: 'FERDIGSTILL',
      },
      referanse: behandlingsreferanse,
    });
  };

  const slettBrev = async () => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon,
      behov: {
        behovstype,
        brevbestillingReferanse: referanse,
        handling: 'AVBRYT',
      },
      referanse: behandlingsreferanse,
    });
    await revalidateFlyt(behandlingsreferanse);
  };

  const oppdaterBrevmal = async () => {
    await clientOppdaterBrevmal(referanse);
    router.refresh();
  };

  return (
    <HGrid columns={pdfViewExpanded ? '1fr 3fr' : '1fr 1fr'} gap="space-8">
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
          {parsedBrevmal.delmaler.map((delmalRef) => (
            <Delmal key={delmalRef._key} delmalRef={delmalRef} control={control} watch={watch} />
          ))}
        </VStack>

        <HStack gap="space-8" justify="space-between" marginBlock="space-16">
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
          <HStack gap="space-8">
            {visAvbryt && (
              <Button
                type="button"
                onClick={() => settIkkeSendBrevModalOpen(true)}
                variant="danger"
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
          <Button type="button" onClick={sendBrev} loading={isLoading} size="small" disabled={!!distribusjonssjekkFeil}>
            Send brev
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
        <ForhåndsvisBrev isLoading={lasterPdf} dataUri={pdfDataUri} />
      </VStack>
      <IkkeSendBrevModal
        isOpen={ikkeSendBrevModalOpen}
        onClose={() => settIkkeSendBrevModalOpen(false)}
        onDelete={slettBrev}
      />
    </HGrid>
  );
};
