import { Button, Heading, Table } from '@navikt/ds-react';
import { FastSettArbeidsevnePeriode } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { FastsettArbeidsevnePeriodeTableRow } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTableRow';
import { PlusIcon } from '@navikt/aksel-icons';

import styles from './FastsettArbeidsevnePeriodeTable.module.css';

interface Props {
  perioder: FastSettArbeidsevnePeriode[];
  onClick: () => void;
}
export const FastsettArbeidsevnePeriodeTable = ({ perioder, onClick }: Props) => {
  return (
    <div className={styles.tabell}>
      <Heading size={'small'} level={'4'}>
        Regisrerte perioder med arbeidsevne
      </Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Arbeidsevne</Table.HeaderCell>
            <Table.HeaderCell scope="col">Tilknyttede dokumenter</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {perioder.map((periode) => (
            <FastsettArbeidsevnePeriodeTableRow key={periode.id} {...periode} />
          ))}
        </Table.Body>
      </Table>
      <Button variant={'tertiary'} size={'small'} icon={<PlusIcon />} onClick={onClick}>
        Legg til ny preiode
      </Button>
    </div>
  );
};
