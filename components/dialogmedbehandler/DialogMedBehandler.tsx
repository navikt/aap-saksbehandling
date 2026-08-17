import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, Label, Link, VStack } from '@navikt/ds-react';

import { KommendeMeldinger } from 'components/dialogmedbehandler/KommendeMeldinger';
import { Melding } from 'components/dialogmedbehandler/Melding';

import styles from './DialogMedBehandler.module.css';
import { useDialogmeldinger } from 'hooks/saksbehandling/SakDialogmeldingerHook';

/*
interface MeldingDto {
  visningType: 'INNKOMMENDE' | 'UTGÅENDE';
  dokumentasjonType: DokumentasjonType;
  meldingFraNavn: string;
  opprettetTidspunkt: string;
  tekst: string;
  status: 'SENDT' | 'LEVERT' | 'FEILET';
  journalpostId: string;
  dokumentIdListe: string[];
}
*/

/*
const innkommendeMeldingerMock: MeldingDto[] = [
  {
    visningType: 'INNKOMMENDE',
    dokumentasjonType: 'MOTTATT_L40',
    meldingFraNavn: 'Dr. Sonja Paracet',
    opprettetTidspunkt: '2026-07-12',
    tekst: 'foo',
    status: 'LEVERT',
  },
];

const utgåendeMeldingerMock: MeldingDto[] = [
  {
    visningType: 'UTGÅENDE',
    dokumentasjonType: 'MELDING_FRA_NAV',
    meldingFraNavn: 'Nav, Kari Normann',
    opprettetTidspunkt: '2026-06-18',
    tekst: 'foo',
    status: 'LEVERT',
  },
  {
    visningType: 'UTGÅENDE',
    dokumentasjonType: 'PÅMINNELSE',
    meldingFraNavn: 'Nav, automatisk',
    opprettetTidspunkt: '2026-07-09',
    tekst: 'foo',
    status: 'FEILET',
  },
  {
    visningType: 'UTGÅENDE',
    dokumentasjonType: 'RETUR_LEGEERKLÆRING',
    meldingFraNavn: 'Nav, Kari Normann',
    opprettetTidspunkt: '2026-06-18',
    tekst: 'foo',
    status: 'SENDT',
  },
];

const meldingerMock = [...utgåendeMeldingerMock, ...innkommendeMeldingerMock];
*/

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
          >
            {dialogmelding.tekst}
          </Melding>
        ))}
      </VStack>

      <KommendeMeldinger />

      <VStack align={'end'}>
        <Button variant={'secondary'}>Send forespørsel til behandler</Button>
      </VStack>
    </section>
  );
};
