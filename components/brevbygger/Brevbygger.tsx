'use client';

import { BodyShort, Box, Button, HGrid, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { revalidateBehandlingPath } from 'lib/actions/actions';
import { clientOppdaterBrevmal } from 'lib/clientApi';
import { BrevdataDto, BrevGrunnlagBrev, BrevMottaker, Mottaker, RefusjonskravGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiBrevVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { IkkeSendBrevModal, IkkeSendFields } from 'components/behandlinger/brev/skriveBrev/IkkeSendBrevModal';
import { Distribusjonssjekk } from 'components/brev/Distribusjonssjekk';
import { Delmal } from 'components/brevbygger/Delmal';
import { FerdigstillBrevDialog } from 'components/brevbygger/FerdigstillBrevDialog';
import { RefusjonskravVisning } from 'components/brevbygger/RefusjonskravVisning';
import { StandardtekstBoks } from 'components/brevbygger/StandardtekstBoks';
import { VelgeMottakere } from 'components/brevbygger/VelgeMottakere';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { initialiserFormVerdier } from 'components/brevbygger/formUtils';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { useMellomlagringAvBrev } from 'components/brevbygger/useMellomlagringAvBrev';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

import styles from './Brevbygger.module.css';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

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
  brevtype: BrevGrunnlagBrev['brevtype'];
}

type ParsingResultat = {
  parsedBrevmal: BrevmalType | null;
  parsingFeilmelding: string | null;
};

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
  brevtype,
}: BrevbyggerProps) => {
  const { parsedBrevmal, parsingFeilmelding } = useMemo<ParsingResultat>(() => {
    try {
      return {
        parsedBrevmal: JSON.parse(brevmal ?? ''),
        parsingFeilmelding: null,
      };
    } catch (e) {
      return {
        parsedBrevmal: null,
        parsingFeilmelding: e instanceof Error ? e.message : String(e),
      };
    }
  }, [brevmal]);

  const { control, trigger } = useForm<BrevFormVerdier>({
    values: parsedBrevmal ? initialiserFormVerdier(parsedBrevmal, brevdata) : undefined,
  });
  const umamiStartTidspunkt = useUmamiStartTidspunkt('AKTIV');
  const { brevPreview, lasterBrevdata } = useMellomlagringAvBrev({
    referanse,
    control,
    brevmal: parsedBrevmal,
    brevdata,
  });

  const router = useRouter();
  const { behandlingsreferanse, saksnummer } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovStatus, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('BREV');

  const [valgteMottakere, setMottakere] = useState<Mottaker[]>([]);
  const [distribusjonssjekkFeil, setDistribusjonssjekkFeil] = useState<string | undefined>();
  const [ikkeSendBrevModalOpen, settIkkeSendBrevModalOpen] = useState(false);
  const [visFerdigstillBrevDialog, settVisFerdigstillBrevDialog] = useState(false);

  if (!parsedBrevmal) {
    return (
      <LocalAlert status={'error'} size={'small'}>
        <LocalAlert.Header>
          <LocalAlert.Title>Feil ved parsing av brevmal</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          <BodyShort size={'small'}>Feilmeldingen var: {parsingFeilmelding}</BodyShort>
          <BodyShort size={'small'} weight={'semibold'}>
            Dersom feilen vedvarer kan du ta kontakt med brukerstøtte for å få løst problemet.
          </BodyShort>
        </LocalAlert.Content>
      </LocalAlert>
    );
  }

  const ferdigstillBrev = async () => {
    const isValid = await trigger();
    if (!isValid) return;
    settVisFerdigstillBrevDialog(true);
  };

  const sendBrev = async () => {
    løsAvklaringsbehov(
      {
        behandlingVersjon,
        behov: {
          behovstype,
          brevbestillingReferanse: referanse,
          mottakere: valgteMottakere,
          handling: 'FERDIGSTILL',
        },
        referanse: behandlingsreferanse,
      },
      () => loggUmamiBrevVarighet('STEG_BREVBYGGER_VARIGHET', umamiStartTidspunkt, Date.now(), brevtype)
    );
  };

  const slettBrev = async (ikkeSendBrevForm: IkkeSendFields) => {
    løsAvklaringsbehov({
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
          {/* Antall kolonner som returneres fra Delmal må matche antallet kolonner her. Ønsker at kolonnene skal være like brede på tvers, dermed er grid definert her */}
          <HGrid columns={'1fr 2fr'} gap={'space-12 space-24'}>
            <StandardtekstBoks />
            <div
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
                isLoading={lasterBrevdata}
              />
            ))}
          </HGrid>
        </VStack>

        <Box marginBlock={'space-8 space-0'}>
          <LøsBehovOgGåTilNesteStegStatusAlert
            status={løsAvklaringsbehovStatus}
            løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
          />
        </Box>

        <HStack gap="space-8" justify="space-between" marginBlock="space-24">
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
                disabled={løsAvklaringsbehovIsLoading}
              >
                Ikke send brev
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={oppdaterBrevmal} disabled={løsAvklaringsbehovIsLoading}>
              Oppdater brevmal
            </Button>
          </HStack>
          <Button type="button" onClick={ferdigstillBrev}>
            Ferdigstill brev
          </Button>
        </HStack>
      </Box>

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
        senderBrev={løsAvklaringsbehovIsLoading}
        løsBehovStatus={løsAvklaringsbehovStatus}
        løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      />
    </>
  );
};
