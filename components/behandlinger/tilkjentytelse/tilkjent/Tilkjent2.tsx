'use client';

import { TilkjentYtelseGrunnlagV2 } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Table } from '@navikt/ds-react';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { formaterTilNok, formaterTilProsent } from 'lib/utils/string';

import styles from './Tilkjent2.module.css';

interface Props {
  grunnlag: TilkjentYtelseGrunnlagV2;
}

export const Tilkjent2 = ({ grunnlag }: Props) => {
  console.log('grunnlag', grunnlag);
  return (
    <VilkårsKort heading="Tilkjent ytelse" steg="BEREGN_TILKJENT_YTELSE">
      <TableStyled size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
            <Table.HeaderCell>Vurdert periode</Table.HeaderCell>
            <Table.HeaderCell>Dagsats</Table.HeaderCell>
            <Table.HeaderCell>Barnetillegg</Table.HeaderCell>
            <Table.HeaderCell>Arbeid</Table.HeaderCell>
            <Table.HeaderCell>Samordning</Table.HeaderCell>
            <Table.HeaderCell>Institusjon</Table.HeaderCell>
            <Table.HeaderCell>Total reduksjon</Table.HeaderCell>
            <Table.HeaderCell>Effektiv dagsats</Table.HeaderCell>
            <Table.HeaderCell>Meldekort levert</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.perioder.map((periode, periodeIndex) => {
            return periode.vurdertePerioder.map((vurdertPeriode, vurdertPeriodeIndex) => {
              const skalHaSkillelinje =
                periode.vurdertePerioder.length === vurdertPeriodeIndex + 1 ? '' : styles.tablerowwithoutborder;

              const skilleLinjeFørsteradClassname =
                periode.vurdertePerioder.length === 1 ? '' : styles.tablerowwithoutborder;

              const skalHaBakgrunn = periodeIndex % 2 ? styles.tablerowwithzebra : '';

              if (vurdertPeriodeIndex === 0) {
                return (
                  <Table.Row key={vurdertPeriodeIndex} className={`${skilleLinjeFørsteradClassname} ${skalHaBakgrunn}`}>
                    <Table.DataCell textSize={'small'}>
                      {formaterPeriode(periode.meldeperiode.fom, periode.meldeperiode.tom)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterPeriode(vurdertPeriode.fraOgMed, vurdertPeriode.tilOgMed)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>{formaterTilNok(vurdertPeriode.felter.dagsats)}</Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilNok(vurdertPeriode.felter.barneTilleggsats)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.arbeidGradering)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.samordningGradering)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.institusjonGradering)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.totalReduksjon)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilNok(vurdertPeriode.felter.effektivDagsats)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {periode.levertMeldekortDato
                        ? formaterDatoForFrontend(periode.levertMeldekortDato)
                        : 'Ikke levert'}
                    </Table.DataCell>
                  </Table.Row>
                );
              } else {
                return (
                  <Table.Row key={vurdertPeriodeIndex} className={`${skalHaSkillelinje} ${skalHaBakgrunn}`}>
                    <Table.DataCell></Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterPeriode(vurdertPeriode.fraOgMed, vurdertPeriode.tilOgMed)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>{formaterTilNok(vurdertPeriode.felter.dagsats)}</Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilNok(vurdertPeriode.felter.barneTilleggsats)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.arbeidGradering)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.samordningGradering)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.institusjonGradering)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilProsent(vurdertPeriode.felter.totalReduksjon)}
                    </Table.DataCell>
                    <Table.DataCell textSize={'small'}>
                      {formaterTilNok(vurdertPeriode.felter.effektivDagsats)}
                    </Table.DataCell>
                    <Table.DataCell></Table.DataCell>
                  </Table.Row>
                );
              }
            });
          })}
        </Table.Body>
      </TableStyled>
    </VilkårsKort>
  );
};
//
// function formaterProsent(verdi?: number | null) {
//   let prosentVerdi = 0;
//   if (verdi === 0) {
//     return `${prosentVerdi} %`;
//   }
//   if (verdi === null || !verdi) {
//     return '';
//   }
//
//   prosentVerdi = 100 - verdi;
//
//   return `${prosentVerdi} %`;
// }
