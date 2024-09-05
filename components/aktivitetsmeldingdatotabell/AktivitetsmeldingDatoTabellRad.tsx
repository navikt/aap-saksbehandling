import { DatoBruddPåAktivitetsplikt } from 'components/aktivitetsmelding/AktivitetsMelding';
import { Button, Table, TextField } from '@navikt/ds-react';
import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

interface Props {
  bruddDatoPeriode: DatoBruddPåAktivitetsplikt;
  onChange: (id: string, felt: 'dato' | 'fom' | 'tom', value: string) => void;
}

export const AktivitetsmeldingDatoTabellRad = ({ bruddDatoPeriode, onChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const datoFelt = bruddDatoPeriode.type === 'enkeltdag' ? 'dato' : 'fom';

  return (
    <Table.Row>
      <Table.DataCell scope={'row'} className={'navds-table__data-cell--align-top'}>
        {isEditing ? (
          <TextField
            size={'small'}
            label={'dato'}
            hideLabel
            onChange={(e) => onChange(bruddDatoPeriode.id, datoFelt, e.target.value)}
          />
        ) : (
          <span>{bruddDatoPeriode.type === 'enkeltdag' ? bruddDatoPeriode.dato : bruddDatoPeriode.fom}</span>
        )}
      </Table.DataCell>
      {bruddDatoPeriode?.type === 'periode' ? (
        <Table.DataCell scope={'row'}>
          {isEditing ? (
            <TextField
              size={'small'}
              label={'dato'}
              hideLabel
              onChange={(e) => onChange(bruddDatoPeriode.id, 'tom', e.target.value)}
            />
          ) : (
            <span>{bruddDatoPeriode.tom}</span>
          )}
        </Table.DataCell>
      ) : (
        <Table.DataCell scope={'row'} />
      )}
      <Table.DataCell scope={'row'}>{bruddDatoPeriode.type === 'periode' ? 'Periode' : 'Enkeltdato'}</Table.DataCell>
      <Table.DataCell scope={'row'}>
        <Button
          type={'button'}
          size={'small'}
          variant={'tertiary'}
          icon={<PencilIcon title="a11y-title"  />}
          onClick={() => setIsEditing(!isEditing)}
        >
          Endre
        </Button>
        <Button type={'button'} size={'small'} variant={'tertiary'} icon={<TrashIcon />}>
          Slett
        </Button>
      </Table.DataCell>
    </Table.Row>
  );
};
