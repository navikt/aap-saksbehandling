import { Button, Heading, Table } from '@navikt/ds-react';
import { FastSettArbeidsevnePeriode } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { FastsettArbeidsevnePeriodeTableRow } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTableRow';
import { PlusIcon } from '@navikt/aksel-icons';

import styles from './FastsettArbeidsevnePeriodeTable.module.css';

interface Props {
  perioder: FastSettArbeidsevnePeriode[];
  visLeggTilPeriodeKnapp: boolean;
  onClick: () => void;
}
export const FastsettArbeidsevnePeriodeTable = ({ perioder, onClick, visLeggTilPeriodeKnapp }: Props) => {
  return (
    <div className={styles.tabell}>
      <Heading size={'small'} level={'4'}>
        Registrerte perioder med arbeidsevne
      </Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Fra og med</Table.HeaderCell>
            <Table.HeaderCell>Arbeidsevne</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {perioder.map((periode) => (
            <FastsettArbeidsevnePeriodeTableRow key={periode.id} {...periode} />
          ))}
        </Table.Body>
      </Table>
      {visLeggTilPeriodeKnapp && (
        <Button variant={'tertiary'} size={'small'} icon={<PlusIcon />} onClick={onClick}>
          Legg til ny periode
        </Button>
      )}
    </div>
  );
};
