import { DatoBruddPåAktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { Button, Table, TextField } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';

interface Props {
  type: DatoBruddPåAktivitetsplikt['type'];
  bruddDatoPeriode: DatoBruddPåAktivitetsplikt;
  onChange: (id: string, felt: 'dato' | 'fom' | 'tom', value: string) => void;
  onDelete: () => void;
}

export const AktivitetsmeldingDatoTabellRad = ({ bruddDatoPeriode, onChange, onDelete, type }: Props) => {
  const datoFelt = bruddDatoPeriode.type === 'enkeltdag' ? 'dato' : 'fom';

  return (
    <Table.Row>
      <Table.DataCell className={'navds-table__data-cell--align-top'}>
        <TextField
          size={'small'}
          label={type === 'enkeltdag' ? 'dato' : 'fra og med dato'}
          value={bruddDatoPeriode.fom || bruddDatoPeriode.dato}
          hideLabel
          onChange={(e) => onChange(bruddDatoPeriode.id, datoFelt, e.target.value)}
        />
      </Table.DataCell>
      {bruddDatoPeriode?.type === 'periode' ? (
        <Table.DataCell>
          <TextField
            size={'small'}
            label={'til og med dato'}
            value={bruddDatoPeriode.tom}
            hideLabel
            onChange={(e) => onChange(bruddDatoPeriode.id, 'tom', e.target.value)}
          />
        </Table.DataCell>
      ) : (
        <Table.DataCell />
      )}
      <Table.DataCell>{bruddDatoPeriode.type === 'periode' ? 'Periode' : 'Enkeltdato'}</Table.DataCell>
      <Table.DataCell>
        <Button type={'button'} size={'small'} variant={'tertiary'} icon={<TrashIcon />} onClick={onDelete}>
          Slett
        </Button>
      </Table.DataCell>
    </Table.Row>
  );
};
