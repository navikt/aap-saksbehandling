import { TableStyled } from 'components/tablestyled/TableStyled';
import { Checkbox, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { MeldepliktOverstyringStatus, Periode, OverstyringMeldepliktGrunnlagVurdering } from 'lib/types/types';
import styles from './rimeliggrunn.module.css';

type Props = {
  ikkeMeldtPerioder: Periode[];
  readOnly?: boolean;
  tidligereVurdertePerioder: OverstyringMeldepliktGrunnlagVurdering[];
  valgtePerioder: string[];
  onClickPeriode: (checked: boolean, fraDato: string) => void;
};

type TableRow =
  | { type: 'IKKE_MELDT'; fom: string; row: Periode }
  | { type: 'TIDLIGERE_VURDERT'; fom: string; row: OverstyringMeldepliktGrunnlagVurdering };

export const IkkeMeldtPerioderTable = ({
  ikkeMeldtPerioder,
  readOnly = false,
  tidligereVurdertePerioder,
  valgtePerioder,
  onClickPeriode,
}: Props) => {
  const ikkeMeldtAsTableRow: TableRow[] = ikkeMeldtPerioder.map((periode) => ({
    type: 'IKKE_MELDT',
    fom: periode.fom,
    row: periode,
  }));

  const tidligereVurdertTableRow: TableRow[] = tidligereVurdertePerioder.map((periode) => ({
    type: 'TIDLIGERE_VURDERT',
    fom: periode.fraDato,
    row: periode,
  }));

  const sortedTableRows = ikkeMeldtAsTableRow
    .concat(tidligereVurdertTableRow)
    .sort((a, b) => a.fom.localeCompare(b.fom));

  return (
    <div>
      <div>
        Tabellen viser meldeperioder hvor brukeren ikke har levert meldekort innen fristen, og Kelvin derfor har
        registrert brukeren som å ikke ha overholdt meldeplikten. Tabellen viser også perioder hvor vurderingen
        tidligere har blitt overstyrt fordi det enten har vært rimelig grunn eller brukeren har overholdt meldeplikten
        på andre måter.
      </div>
      <TableStyled size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Vurdering</Table.HeaderCell>
            <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
            <Table.HeaderCell>Dato</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedTableRows.map((periode) => {
            const periodeErValgt = valgtePerioder.some((p) => p === periode.fom);
            return (
              <Table.Row key={periode.fom} className={periodeErValgt ? styles.valgtRad : ''}>
                {periode.type === 'TIDLIGERE_VURDERT' ? (
                  <TidligereVurdertPeriodeRow
                    periode={periode.row}
                    checked={periodeErValgt}
                    onChange={onClickPeriode}
                    readonly={readOnly}
                  />
                ) : (
                  <IkkeMeldtPeriodeRowData
                    periode={periode.row}
                    checked={periodeErValgt}
                    onChange={onClickPeriode}
                    readOnly={readOnly}
                  />
                )}
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
    </div>
  );
};

type IkkeMeldtRowProps = {
  periode: Periode;
  checked: boolean;
  readOnly?: boolean;
  onChange: (checked: boolean, fraDato: string) => void;
};

const IkkeMeldtPeriodeRowData = ({ periode, checked, onChange, readOnly }: IkkeMeldtRowProps) => (
  <>
    <Table.DataCell>
      <Checkbox
        disabled={readOnly === true}
        readOnly={readOnly}
        checked={checked}
        onChange={(e) => onChange(e.target.checked, periode.fom)}
      >
        {' '}
      </Checkbox>
    </Table.DataCell>
    <Table.DataCell textSize={'small'}>{formaterPeriode(periode.fom, periode.tom)}</Table.DataCell>
    <Table.DataCell textSize="small">{mapRimeligGrunnToDisplayText('IKKE_MELDT_SEG')}</Table.DataCell>
    <Table.DataCell textSize="small"> </Table.DataCell>
    <Table.DataCell textSize="small">—</Table.DataCell>
    <Table.DataCell textSize="small">KELVIN</Table.DataCell>
  </>
);

type TidligereVurdertRowProps = {
  periode: OverstyringMeldepliktGrunnlagVurdering;
  checked: boolean;
  readonly: boolean;
  onChange: (checked: boolean, fraDato: string) => void;
};

const TidligereVurdertPeriodeRow = ({ periode, checked, onChange, readonly }: TidligereVurdertRowProps) => (
  <>
    <Table.DataCell>
      <Checkbox
        readOnly={readonly}
        disabled={readonly}
        checked={checked}
        onChange={(e) => onChange(e.target.checked, periode.fraDato)}
      >
        {` `}
      </Checkbox>
    </Table.DataCell>
    <Table.DataCell textSize="small">{formaterPeriode(periode.fraDato, periode.tilDato)}</Table.DataCell>
    <Table.DataCell textSize="small">
      {mapRimeligGrunnToDisplayText(periode.meldepliktOverstyringStatus)}
    </Table.DataCell>
    <Table.DataCell className={styles.beskrivelse} textSize="small">
      {periode.begrunnelse}
    </Table.DataCell>
    <Table.DataCell textSize="small">{formaterDatoForFrontend(periode.vurderingsTidspunkt)}</Table.DataCell>
    <Table.DataCell textSize="small">
      {periode.vurdertAv?.ansattnavn ?? periode.vurdertAv?.ident ?? ''}
      <br />
      {periode.vurdertAv?.enhetsnavn ?? ''}
    </Table.DataCell>
  </>
);

const mapRimeligGrunnToDisplayText = (rimneligGrunn: MeldepliktOverstyringStatus): string => {
  switch (rimneligGrunn) {
    case 'HAR_MELDT_SEG':
      return 'Meldeplikt overholdt';
    case 'IKKE_MELDT_SEG':
      return 'Meldeplikt ikke overholdt';
    case 'RIMELIG_GRUNN':
      return 'Rimelig grunn';
  }
};
