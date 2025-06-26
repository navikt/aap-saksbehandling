'use client';

import { Table } from '@navikt/ds-react';
import { UnderveisAvslagsÅrsak, UnderveisGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapUtfallTilTekst } from 'lib/utils/oversettelser';
import { exhaustiveCheck } from 'lib/utils/typescript';

type Props = {
  grunnlag: UnderveisGrunnlag[];
};

const Perioderad = ({ periode }: { periode: UnderveisGrunnlag }) => (
  <Table.Row>
    <Table.HeaderCell>
      {formaterDatoForFrontend(periode.periode.fom)} - {formaterDatoForFrontend(periode.periode.tom)}
    </Table.HeaderCell>
    <Table.DataCell>{mapUtfallTilTekst(periode.utfall)}</Table.DataCell>
    <Table.DataCell>{periode.avslagsårsak && årsakTilString(periode.avslagsårsak)}</Table.DataCell>
    <Table.DataCell>
      <div>Gradering: {periode.gradering.gradering}%</div>
      <div>Andel arbeid: {periode.gradering.andelArbeid}%</div>
      <div>Fastsatt arbeidsevne: {periode.gradering.fastsattArbeidsevne}%</div>
      <div>Grenseverdi: {periode.gradering.grenseverdi}%</div>
    </Table.DataCell>
    <Table.DataCell>{periode.trekk.antall}</Table.DataCell>
    <Table.DataCell>{periode.brukerAvKvoter.join(' og ')}</Table.DataCell>
    <Table.DataCell>
      {formaterDatoForFrontend(periode.meldePeriode.fom)} - {formaterDatoForFrontend(periode.meldePeriode.tom)}
    </Table.DataCell>
  </Table.Row>
);

export const Underveisgrunnlag = ({ grunnlag }: Props) => {
  console.log(grunnlag);
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Vurdert periode</Table.HeaderCell>
          <Table.HeaderCell>Utfall</Table.HeaderCell>
          <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
          <Table.HeaderCell>Gradering</Table.HeaderCell>
          <Table.HeaderCell>Trekk (dagsatser)</Table.HeaderCell>
          <Table.HeaderCell>Kvoter</Table.HeaderCell>
          <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.map((periode, index) => (
          <Perioderad key={index} periode={periode} />
        ))}
      </Table.Body>
    </Table>
  );
};

function årsakTilString(avslagsÅrsak: UnderveisAvslagsÅrsak): string {
  switch (avslagsÅrsak) {
    case 'IKKE_GRUNNLEGGENDE_RETT':
      return 'Ikke grunnleggende rett.';
    case 'MELDEPLIKT_FRIST_IKKE_PASSERT':
      return 'Meldepliktfrist ikke passert';
    case 'IKKE_OVERHOLDT_MELDEPLIKT_SANKSJON':
      return 'Ikke overhold meldeplikt sanksjon';
    case 'ARBEIDER_MER_ENN_GRENSEVERDI':
      return 'Arbeider mer enn grenseverdi';
    case 'SONER_STRAFF':
      return 'Soner straff';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT':
      return 'Brudd på aktivitetsplikt';
    case 'FRAVÆR_FASTSATT_AKTIVITET':
      return 'Fravær fastsatt aktivitet';
    case 'VARIGHETSKVOTE_BRUKT_OPP':
      return 'Varighetskvote brukt opp';
    default:
      exhaustiveCheck(avslagsÅrsak);
  }
}
