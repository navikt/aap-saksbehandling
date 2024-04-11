'use client';

import { Heading, Link, List } from '@navikt/ds-react';
import { Kort } from 'components/oppgavebehandling/kort/Kort';

const saker = [
  'Knuslete Solbær 12345678910',
  'Kjent Påskeegg 12345678910',
  'Glovarm Kveldsmat 12345678910',
  'Hes Fyrstinne 12345678910',
  'Kosmisk Tare 12345678910',
  'Gjestfri Paraply 12345678910',
];

const Saksrad = ({ sak }: { sak: string }) => (
  <List.Item>
    <Link href={'#'}>{sak}</Link>
  </List.Item>
);

export const HøyreKolonne = () => {
  return (
    <Kort>
      <section>
        <List as={'ul'} size={'small'} title={'Dine siste saker'}>
          {saker.map((sak, index) => (
            <Saksrad key={index} sak={sak} />
          ))}
        </List>
      </section>
      <section>
        <Heading level={'2'} size={'medium'}>
          Statistikk
        </Heading>
      </section>
    </Kort>
  );
};
