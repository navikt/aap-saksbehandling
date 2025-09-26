import { AvslagÅrsak, ForeslåVedtakGrunnlag } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { HStack, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './ForeslåVedtakTabell.module.css';
import { isProd } from 'lib/utils/environment';

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
                  : utledAvslagsårsak(vedtaksPeriode.avslagsårsak.vilkårsavslag)}
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
      return '§ 11-6 Bistandsbehov';
    case 'SYKEPENGEERSTATNING':
      return '§ 11-13 Sykepengeerstatning';
    case 'STUDENT':
      return '§ 11-14 Student';
    case 'ARBEIDSSØKER':
      return '§ 11-17 Arbeidssøker';
    case 'VURDERES_FOR_UFØRETRYGD':
      return '§ 11-18 Vurderes for uføretrygd';
    default:
      return '-';
  }
}

// Det finnes flere avslagsårsaker enn disse, men de lagres ikke alltid riktig og bør derfor ikke vises
function mapAvslagsårsakTilTekst(avslagsårsak: AvslagÅrsak): String {
  switch (avslagsårsak) {
    case 'ANNEN_FULL_YTELSE':
      return 'Annen full ytelse';
    case 'IKKE_BEHOV_FOR_OPPFOLGING':
      return 'Ikke behov for oppfølging';
    case 'BRUKER_OVER_67':
      return 'Bruker er over 67 år';
    case 'IKKE_MEDLEM_FORUTGÅENDE':
      return 'Oppfyller ikke krav til forutgående medlemskap';
    case 'BRUKER_UNDER_18':
      return 'Bruker er under 18 år';
    case 'IKKE_MEDLEM':
      return 'Oppfyller ikke krav til meldemskap';
    case 'IKKE_NOK_REDUSERT_ARBEIDSEVNE':
      return 'Ikke nok redusert arbeidsevne';
    case 'IKKE_SYKDOM_AV_VISS_VARIGHET':
      return 'Ikke sykdom av viss varighet';
    case 'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL':
      return 'Sykdom er ikke vesentlig medvirkende årsak til nedsatt arbeidsevne';
    case 'NORGE_IKKE_KOMPETENT_STAT':
      return 'Norge er ikke kompetent stat';
    default:
      return '-';
  }
}

const utledAvslagsårsak = (vilkårAvslag: AvslagÅrsak[]) => {
  console.log(vilkårAvslag)

  if (isProd()) {
    return '-';
  }

  const vilkårAvslagTekst = [...new Set(vilkårAvslag)].map((årsak) => mapAvslagsårsakTilTekst(årsak)).join(', ');
  // Skal kun vises når vi er sikre på alle årsakene til avslag på vilkår
  if (vilkårAvslagTekst.includes('-') || vilkårAvslagTekst.length == 0) {
    return '-';
  }
  return vilkårAvslagTekst;
};
