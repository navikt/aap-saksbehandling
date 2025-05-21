'use client';

import { BodyShort, HStack, Table } from '@navikt/ds-react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';

import styles from './TilhørighetsVurderingTabell.module.css';

interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering['tilhørighetVurdering'];
  oppfyllerOpplysningeneKravene: boolean;
  oppfyllerOpplysningeneKraveneTekst: string;
}

export const TilhørigetsVurderingTabell = ({
  vurdering,
  oppfyllerOpplysningeneKravene,
  oppfyllerOpplysningeneKraveneTekst,
}: Props) => {
  return (
    <TableStyled size={'small'}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col">Vurdert periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Opplysning</Table.HeaderCell>
          <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {vurdering.map((opplysning, index) => {
          return (
            <Table.ExpandableRow key={`${opplysning.kilde.join('-')}-${index}`} content={opplysning.fordypelse}>
              <Table.DataCell textSize={'small'}>
                {opplysning.kilde.map((kilde) => mapKildeTilTekst(kilde)).join(', ')}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>Her må vi få inn periode</Table.DataCell>
              <Table.DataCell textSize={'small'}>{opplysning.opplysning}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                <BodyShort size={'small'}>{opplysning.resultat ? 'Ja' : 'Nei'}</BodyShort>
              </Table.DataCell>
            </Table.ExpandableRow>
          );
        })}
        <Table.Row className={`${styles.rad} ${oppfyllerOpplysningeneKravene ? styles.godkjent : styles.avslått}`}>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell>
            <BodyShort size={'small'} weight={'semibold'}>
              {oppfyllerOpplysningeneKraveneTekst}
            </BodyShort>
          </Table.DataCell>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell>
            <HStack gap={'1'} align={'center'}>
              {oppfyllerOpplysningeneKravene ? (
                <>
                  <CheckmarkCircleIcon color={'green'} />
                  <BodyShort size={'small'} weight={'semibold'}>
                    Ja
                  </BodyShort>
                </>
              ) : (
                <>
                  <ExclamationmarkTriangleIcon color={'orange'} />
                  <BodyShort size={'small'} weight={'semibold'}>
                    Nei
                  </BodyShort>
                </>
              )}
            </HStack>
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </TableStyled>
  );
};

type Kilde = 'SØKNAD' | 'PDL' | 'MEDL' | 'AA_REGISTERET' | 'A_INNTEKT';
function mapKildeTilTekst(kilde: Kilde): string {
  switch (kilde) {
    case 'SØKNAD':
      return 'Søknad';
    case 'PDL':
      return 'PDL';
    case 'MEDL':
      return 'MEDL';
    case 'AA_REGISTERET':
      return 'AA Registeret';
    case 'A_INNTEKT':
      return 'A Inntekt';
    default:
      return kilde;
  }
}
