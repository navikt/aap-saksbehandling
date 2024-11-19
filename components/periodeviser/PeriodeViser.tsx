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
      (periode) => isAfter(new Date(valgtMeldeperiode.fom), new Date(periode.periode.fom))
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
          <div key={activePeriod.periode.fom}>
            <Label as="p">
              AAP utbetaling {formaterDatoForFrontend(activePeriod.periode.fom)} -{' '}
              {formaterDatoForFrontend(activePeriod.periode.tom)}
            </Label>
            <Detail>Faktisk utbetaling kan bli justert av eksterne faktorer, eks: lønnstrekk</Detail>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.DataCell scope="row">{'Dagsats'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.dagsats && activePeriod.tilkjent.dagsats.verdi}
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Grunnlag'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.grunnlag && activePeriod.tilkjent.grunnlag.verdi}
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Gradering'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.gradering && activePeriod.tilkjent.gradering.verdi}
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Antall barn'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.antallBarn && activePeriod.tilkjent.antallBarn}
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Barnetillegg'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.barnetillegg && activePeriod.tilkjent.barnetillegg.verdi}
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Barnetilleggsats'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.barnetilleggsats && activePeriod.tilkjent.barnetilleggsats.verdi}kr
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Grunnbeløp'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.grunnbeløp && activePeriod.tilkjent.grunnbeløp.verdi}kr
                  </Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell scope="row">{'Grunnlagsfaktor'}</Table.DataCell>
                  <Table.DataCell>
                    {activePeriod.tilkjent.grunnlagsfaktor && activePeriod.tilkjent.grunnlagsfaktor.verdi}
                  </Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        ))}
    </div>
  );
};
