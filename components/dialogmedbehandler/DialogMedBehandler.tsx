import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Label, Link, Loader, VStack } from '@navikt/ds-react';

import { KommendeMeldinger } from 'components/dialogmedbehandler/KommendeMeldinger';
import { Melding } from 'components/dialogmedbehandler/Melding';

import styles from './DialogMedBehandler.module.css';
import { Alert } from '../alert/Alert';
import { KommendeMeldingDto, MeldingMedDokumenterDto } from '../../lib/types/types';

interface Props {
  behandlingsreferanse: string;
  meldingerMedDokumentliste: MeldingMedDokumenterDto[] | undefined;
  kommendeMeldinger: KommendeMeldingDto[] | undefined;
  isLoading: boolean;
  error: string | undefined;
  refetchDialogmeldingerClient: () => Promise<unknown>;
}

export const DialogMedBehandler = ({
  behandlingsreferanse,
  meldingerMedDokumentliste,
  kommendeMeldinger,
  isLoading,
  error,
  refetchDialogmeldingerClient,
}: Props) => {
  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }
  return (
    <section>
      <VStack>
        <Label>Dialog med behandler</Label>
        <Link
          href="https://navno.sharepoint.com/sites/fag-og-ytelser-radgivende-legetjeneste/SitePages/Felles-rutine-for-innhenting-av-helseopplysninger.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rutiner for innhenting av helseopplysninger <ExternalLinkIcon />
        </Link>
      </VStack>

      {isLoading && <Loader size="large" />}

      {!isLoading && (
        <VStack gap={'space-20'} className={styles.meldingervindu}>
          {meldingerMedDokumentliste?.map((meldingMedDokumentliste, index) => (
            <Melding
              key={index}
              visningType={meldingMedDokumentliste.melding.innkommendeUtgående}
              // Mangler dokumentasjonstype i mottatt_dialogmelding-tabellen i 'dokumentinnhenting'
              dokumentasjonType={
                meldingMedDokumentliste.melding.innkommendeUtgående === 'INNKOMMENDE'
                  ? 'MELDING_FRA_BEHANDLER'
                  : meldingMedDokumentliste.melding.dokumentasjonsType!
              }
              meldingFraNavn={meldingMedDokumentliste.melding.meldingFraNavn}
              opprettetTidspunkt={meldingMedDokumentliste.melding.opprettetTidspunkt}
              status={meldingMedDokumentliste.melding.meldingStatus}
              journalpostId={meldingMedDokumentliste.melding.journalpostId}
              dokumentInfoIdListe={meldingMedDokumentliste.dokumentIdListe}
            >
              {meldingMedDokumentliste.melding.tekst}
            </Melding>
          ))}
        </VStack>
      )}

      {kommendeMeldinger && kommendeMeldinger.length > 0 && (
        <KommendeMeldinger
          kommendeMeldinger={kommendeMeldinger}
          behandlingsreferanse={behandlingsreferanse}
          refetchDialogmeldinger={refetchDialogmeldingerClient}
        />
      )}
    </section>
  );
};
