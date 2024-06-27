import styles from 'components/dokumenttabell/DokumentTabell.module.css';
import { Button, Checkbox, Table } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { AktivitetsTabellRad } from 'components/aktivitetstabell/AktivitetsTabellRad';
import { Aktivitetsmeldinger } from 'lib/types/types';

interface Props {
  aktivitetsmeldinger?: Aktivitetsmeldinger;
}

export const AktivitetsTabell = ({ aktivitetsmeldinger = { hammere: [] } }: Props) => {
  return (
    <div className={styles.dokumentTabell}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Årsak</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Sendt forh.varsel</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Sendt vedtak</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {aktivitetsmeldinger?.hammere?.length > 0 && (
          <Table.Body>
            {aktivitetsmeldinger.hammere.map((aktivitet, index) => (
              <AktivitetsTabellRad key={`aktivitet-${index}`} aktivitet={aktivitet} />
            ))}
          </Table.Body>
        )}
      </Table>
      <Button
        className={`fit-content-button ${styles.leggTilDokumentKnapp}`}
        size={'small'}
        icon={<PlusIcon />}
        variant={'tertiary'}
        onClick={(e) => e.preventDefault()}
      >
        Legg til dokument
      </Button>
      <Checkbox value={'dokumentasjonMangler'}>Dokumentasjon mangler</Checkbox>
    </div>
  );
};
