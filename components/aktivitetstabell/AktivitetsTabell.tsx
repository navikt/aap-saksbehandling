import styles from 'components/dokumenttabell/DokumentTabell.module.css';
import { Button, Checkbox, Table } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { AktivitetsTabellRad } from 'components/aktivitetstabell/AktivitetsTabellRad';
import { AktivitetDto } from 'lib/types/types';

interface Props {
  aktiviteter?: AktivitetDto[];
}

export const defaultAktiviteter: AktivitetDto[] = [
  {
    type: 'IKKE_MØTT_TIL_MØTE',
    dato: '02.04.2024',
    begrunnelse: 'En begrunnelse',
  },
  {
    type: 'IKKE_MØTT_TIL_ANNEN_AKTIVITET',
    dato: '10.04.2024',
    begrunnelse: 'En begrunnelse',
  },
  {
    type: 'IKKE_MØTT_TIL_MØTE',
    dato: '15.04.2024',
    begrunnelse: 'En begrunnelse',
  },
  {
    type: 'IKKE_AKTIVT_BIDRAG',
    dato: '22.04.2024',
    begrunnelse: 'En begrunnelse',
  },
];
export const AktivitetsTabell = ({ aktiviteter = defaultAktiviteter }: Props) => {
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
        {aktiviteter.length > 0 && (
          <Table.Body>
            {aktiviteter.map((aktivitet, index) => (
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
