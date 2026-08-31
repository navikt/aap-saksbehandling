import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Label, Link, VStack } from '@navikt/ds-react';

import { KommendeMeldinger } from 'components/dialogmedbehandler/KommendeMeldinger';
import { Melding } from 'components/dialogmedbehandler/Melding';

import styles from './DialogMedBehandler.module.css';
import { useDialogmeldinger } from 'hooks/saksbehandling/SakDialogmeldingerHook';

export const DialogMedBehandler = () => {
  const { dialogmeldingerMedDokumentliste } = useDialogmeldinger();

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
        {dialogmeldingerMedDokumentliste?.map((dialogmeldingMedDokumentliste, index) => (
          <Melding
            key={index}
            visningType={dialogmeldingMedDokumentliste.dialogmelding.innkommendeUtgaaende}
            // Mangler dokumentasjonstype i mottatt_dialogmelding-tabellen i 'dokumentinnhenting'
            dokumentasjonType={
              dialogmeldingMedDokumentliste.dialogmelding.innkommendeUtgaaende === 'INNKOMMENDE'
                ? 'MELDING_FRA_BEHANDLER'
                : dialogmeldingMedDokumentliste.dialogmelding.dokumentasjonsType
            }
            meldingFraNavn={dialogmeldingMedDokumentliste.dialogmelding.meldingFraNavn}
            opprettetTidspunkt={dialogmeldingMedDokumentliste.dialogmelding.opprettetTidspunkt?.toString()}
            status={dialogmeldingMedDokumentliste.dialogmelding.meldingStatus}
            journalpostId={dialogmeldingMedDokumentliste.dialogmelding.journalpostId}
            dokumentInfoIdListe={dialogmeldingMedDokumentliste.dokumentIdListe}
          >
            {dialogmeldingMedDokumentliste.dialogmelding.tekst}
          </Melding>
        ))}
      </VStack>

      <KommendeMeldinger />
    </section>
  );
};
