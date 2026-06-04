'use client';

import { Diff, TilkjentYtelseGrunnlag, TilkjentYtelseGrunnlagMedDiff, TilkjentYtelsePeriode } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { ActionMenu, BodyShort, Button, Chips, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import React, { useState } from 'react';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { formaterTilNok, formaterTilProsent } from 'lib/utils/string';

import styles from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent.module.css';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Alert } from 'components/alert/Alert';

interface Props {
  grunnlag: TilkjentYtelseGrunnlag;
}
interface PropsMedDiff {
  grunnlagMedDiff: TilkjentYtelseGrunnlagMedDiff;
}

export const Tilkjent = ({ grunnlag }: Props) => {
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
            <Table.HeaderCell>Barnepensjon</Table.HeaderCell>
            <Table.HeaderCell>Effektiv dagsats</Table.HeaderCell>
            <Table.HeaderCell>Meldekort levert</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.perioder.map((periode, periodeIndex) => {
            const bakgrunnClassName = periodeIndex % 2 ? styles.tablerowwithzebra : '';
            return <TilkjentPeriodeRad key={periodeIndex} periode={periode} bakgrunnClassName={bakgrunnClassName} />;
          })}
        </Table.Body>
      </TableStyled>
    </VilkårsKort>
  );
};

export const TilkjentMedDiff = ({ grunnlagMedDiff }: PropsMedDiff) => {
  const [visHistorikkPåEndredePerioder, setVisHistorikkPåEndredePerioder] = useState(false);
  const [visPerioderUtenEndringFraTidligere, setVisPerioderUtenEndringFraTidligere] = useState(false);

  const skalViseMeldingOmIngenEndringIPerioder =
    grunnlagMedDiff.perioder.length > 0 && grunnlagMedDiff.perioder.every((periode) => periode.diff === 'Uendret');

  return (
    <VilkårsKort heading="Tilkjent ytelse" steg="BEREGN_TILKJENT_YTELSE">
      <VStack gap="space-16">
        <Chips size={'small'}>
          <Chips.Toggle
            onClick={() => {
              setVisHistorikkPåEndredePerioder(!visHistorikkPåEndredePerioder);
            }}
            selected={visHistorikkPåEndredePerioder}
          >
            Vis historikk på endrede perioder
          </Chips.Toggle>
          <Chips.Toggle
            onClick={() => {
              setVisPerioderUtenEndringFraTidligere(!visPerioderUtenEndringFraTidligere);
            }}
            selected={visPerioderUtenEndringFraTidligere}
          >
            Vis perioder uten endring fra tidligere behandling
          </Chips.Toggle>
        </Chips>
        {skalViseMeldingOmIngenEndringIPerioder && (
          <Alert variant={'info'}>Ingen nye eller endrede perioder siden forrige behandling</Alert>
        )}
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
              <Table.HeaderCell>Barnepensjon</Table.HeaderCell>
              <Table.HeaderCell>Effektiv dagsats</Table.HeaderCell>
              <Table.HeaderCell>Meldekort levert</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {grunnlagMedDiff.perioder.map((periode, periodeIndex) => {
              const nyPeriode = utledNyPeriode(periode);
              const uendretPeriode =
                visPerioderUtenEndringFraTidligere && periode.diff === 'Uendret' ? periode.uendret : null;
              const historiskPeriode = visHistorikkPåEndredePerioder ? utledHistoriskPeriode(periode) : null;
              return (
                <React.Fragment key={periodeIndex}>
                  {nyPeriode && (
                    <TilkjentPeriodeRad key={`ny-${periodeIndex}`} periode={nyPeriode} bakgrunnClassName={''} />
                  )}
                  {historiskPeriode && (
                    <TilkjentPeriodeRad
                      key={`historisk-${periodeIndex}`}
                      periode={historiskPeriode}
                      bakgrunnClassName={styles.tablerowhistoriskinnhold}
                    />
                  )}
                  {uendretPeriode && (
                    <TilkjentPeriodeRad
                      key={`uendret-${periodeIndex}`}
                      periode={uendretPeriode}
                      bakgrunnClassName={''}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
        </TableStyled>
      </VStack>
    </VilkårsKort>
  );
};

const utledNyPeriode = (periode: Diff<TilkjentYtelsePeriode>) => {
  switch (periode.diff) {
    case 'Endret':
      return periode.til;
    case 'LagtTil':
      return periode.lagtTil;
    case 'Fjernet':
    case 'Uendret':
      return null;
  }
};

const utledHistoriskPeriode = (periode: Diff<TilkjentYtelsePeriode>) => {
  switch (periode.diff) {
    case 'Endret':
      return periode.fra;
    case 'Fjernet':
      return periode.fjernet;
    case 'LagtTil':
    case 'Uendret':
      return null;
  }
};

interface TilkjentYtelsePeriodeProps {
  periode: TilkjentYtelsePeriode;
  bakgrunnClassName: string;
}
const TilkjentPeriodeRad = ({ periode, bakgrunnClassName }: TilkjentYtelsePeriodeProps) => {
  return periode.vurdertePerioder.map((vurdertPeriode, vurdertPeriodeIndex) => {
    const skilleLinjeClassName =
      periode.vurdertePerioder.length === vurdertPeriodeIndex + 1 || periode.vurdertePerioder.length === 1
        ? ''
        : styles.tablerowwithoutborder;

    return (
      <Table.Row key={vurdertPeriodeIndex} className={bakgrunnClassName}>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {vurdertPeriodeIndex === 0 && formaterPeriode(periode.meldeperiode.fom, periode.meldeperiode.tom)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterPeriode(vurdertPeriode.periode.fom, vurdertPeriode.periode.tom)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilNok(vurdertPeriode.felter.dagsats)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilNok(vurdertPeriode.felter.barnetillegg)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilProsent(vurdertPeriode.felter.arbeidGradering)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilProsent(vurdertPeriode.felter.samordningGradering)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilProsent(vurdertPeriode.felter.institusjonGradering)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilProsent(vurdertPeriode.felter.arbeidsgiverGradering)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilProsent(vurdertPeriode.felter.totalReduksjon)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilNok(vurdertPeriode.felter.barnepensjonDagsats)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {formaterTilNok(vurdertPeriode.felter.effektivDagsats)}
        </Table.DataCell>
        <Table.DataCell textSize={'small'} className={skilleLinjeClassName}>
          {vurdertPeriodeIndex === 0 &&
            (periode.levertMeldekortDato ? formaterDatoForFrontend(periode.levertMeldekortDato) : 'Ikke levert')}
        </Table.DataCell>
        <Table.DataCell className={skilleLinjeClassName}>
          {vurdertPeriodeIndex === 0 && periode.sisteLeverteMeldekort && (
            <ActionMenu>
              <ActionMenu.Trigger>
                <Button variant={'tertiary'} icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />} />
              </ActionMenu.Trigger>
              <ActionMenu.Content>
                <VStack gap={'space-16'} width={'250px'}>
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
};
