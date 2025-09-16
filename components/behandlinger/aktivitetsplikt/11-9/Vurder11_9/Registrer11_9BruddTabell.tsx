import { TableStyled } from 'components/tablestyled/TableStyled';
import { Checkbox, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Vurdering11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import styles from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/rimeliggrunn.module.css';
import { formaterBrudd, formaterGrunn } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';

type Props = {
  readOnly?: boolean;
  tidligereVurderinger: Vurdering11_9[];
  onClickRad: (checked: boolean, dato: string) => void;
  valgteRader: string[];
};

export const Registrer11_9BruddTabell = ({
  readOnly = false,
  tidligereVurderinger,
  valgteRader,
  onClickRad,
}: Props) => {
  const sorterteRader = tidligereVurderinger.sort((a, b) => a.dato.localeCompare(b.dato));

  return (
    <div>
      <p>Marker rad for å endre en tidligere iverksatt registering</p>
      <TableStyled size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Dato</Table.HeaderCell>
            <Table.HeaderCell>Brudd</Table.HeaderCell>
            <Table.HeaderCell>Grunn</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sorterteRader.map((vurdering) => {
            const erValgt = valgteRader.some((dato) => dato === vurdering.dato);
            return (
              <Table.Row key={vurdering.dato} className={erValgt ? styles.valgtRad : ''}>
                <Rad vurdering={vurdering} readOnly={readOnly} onClickRad={onClickRad} erValgt={erValgt} />
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
    </div>
  );
};

const Rad = ({
  vurdering,
  erValgt,
  onClickRad,
  readOnly,
}: {
  vurdering: Vurdering11_9;
  erValgt: boolean;
  onClickRad: (checked: boolean, dato: string) => void;
  readOnly: boolean;
}) => (
  <>
    <Table.DataCell>
      <Checkbox
        disabled={readOnly === true}
        checked={erValgt}
        onChange={(e) => onClickRad(e.target.checked, vurdering.dato)}
      >
        {' '}
      </Checkbox>
    </Table.DataCell>
    <Table.DataCell>{formaterDatoForFrontend(vurdering.dato)}</Table.DataCell>
    <Table.DataCell>{formaterBrudd(vurdering.brudd)}</Table.DataCell>
    <Table.DataCell>{formaterGrunn(vurdering.grunn)}</Table.DataCell>
    <Table.DataCell>{vurdering.status}</Table.DataCell>
  </>
);
