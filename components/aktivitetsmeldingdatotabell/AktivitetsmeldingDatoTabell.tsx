import { Table } from '@navikt/ds-react';
import { AktivitetsmeldingDatoTabellRad } from './AktivitetsmeldingDatoTabellRad';
import { DatoBruddPåAktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  bruddDatoPerioder: DatoBruddPåAktivitetsplikt[];
  setBruddDatoPerioder: Dispatch<SetStateAction<DatoBruddPåAktivitetsplikt[]>>;
}

export const AktivitetsmeldingDatoTabell = ({ bruddDatoPerioder, setBruddDatoPerioder }: Props) => {
  return (
    <>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope={'col'}>Dato</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Dato</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Type</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Handling</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bruddDatoPerioder.map((element) => (
            <AktivitetsmeldingDatoTabellRad
              key={element.id}
              bruddDatoPeriode={element}
              onChange={(id, felt, value) => {
                if (element.type === 'enkeltdag') {
                  setBruddDatoPerioder((prevState) =>
                    prevState.map((dato) => (dato.id === id ? { ...dato, dato: value } : dato))
                  );
                } else {
                  setBruddDatoPerioder((prevState) =>
                    prevState.map((dato) => (dato.id === id ? { ...dato, [felt]: value } : dato))
                  );
                }
              }}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
