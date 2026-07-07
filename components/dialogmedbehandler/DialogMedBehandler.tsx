import { Button, Label, Link, VStack } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Melding } from 'components/dialogmedbehandler/Melding';
import styles from './DialogMedBehandler.module.css';
import { KommendeMeldinger } from 'components/dialogmedbehandler/KommendeMeldinger';

interface MeldingDto {
  visningType: 'INNKOMMENDE' | 'UTGÅENDE';
  dokumentasjonType: 'L120' | 'L40' | 'L8' | 'MELDING_FRA_NAV' | 'PURRING' | 'RETUR_LEGEERKLÆRING';
  meldingFraNavn: string;
  opprettetTidspunkt: string;
  tekst: string;
  status: 'SENDT' | 'LEVERT' | 'FEILET';
}

const innkommendeMeldingerMock: MeldingDto[] = [
  {
    visningType: 'INNKOMMENDE',
    dokumentasjonType: 'L40',
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
    dokumentasjonType: 'PURRING',
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

export const DialogMedBehandler = () => {
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
        {meldingerMock.map((melding, index) => (
          <Melding
            key={index}
            visningType={melding.visningType}
            dokumentasjonType={melding.dokumentasjonType}
            meldingFraNavn={melding.meldingFraNavn}
            opprettetTidspunkt={melding.opprettetTidspunkt}
            status={melding.status}
          >
            {melding.tekst}
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
