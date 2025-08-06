'use client';

import { TilkjentYtelseGrunnlagV2 } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { ActionMenu, BodyShort, Button, Table, VStack } from '@navikt/ds-react';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { formaterTilNok, formaterTilProsent } from 'lib/utils/string';

import styles from './Tilkjent2.module.css';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';

interface Props {
  grunnlag: TilkjentYtelseGrunnlagV2;
}

export const Tilkjent2 = ({ grunnlag }: Props) => {
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
            <Table.HeaderCell>Arbeidsgiver</Table.HeaderCell>
            <Table.HeaderCell>Total reduksjon</Table.HeaderCell>
            <Table.HeaderCell>Effektiv dagsats</Table.HeaderCell>
            <Table.HeaderCell>Meldekort levert</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.perioder.map((periode, periodeIndex) => {
            return periode.vurdertePerioder.map((vurdertPeriode, vurdertPeriodeIndex) => {
              const skilleLinjeClassName =
                periode.vurdertePerioder.length === vurdertPeriodeIndex + 1 || periode.vurdertePerioder.length === 1
                  ? ''
                  : styles.tablerowwithoutborder;

              const bakgrunnClassName = periodeIndex % 2 ? styles.tablerowwithzebra : '';

              return (
                <Table.Row key={vurdertPeriodeIndex} className={`${skilleLinjeClassName} ${bakgrunnClassName}`}>
                  <Table.DataCell textSize={'small'}>
                    {vurdertPeriodeIndex === 0 && formaterPeriode(periode.meldeperiode.fom, periode.meldeperiode.tom)}
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    {formaterPeriode(vurdertPeriode.periode.fom, vurdertPeriode.periode.tom)}
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
                    {formaterTilProsent(vurdertPeriode.felter.arbeidsgiverGradering)}
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    {formaterTilProsent(vurdertPeriode.felter.totalReduksjon)}
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    {formaterTilNok(vurdertPeriode.felter.effektivDagsats)}
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    {vurdertPeriodeIndex === 0 &&
                      (periode.levertMeldekortDato
                        ? formaterDatoForFrontend(periode.levertMeldekortDato)
                        : 'Ikke levert')}
                  </Table.DataCell>
                  <Table.DataCell>
                    {periode.sisteLeverteMeldekort && (
                      <ActionMenu>
                        <ActionMenu.Trigger>
                          <Button variant={'tertiary'} icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />} />
                        </ActionMenu.Trigger>
                        <ActionMenu.Content>
                          <VStack gap={'4'} width={'250px'}>
                            <BodyShort weight={'semibold'}>Meldekort</BodyShort>
                            <BodyShort>
                              Bruker har ført {periode.sisteLeverteMeldekort.timerArbeidPerPeriode.timerArbeid} timer.
                            </BodyShort>
                          </VStack>
                        </ActionMenu.Content>
                      </ActionMenu>
                    )}
                  </Table.DataCell>
                </Table.Row>
              );
            });
          })}
        </Table.Body>
      </TableStyled>
    </VilkårsKort>
  );
};
