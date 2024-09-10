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
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Dato
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Til og med dato
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Type
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} scope={'col'}>
              Handling
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bruddDatoPerioder.map((element) => (
            <AktivitetsmeldingDatoTabellRad
              key={element.id}
              type={element.type}
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
              onDelete={() =>
                setBruddDatoPerioder((prevState) => prevState.filter((something) => something.id !== element.id))
              }
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
