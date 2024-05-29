'use client';

import { Heading, Table } from '@navikt/ds-react';
import { AktivitetHistorikkTableRow } from 'components/aktivitethistorikk/AktivitetHistorikkTableRow';
interface Props {
  heading: string;
}
export interface AktivitetHistorikkType {
  grunn: string;
  begrunnelse: string;
  dato: string;
}

export const AktivitetHistorikk = ({ heading }: Props) => {
  return (
    <div>
      <Heading size={'medium'}>{heading}</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
            <Table.HeaderCell scope="col">Grunn</Table.HeaderCell>
            <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
            <Table.HeaderCell scope="col"> </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((aktivitet, i) => {
            return <AktivitetHistorikkTableRow key={i} aktivitet={aktivitet} />;
          })}{' '}
        </Table.Body>{' '}
      </Table>
    </div>
  );
};
const data: AktivitetHistorikkType[] = [
  {
    grunn: 'Ikke møtt til møte med Nav',
    begrunnelse: 'bla bal ljkdf kjfs fdkfl dflkjfs dfskjfsj fsjf jsdf',
    dato: '2020-04-28T19:12:14.358Z',
  },
  {
    grunn: 'Ikke møtt i tiltak',
    begrunnelse: 'fksdf sdfkslf fsdlf sdfjkf dsfjklf skljfdsk ldfklj fsfkjf skl fs klf sf sdfklsdf',
    dato: '2022-01-29T09:51:19.833Z',
  },
  { grunn: 'Ikke møtt til møte med Nav', begrunnelse: 'jdfks dfk lfs sdkljfs', dato: '2021-06-04T20:57:29.159Z' },
  {
    grunn: 'Ikke møtt til møte med Nav',
    begrunnelse: 'jksf sflkf slfk sf sdfksf lfsjkfldsk sfkjd sfl fs sl df ksdf',
    dato: '2015-08-31T15:47:36.293Z',
  },
  {
    grunn: 'Ikke møtt i behandling eller utredning',
    begrunnelse: 'kldf fdskljf sdf',
    dato: '2010-07-17T11:13:26.116Z',
  },
];
