import { CheckmarkHeavyIcon, ExclamationmarkTriangleIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Detail, HStack, InlineMessage, Label, Link, VStack } from '@navikt/ds-react';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { DokumentInfoDto, MeldingDto } from 'lib/types/types';
import styles from './Melding.module.css';
import { useState } from 'react';
import { useSendPåminnelsePåDialogmelding } from 'hooks/FetchHook';
import { Alert } from 'components/alert/Alert';
import { useFeatureFlag } from 'context/UnleashContext';
import { loggUmamiBehandlerdialogKlikk } from 'lib/utils/umami/behandlerdialog';
import { BekreftManuellPåminnelseDialog } from 'components/dialogmedbehandler/BekreftManuellPåminnelseDialog';

interface Props {
  melding: MeldingDto;
  dokumentInfoIdListe: DokumentInfoDto[];
  behandlingsreferanse: string;
}

export const Melding = ({ melding, dokumentInfoIdListe, behandlingsreferanse }: Props) => {
  const {
    innkommendeUtgående,
    dokumentasjonsType,
    dialogmeldingId,
    meldingFraNavn,
    opprettetTidspunkt,
    meldingStatus: status,
    journalpostId,
    tekst,
    bestillerNavn,
    bestillerNavIdent,
  } = melding;

  const avsenderMottakerNavn =
    innkommendeUtgående === 'INNKOMMENDE' ? meldingFraNavn : (bestillerNavn ?? bestillerNavIdent ?? 'Nav');

  const viseKnappManuellPåminnelse = useFeatureFlag('KnappForManuellPaaminnelse');
  const [påminnelseSendt, settPåminnelseSendt] = useState(false);
  const [erDialogÅpen, settErDialogÅpen] = useState(false);
  const { sendPåminnelsePåDialogmelding, error } = useSendPåminnelsePåDialogmelding();

  const handlePåminnelseClick = async () => {
    if (dialogmeldingId && behandlingsreferanse && !påminnelseSendt) {
      settPåminnelseSendt(true);
      settErDialogÅpen(false);

      await sendPåminnelsePåDialogmelding(dialogmeldingId, behandlingsreferanse);

      loggUmamiBehandlerdialogKlikk('BEHANDLERDIALOG_SEND_MANUELL_PÅMINNELSE');
    }
  };

  const kanSendePåminnelse = melding.kanSendeManuellPåminnelse && !påminnelseSendt;

  return (
    <VStack gap={'space-4'} align={innkommendeUtgående === 'INNKOMMENDE' ? 'start' : 'end'}>
      <Detail>
        <b>{avsenderMottakerNavn}</b> {formatDatoMedMånedsnavn(opprettetTidspunkt)}
      </Detail>
      <Box
        className={
          innkommendeUtgående === 'INNKOMMENDE'
            ? styles.meldingboksInnkommende
            : `${styles.meldingboksUtgående} ${status === 'FEILET' && styles.meldingboksFeilet}`
        }
      >
        <VStack gap={'space-8'}>
          <VStack>
            {innkommendeUtgående === 'UTGÅENDE' && <Detail>{`Til ${meldingFraNavn}`}</Detail>}
            <Label size={'small'}>{mapDokumentasjonTypeTilTekst(dokumentasjonsType)}</Label>
            <BodyShort size={'small'}>{tekst}</BodyShort>
          </VStack>
          {dokumentInfoIdListe.length > 0 && (
            <Box className={styles.vedleggboks}>
              {dokumentInfoIdListe?.map((dokumentInfoObjekt, index) => (
                <Link
                  key={index}
                  inlineText={true}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/saksbehandling/api/dokumenter/${journalpostId}/${dokumentInfoObjekt.dokumentInfoId}`}
                >
                  <HStack align={'center'} gap={'space-8'}>
                    <PaperclipIcon title="Vedlagt fil" fontSize="2rem" className={styles.vedleggikon} />
                    <BodyShort>{mapDokumentasjonTypeTilTekst(dokumentasjonsType)}</BodyShort>
                  </HStack>
                </Link>
              ))}
            </Box>
          )}
          {viseKnappManuellPåminnelse && innkommendeUtgående === 'UTGÅENDE' && dokumentasjonsType === 'L40' && (
            <HStack gap={'space-8'} justify="start">
              {kanSendePåminnelse && meldingFraNavn !== null && (
                <Button size={'small'} variant={'tertiary'} onClick={() => settErDialogÅpen(true)}>
                  Send påminnelse
                </Button>
              )}

              {påminnelseSendt && !error && <InlineMessage status="success">Påminnelse sendt</InlineMessage>}

              {error && <Alert variant="error">{error}</Alert>}

              {meldingFraNavn !== null && (
                <BekreftManuellPåminnelseDialog
                  navnPåMottaker={meldingFraNavn ?? 'Ukjent'} // For å unngå klaging fra typesystemet
                  erÅpen={erDialogÅpen}
                  settErÅpen={(verdi) => settErDialogÅpen(verdi)}
                  bekreft={handlePåminnelseClick}
                />
              )}
            </HStack>
          )}
        </VStack>
      </Box>
      {innkommendeUtgående === 'UTGÅENDE' && (
        <VStack align={'end'}>
          <HStack gap={'space-2'} align={'center'} className={status === 'FEILET' ? styles.feilmelding : ''}>
            {mapStatusTilIkon(status)}
            <Detail>{mapStatusTilTekst(status)}</Detail>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

const mapDokumentasjonTypeTilTekst = (dokumentasjonsType?: MeldingDto['dokumentasjonsType']) => {
  switch (dokumentasjonsType) {
    case 'L120':
      return 'Forespørsel om legeerklæring L120';
    case 'L40':
      return 'Forespørsel om legeerklæring L40';
    case 'L8':
      return 'Forespørsel om tilleggsopplysninger L8';
    case 'MELDING_FRA_NAV':
      return 'Melding fra NAV';
    case 'PURRING':
      return 'Påminnelse til behandler';
    case 'RETUR_LEGEERKLÆRING':
      return 'Retur legeerklæring';
    default:
      return '';
  }
};

const mapStatusTilIkon = (status: MeldingDto['meldingStatus']) => {
  switch (status) {
    case 'SENDT':
      return <CheckmarkHeavyIcon title="Sendt" fontSize="1rem" aria-hidden />;
    case 'LEVERT':
      return <CheckmarkHeavyIcon title="Sendt" fontSize="1rem" aria-hidden />;
    case 'FEILET':
      return <ExclamationmarkTriangleIcon title="Feilet" fontSize="1rem" aria-hidden />;
    default:
      return null;
  }
};

const mapStatusTilTekst = (status: MeldingDto['meldingStatus']) => {
  switch (status) {
    case 'SENDT':
      return 'Sendt';
    case 'LEVERT':
      return 'Sendt';
    case 'FEILET':
      return 'Feilet';
    default:
      return 'Sender ...';
  }
};
