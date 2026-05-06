import { BodyShort, Label, Table } from '@navikt/ds-react';
import { RegistrerYrkesskade } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  yrkesskader: RegistrerYrkesskade[];
}

export const YrkesskadeTabell = ({ yrkesskader }: Props) => (
  <div>
    <div>
      <Label size={'medium'}>Brukeren har en registrert yrkesskade med årsakssammenheng</Label>
      <BodyShort>
        Beregn antatt årlig arbeidsinntekt ved skadetidspunktet etter § 11-22. Inntekten skal ikke G-justeres.
      </BodyShort>
    </div>
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textSize={'small'}>Saksnummer</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Kilde</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Skadedato</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Vedtaksdato</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Skadeart</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Diagnose</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Skadebeskrivelse</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {yrkesskader.map((yrkesskade) => (
          <Table.Row key={yrkesskade.ref}>
            <Table.DataCell textSize={'small'}>{yrkesskade.saksnummer}</Table.DataCell>
            <Table.DataCell textSize={'small'}>{yrkesskade.kilde}</Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {yrkesskade.skadedato && formaterDatoForFrontend(yrkesskade.skadedato)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {yrkesskade.vedtaksdato ? formaterDatoForFrontend(yrkesskade.vedtaksdato) : '–'}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {yrkesskade.skadeart
                ? `${yrkesskade.skadeart.charAt(0).toUpperCase()}${yrkesskade.skadeart.slice(1).toLowerCase()}`
                : '–'}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {yrkesskade.diagnose
                ? `${yrkesskade.diagnose.charAt(0).toUpperCase()}${yrkesskade.diagnose.slice(1).toLowerCase()}`
                : '–'}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {yrkesskade.skadekombinasjonerTekst
                ? yrkesskade.skadekombinasjonerTekst
                : yrkesskade.skadekombinasjoner
                    ?.map(
                      (k) =>
                        `${k.skadetype.charAt(0).toUpperCase()}${k.skadetype.slice(1).toLowerCase()} i ${k.kroppsdel.toLowerCase()}`
                    )
                    .join(', ') || '–'}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </TableStyled>
  </div>
);
