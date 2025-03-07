'use client';
import { Detail, Label, Select, Table } from '@navikt/ds-react';
import { TilkjentYtelseGrunnlag } from 'lib/types/types';
import { useMemo, useState } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from './PeriodeViser.module.css';
import { Meldeperiode } from 'components/behandlinger/tilkjentytelse/tilkjent/TilkjentMedDatafetching';
import { getISOWeek, isAfter } from 'date-fns';

interface Props {
  tilkjentYtelse: TilkjentYtelseGrunnlag;
  meldeperioder: Meldeperiode[];
}

export const PeriodeViser = ({ tilkjentYtelse, meldeperioder }: Props) => {
  const [valgtMeldeperiode, setValgtMeldeperiode] = useState<Meldeperiode | undefined>(meldeperioder[0]); // TODO Bruke en bedre default

  const getPerioderInsideMeldeperiode = (tilkjentYtelse: TilkjentYtelseGrunnlag, valgtMeldeperiode?: Meldeperiode) => {
    if (!valgtMeldeperiode) {
      return [];
    }
    return tilkjentYtelse.perioder.filter(
      (periode) => isAfter(new Date(valgtMeldeperiode.fom), new Date(periode.fraOgMed))
      //isBefore(new Date(valgtMeldeperiode.tom), new Date(periode.periode.tom))
    );
  };

  const activePeriods = useMemo(() => {
    return getPerioderInsideMeldeperiode(tilkjentYtelse, valgtMeldeperiode);
  }, [valgtMeldeperiode, tilkjentYtelse]);

  return (
    <div>
      <div className={styles.selectContainer}>
        <Select
          label="Tilkjent ytelse for meldeperiode"
          onChange={(event) =>
            setValgtMeldeperiode(meldeperioder.find((meldeperiode) => meldeperiode.fom === event.target.value))
          }
        >
          {meldeperioder.map((meldeperiode) => (
            <option key={meldeperiode.fom} value={meldeperiode.fom}>
              Uke {getISOWeek(meldeperiode.fom)} - Uke {getISOWeek(meldeperiode.tom)}
            </option>
          ))}
        </Select>
      </div>

      {activePeriods &&
        activePeriods.map((activePeriod) => (
          <div key={activePeriod.fraOgMed}>
            <Label as="p">
              AAP utbetaling {formaterDatoForFrontend(activePeriod.fraOgMed)} -{' '}
              {formaterDatoForFrontend(activePeriod.fraOgMed)}
            </Label>
            <Detail>Faktisk utbetaling kan bli justert av eksterne faktorer, eks: lønnstrekk</Detail>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.DataCell scope="row">{'Dagsats'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.dagsats && activePeriod.dagsats}</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Grunnlag'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.grunnlag && activePeriod.grunnlag}</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Gradering'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.gradering && activePeriod.gradering}</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Antall barn'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.antallBarn && activePeriod.antallBarn}</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Barnetillegg'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.barnetillegg && activePeriod.barnetillegg}</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Barnetilleggsats'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.barnetilleggsats && activePeriod.barnetilleggsats}kr</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Grunnbeløp'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.grunnbeløp && activePeriod.grunnbeløp}kr</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Grunnlagsfaktor'}</Table.DataCell>
                  <Table.DataCell>{activePeriod.grunnlagsfaktor && activePeriod.grunnlagsfaktor}</Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        ))}
    </div>
  );
};
