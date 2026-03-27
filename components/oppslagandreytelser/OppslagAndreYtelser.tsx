'use client';

import { formaterDatoForFrontend } from 'lib/utils/date';
import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { AndreStatligeYtelserPeriodeDto, AndreStatligeYtelserType } from 'lib/types/types';

import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  perioder: AndreStatligeYtelserPeriodeDto[];
}

export const OppslagAndreYtelser = ({ perioder }: Props) => {
  return (
    <VStack gap={'6'}>
      <div className={'flex-column'}>
        <div>
          <Label size={'small'}>Oppslag på andre ytelser</Label>
          <BodyShort size={'small'}>
            <span>Vi har funnet følgende perioder som kan være relevante for AAP</span>
          </BodyShort>
        </div>
      </div>

      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {perioder
            .filter((periode) => burdeYtelseTypeVises(periode.ytelseType))
            .map((periode, index) => {
            return (
              <Table.Row key={index}>
                <Table.DataCell textSize={'small'}>{mapYtelseTypeTilNavn(periode.ytelseType)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(periode.fom) + " - " + formaterDatoForFrontend(periode.tom ?? "")}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{periode.kilde}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};

function burdeYtelseTypeVises(ytelseType: AndreStatligeYtelserType) {
  switch (ytelseType) {
    case 'TILTAKSPENGER_INAKTIV':
      return false;
    default:
      return true;
  }
}

function mapYtelseTypeTilNavn(ytelseType: AndreStatligeYtelserType): string {
  switch (ytelseType) {
    case 'DAGPENGER_ARBEIDSSOKER_ORDINAER':
      return 'Dagpenger';
    case 'DAGPENGER_PERMITTERING_ORDINAER':
      return 'Dagpenger';
    case 'DAGPENGER_PERMITTERING_FISKEINDUSTRI':
      return 'Dagpenger';
    case 'TILTAKSPENGER':
      return 'Tiltakspenger';
    case 'TILTAKSPENGER_OG_BARNETILLEGG':
      return 'Tiltakspenger';
    case 'TILTAKSPENGER_INAKTIV':
      return 'Tiltakspenger';
    default:
      throw new Error('Kunne ikke finne påkrevd årsak.');
  }
}