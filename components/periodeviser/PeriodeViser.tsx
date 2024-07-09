'use client';
import { Detail, Label, Select, Table } from '@navikt/ds-react';
import { TilkjentYtelseGrunnlag, TilkjentYtelsePeriode } from 'lib/types/types';
import { useMemo, useState } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from './PeriodeViser.module.css';
import { addDays, format, isAfter, isBefore, parse, subDays } from 'date-fns';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';

interface Props {
  tilkjentYtelse: TilkjentYtelseGrunnlag;
}

type PeriodeOptions = '14' | '30' | '60' | '90';
type PeriodePerOptions = 'dag' | 'uke' | 'mnd';

export const PeriodeViser = ({ tilkjentYtelse }: Props) => {
  const [activePeriod, setActivePeriod] = useState<TilkjentYtelsePeriode>();
  const [ytelseFra, setYtelseFra] = useState<PeriodeOptions>('14');
  const [ytelseTil, setYtelseTil] = useState<PeriodeOptions>('14');
  const [ytelsePer, setYtelsePer] = useState<PeriodePerOptions>('dag');

  const filteredTilkjentYtelser = useMemo(() => {
    console.log('ytelsePer', ytelsePer);
    return tilkjentYtelse.perioder
      ?.filter((ytelse) => isAfter(new Date(ytelse.periode.fom), subDays(new Date(), parseInt(ytelseFra))))
      .filter((ytelse) => isBefore(new Date(ytelse.periode.tom), addDays(new Date(), parseInt(ytelseTil))))
      .map((ytelse) => {
        return {
          name: formaterDatoForFrontend(ytelse.periode.fom),
          dagsats: ytelse.tilkjent.dagsats?.verdi ?? 0,
        };
      });
  }, [ytelseFra, ytelseTil, ytelsePer, tilkjentYtelse]);

  const setActivePeriodFromStartDate = (startDate: Date) => {
    const ytelse = tilkjentYtelse?.perioder.find((ytelse) => ytelse.periode.fom === format(startDate, 'yyyy-MM-dd'));
    setActivePeriod(ytelse);
  };

  return (
    <div>
      <div className={styles.selectContainer}>
        <Select
          label="Vis tilkjent ytelse fra"
          onChange={(event) => setYtelseFra(event.target.value as PeriodeOptions)}
        >
          <option value="14">Siste 14D</option>
          <option value="30">Siste 30D</option>
          <option value="60">Siste 60D</option>
          <option value="90">Siste 90D</option>
        </Select>
        <Select
          label="Vis tilkjent ytelse til"
          onChange={(event) => setYtelseTil(event.target.value as PeriodeOptions)}
        >
          <option value="14">Neste 14D</option>
          <option value="30">Neste 30D</option>
          <option value="60">Neste 60D</option>
          <option value="90">Neste 90D</option>
        </Select>
        <Select label="Ytelse per" onChange={(event) => setYtelsePer(event.target.value as PeriodePerOptions)}>
          <option value="dag">Dag</option>
          <option value="uke">Uke</option>
          <option value="mnd">Mnd</option>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={filteredTilkjentYtelser}
          width={500}
          height={400}
          onClick={(val) => setActivePeriodFromStartDate(parse(val.activeLabel!!, 'dd.MM.yyyy', new Date()))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="dagsats" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>

      {/*<Timeline>
        <Timeline.Row label="AAP" icon={<PersonIcon aria-hidden />}>
          {tilkjentYtelse?.perioder?.map((periode: TilkjentYtelsePeriode, i) => (
            <Timeline.Period
              key={i}
              start={new Date(periode?.periode?.fom)}
              end={new Date(periode?.periode?.tom)}
              status={'info'}
              icon={<PersonIcon />}
              statusLabel={'status status'}
              onSelectPeriod={() => setActivePeriod(periode)}
              // TODO: trenger en id fra backend på tilkjentytelse-periode
              // isActive={activePeriod.id === periode.id}
            />
          ))}
        </Timeline.Row>
        <Timeline.Zoom>
          <Timeline.Zoom.Button label="3 mnd" interval="month" count={3} />
          <Timeline.Zoom.Button label="9 mnd" interval="month" count={9} />
          <Timeline.Zoom.Button label="1.5 år" interval="year" count={1.5} />
          <Timeline.Zoom.Button label="3 år" interval="year" count={3} />
        </Timeline.Zoom>
      </Timeline>*/}
      {activePeriod && (
        <div>
          <Label as="p">
            AAP utbetaling {formaterDatoForFrontend(activePeriod.periode.fom)} -{' '}
            {formaterDatoForFrontend(activePeriod.periode.tom)}
          </Label>
          <Detail>Faktisk utbetaling kan bli justert av eksterne faktorer, eks: lønnstrekk</Detail>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.DataCell scope="row">{'Dagsats'}</Table.DataCell>
                <Table.DataCell>{activePeriod.tilkjent.dagsats && activePeriod.tilkjent.dagsats.verdi}</Table.DataCell>
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
                <Table.DataCell>{activePeriod.tilkjent.antallBarn && activePeriod.tilkjent.antallBarn}</Table.DataCell>
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
      )}
    </div>
  );
};
