import { Avslag11_27Krav } from 'lib/types/types';
import { BodyShort, Checkbox, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Alert } from 'components/alert/Alert';

interface Props {
  label: string;
  avslag11_27krav: Avslag11_27Krav[];
  selectedReferanser: string[];
  onToggle: (referanse: string) => void;
  ingenVurderingerValgtFeil: string | null;
  readonly: boolean;
  vedtatteReferanser: string[];
}

const kravTypeLabels: Record<string, string> = {
  RELEVANT_KRAV: 'Nytt krav om AAP',
  TRUKKET_SØKNAD: 'Trukket søknad',
  KLAGE: 'Klage',
  TILLEGGSOPPLYSNING: 'Tilleggsopplysning',
};

function formaterKravType(type: string): string {
  return kravTypeLabels[type] ?? type;
}

export const Avslag11_27KravTabell = ({
  label,
  avslag11_27krav,
  selectedReferanser,
  onToggle,
  ingenVurderingerValgtFeil,
  readonly,
  vedtatteReferanser,
}: Props) => {
  return (
    <VStack gap={'space-16'}>
      <VStack gap={'space-4'}>
        <BodyShort weight={'semibold'} size={'small'} as={'p'}>
          {label}
        </BodyShort>
      </VStack>
      <TableStyled title={label}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Søknadsdokument
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Type
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Søknadsdato
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Mulig rettighet fra
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Vurder
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {avslag11_27krav.map((krav, index) => (
            <Table.Row key={index}>
              <Table.DataCell textSize={'small'}>{krav.søknadsdokument}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterKravType(krav.type)}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {krav.søknadsdato ? formaterDatoForFrontend(krav.søknadsdato) : '-'}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {krav.muligRettighetFra ? formaterDatoForFrontend(krav.muligRettighetFra) : '-'}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                <Checkbox
                  size={'small'}
                  hideLabel
                  checked={selectedReferanser.includes(krav.referanse)}
                  onChange={() => onToggle(krav.referanse)}
                  readOnly={readonly || vedtatteReferanser.includes(krav.referanse)}
                >
                  Vurder
                </Checkbox>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
      {ingenVurderingerValgtFeil && (
        <Alert variant="error" size="small">
          {ingenVurderingerValgtFeil}
        </Alert>
      )}
    </VStack>
  );
};
