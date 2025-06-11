import { Heading, Radio, RadioGroup, SortState, Table } from '@navikt/ds-react';
import { ChangeEvent, Ref, useState } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';

type RadioOption = {
  saksnummer: string;
  value: string;
  vedtaksdato: Date;
  behandlingstype: string;
  årsakTilBehandling: string[];
};

type FormFieldRadioTableProps = {
  options: RadioOption[];
  ref: Ref<HTMLFieldSetElement>;
  error?: string;
  value: string | null | undefined;
  onChange: (e: ChangeEvent) => void;
};

function getSortValue(sortField: string, option: RadioOption): string {
  switch (sortField) {
    case 'saksnummer':
      return option.saksnummer;
    case 'vedtaksdato':
      return option.vedtaksdato.toISOString();
    case 'behandlingstype':
      return option.behandlingstype;
    default:
      return '';
  }
}

export const VelgPåklagetVedtakRadioTable = ({ options, value, onChange, error, ref }: FormFieldRadioTableProps) => {
  const [sort, setSort] = useState<SortState | undefined>({ orderBy: 'vedtaksdato', direction: 'descending' });

  const handleSort = (sortKey: string) => {
    setSort(
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          }
    );
  };

  const sortedOptions = options.toSorted((a, b) => {
    if (sort?.orderBy == null) {
      return 0;
    }

    const aValue = getSortValue(sort.orderBy, a);
    const bValue = getSortValue(sort.orderBy, b);
    const sortOrder = sort.direction === 'ascending' ? 1 : -1;

    return aValue.localeCompare(bValue) * sortOrder;
  });

  return (
    <div>
      <RadioGroup
        legend="Velg hvilket vedtak klagen gjelder"
        ref={ref}
        error={error}
        hideLegend={true}
        value={value ?? ''}
        onChange={onChange}
      >
        <Heading level="2" size="xsmall" spacing={true}>
          Velg hvilket vedtak klagen gjelder
        </Heading>
        <Table sort={sort} onSortChange={handleSort} size="small">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textSize="small"> </Table.ColumnHeader>
              <Table.ColumnHeader textSize="small" sortable={true} sortKey="saksnummer">
                Sak
              </Table.ColumnHeader>
              <Table.ColumnHeader textSize="small" sortable={true} sortKey="vedtaksdato">
                Vedtaksdato
              </Table.ColumnHeader>
              <Table.ColumnHeader textSize="small" sortable={true} sortKey="behandlingstype">
                Behandlingstype
              </Table.ColumnHeader>
              <Table.ColumnHeader textSize="small">Årsak til behandling</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedOptions.map((option) => (
              <Table.Row key={option.value}>
                <Table.DataCell>
                  <Radio value={option.value}> </Radio>
                </Table.DataCell>
                <Table.DataCell>{option.saksnummer}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(option.vedtaksdato)}</Table.DataCell>
                <Table.DataCell>{option.behandlingstype}</Table.DataCell>
                <Table.DataCell>{option.årsakTilBehandling.join(', ')}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </RadioGroup>
    </div>
  );
};
