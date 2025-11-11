import { ForeslåVedtakGrunnlag, UnderveisAvslagsÅrsak } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { HStack, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './ForeslåVedtakTabell.module.css';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { toggles } from 'lib/utils/toggles';

interface Props {
  grunnlag: ForeslåVedtakGrunnlag;
}

export const ForeslåVedtakTabell = ({ grunnlag }: Props) => {
  return (
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Rettighet</Table.HeaderCell>
          <Table.HeaderCell>Periode</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.perioder.length === 0 ? (
          <Table.Row>
            <Table.DataCell>
              <HStack gap={'2'} align={'center'}>
                <XMarkOctagonIcon className={styles.avslåttIcon} />
                {mapUtfallTilTekst('IKKE_OPPFYLT')}
              </HStack>
            </Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
          </Table.Row>
        ) : (
          grunnlag.perioder.map((vedtaksPeriode) => (
            <Table.Row key={`${vedtaksPeriode.utfall}-${vedtaksPeriode.rettighetsType}-${vedtaksPeriode.periode?.fom}`}>
              <Table.DataCell>
                <HStack gap={'2'} align={'center'}>
                  {vedtaksPeriode.utfall == 'OPPFYLT' ? (
                    <CheckmarkCircleIcon className={styles.godkjentIcon} />
                  ) : (
                    <XMarkOctagonIcon className={styles.avslåttIcon} />
                  )}
                  {mapUtfallTilTekst(vedtaksPeriode.utfall)}
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                {formaterDatoForFrontend(vedtaksPeriode.periode.fom)} -{' '}
                {formaterDatoForFrontend(vedtaksPeriode.periode.tom)}
              </Table.DataCell>
              <Table.DataCell>
                {vedtaksPeriode.utfall == 'OPPFYLT'
                  ? mapRettighetsTypeTilTekst(vedtaksPeriode.rettighetsType)
                  : mapAvslagsÅrsakTilTekst(
                      vedtaksPeriode.avslagsårsak.vilkårsavslag,
                      vedtaksPeriode.avslagsårsak.underveisavslag
                    )}
              </Table.DataCell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </TableStyled>
  );
};

function mapUtfallTilTekst(utfall: string) {
  switch (utfall) {
    case 'OPPFYLT':
      return 'AAP innvilget';
    case 'IKKE_OPPFYLT':
      return 'Ikke rett på AAP';
  }
}

function mapRettighetsTypeTilTekst(
  rettighetsType:
    | 'BISTANDSBEHOV'
    | 'SYKEPENGEERSTATNING'
    | 'STUDENT'
    | 'ARBEIDSSØKER'
    | 'VURDERES_FOR_UFØRETRYGD'
    | null
    | undefined
) {
  switch (rettighetsType) {
    case 'BISTANDSBEHOV':
      return '§ 11-6';
    case 'SYKEPENGEERSTATNING':
      return '§ 11-13';
    case 'STUDENT':
      return '§ 11-14';
    case 'ARBEIDSSØKER':
      return '§ 11-17';
    case 'VURDERES_FOR_UFØRETRYGD':
      return '§ 11-18';
    default:
      return '-';
  }
}

function mapUnderveisÅrsakTilHjemmel(underveisAvslag: UnderveisAvslagsÅrsak) {
  switch (underveisAvslag) {
    case 'IKKE_GRUNNLEGGENDE_RETT':
      return '';
    case 'IKKE_OVERHOLDT_MELDEPLIKT_SANKSJON':
      return '§ 11-10';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_11_7_OPPHØR':
      return '§ 11-7';
    case 'SONER_STRAFF':
      return '§ 11-26';
    case 'ARBEIDER_MER_ENN_GRENSEVERDI':
      return '§ 11-23';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_11_7_STANS':
      return '§ 11-7';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_11_3_STANS':
      return '§ 11-3';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_11_3_OPPHØR':
      return '§ 11-3';
    case 'MELDEPLIKT_FRIST_IKKE_PASSERT':
      return '§ 11-10';
    case 'VARIGHETSKVOTE_BRUKT_OPP':
      return '§ 11-12';
    default:
      return exhaustiveCheck(underveisAvslag);
  }
}

function mapAvslagsÅrsakTilTekst(vilkårAvslag: string[], underveisAvslag?: UnderveisAvslagsÅrsak | null) {
  if (toggles.featureVisAvslagsårsaker) {
    if (underveisAvslag && underveisAvslag != 'IKKE_GRUNNLEGGENDE_RETT') {
      vilkårAvslag.push(mapUnderveisÅrsakTilHjemmel(underveisAvslag));
    }
    return [...new Set(vilkårAvslag)].join(', ');
  }
  return '–';
}
