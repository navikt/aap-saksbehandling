'use client';

import { BodyShort, HStack, Table } from '@navikt/ds-react';
import { tilhørighetVurdering } from 'lib/types/types';
import { VisuellTidslinjeInnhold } from './VisuellTidslinjeInnhold';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import styles from './TilhørighetsVurderingTabell.module.css';
import { OpplysningerContent } from 'components/behandlinger/lovvalg/opplysningercontent/OpplysningerContent';

interface Props {
  vurdering: tilhørighetVurdering[];
  oppfyllerOpplysningeneKravene: boolean;
  oppfyllerOpplysningeneKraveneTekst: string;
}

export const TilhørighetsVurderingTabell = ({
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
          <Table.HeaderCell scope="col">Vurdert Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Opplysning</Table.HeaderCell>
          <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {vurdering.map((opplysning, index) => {
          const harVisuellTidslinje = opplysning.visuellTidslinje.length > 0;
          const erUtvidbar = harVisuellTidslinje || harMinstEttGrunnlag(opplysning);

          const radInnhold = (
            <>
              <Table.DataCell textSize="small" width={200}>
                {opplysning.kilde.map(mapKildeTilTekst).join(', ')}
              </Table.DataCell>
              <Table.DataCell textSize="small" width={300}>
                {opplysning.vurdertPeriode}
              </Table.DataCell>
              <Table.DataCell textSize="small" width={750}>
                {opplysning.opplysning}
              </Table.DataCell>
              <Table.DataCell textSize="small" width={'auto'}>
                <BodyShort size="small">{opplysning.resultat ? 'Ja' : 'Nei'}</BodyShort>
              </Table.DataCell>
            </>
          );
          const expandableContent = harVisuellTidslinje ? (
            <VisuellTidslinjeInnhold visuellTidslinje={opplysning.visuellTidslinje}></VisuellTidslinjeInnhold>
          ) : (
            <OpplysningerContent opplysning={opplysning} />
          );
          return erUtvidbar ? (
            <Table.ExpandableRow key={index} content={expandableContent}>
              {radInnhold}
            </Table.ExpandableRow>
          ) : (
            <Table.Row key={index} className={styles.rad}>
              <Table.DataCell style={{ minWidth: '48px' }}></Table.DataCell>
              {radInnhold}
            </Table.Row>
          );
        })}

        <Table.Row className={`${styles.rad} ${oppfyllerOpplysningeneKravene ? styles.godkjent : styles.avslått}`}>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell colSpan={3}>
            <BodyShort size={'small'} weight={'semibold'}>
              {oppfyllerOpplysningeneKraveneTekst}
            </BodyShort>
          </Table.DataCell>
          <Table.DataCell>
            <HStack gap={'1'} align={'center'}>
              {oppfyllerOpplysningeneKravene ? (
                <>
                  <CheckmarkCircleFillIcon className={styles.godkjentIcon} title={'Suksess'} />
                  <BodyShort size={'small'} weight={'semibold'}>
                    Ja
                  </BodyShort>
                </>
              ) : (
                <>
                  <ExclamationmarkTriangleFillIcon className={styles.avslåttIcon} title={'Advarsel'} />
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

type Kilde = 'SØKNAD' | 'PDL' | 'MEDL' | 'AA_REGISTERET' | 'A_INNTEKT' | 'EREG';

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

function harMinstEttGrunnlag(vurdering: tilhørighetVurdering) {
  return [
    vurdering.arbeidInntektINorgeGrunnlag,
    vurdering.mottarSykepengerGrunnlag,
    vurdering.oppgittJobbetIUtlandGrunnlag,
    vurdering.oppgittUtenlandsOppholdGrunnlag,
    vurdering.manglerStatsborgerskapGrunnlag,
    vurdering.utenlandsAddresserGrunnlag?.adresser,
    vurdering.utenlandsAddresserGrunnlag?.personStatus,
    vurdering.vedtakImedlGrunnlag,
  ].some((grunnlag) => grunnlag !== null && grunnlag && grunnlag?.length > 0);
}
