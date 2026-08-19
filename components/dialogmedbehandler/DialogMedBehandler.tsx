import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Label, Link, VStack } from '@navikt/ds-react';

import { KommendeMeldinger } from 'components/dialogmedbehandler/KommendeMeldinger';
import { Melding } from 'components/dialogmedbehandler/Melding';

import styles from './DialogMedBehandler.module.css';
import { useDialogmeldinger } from 'hooks/saksbehandling/SakDialogmeldingerHook';

export const DialogMedBehandler = () => {
  const { dialogmeldinger } = useDialogmeldinger();

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
        {dialogmeldinger?.map((dialogmelding, index) => (
          <Melding
            key={index}
            visningType={dialogmelding.innkommendeUtgaaende}
            // TODO: Rydd opp bruken av dokumentasjonsType!
            dokumentasjonType={
              dialogmelding.innkommendeUtgaaende === 'INNKOMMENDE'
                ? 'MELDING_FRA_BEHANDLER'
                : dialogmelding.dokumentasjonsType
            }
            meldingFraNavn={dialogmelding.meldingFraNavn}
            opprettetTidspunkt={dialogmelding.opprettetTidspunkt?.toString()}
            status={dialogmelding.meldingStatus}
            journalpostId={dialogmelding.journalpostId}
            dokumentInfoIdListe={dialogmelding.dokumentIdListe}
          >
            {dialogmelding.tekst}
          </Melding>
        ))}
      </VStack>

      <KommendeMeldinger />
    </section>
  );
};
