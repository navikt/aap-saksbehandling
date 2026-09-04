import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Label, Link, VStack } from '@navikt/ds-react';

import { KommendeMeldinger } from 'components/dialogmedbehandler/KommendeMeldinger';
import { Melding } from 'components/dialogmedbehandler/Melding';

import styles from './DialogMedBehandler.module.css';
import { useMeldingerFraDialog } from 'hooks/saksbehandling/SakMeldingerFraDialogHook';

export const DialogMedBehandler = () => {
  const { meldingerMedDokumenliste } = useMeldingerFraDialog();

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

      <VStack gap={'space-20'} className={styles.meldingervindu}>
        {meldingerMedDokumenliste?.map((meldingMedDokumentliste, index) => (
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

      <KommendeMeldinger />
    </section>
  );
};
