import { BodyShort, Label, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { RegistrerYrkesskade } from 'lib/types/types';

interface Props {
  yrkesskader: RegistrerYrkesskade[];
}

export const YrkesskadeTabell = ({ yrkesskader }: Props) => {
  return (
    <div>
      <div>
        <Label size={'medium'}>brukeren har en registrert yrkesskade med årsakssammenheng</Label>
        <BodyShort>
          Beregn antatt årlig arbeidsinntekt ved skadetidspunktet etter § 11-22. Inntekten skal ikke G-justeres.
        </BodyShort>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Saksnummer</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Kilde</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Skadedato</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {yrkesskader.map((yrkesskade) => {
            // TODO denne skal alternativt hentes fra vurderingen dersom skadedato mangler i grunnlaget
            const skadedato = yrkesskade.skadedato ? formaterDatoForFrontend(yrkesskade.skadedato) : 'Ukjent';

            return (
              <Table.Row key={yrkesskade.ref}>
                <Table.DataCell textSize={'small'}>{yrkesskade.saksnummer}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{yrkesskade.kilde}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{skadedato}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
