import { Button, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';

import { MeldekortDag } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/meldekortdag/MeldekortDag';
import { eachWeekOfInterval, getISOWeek } from 'date-fns';
import { Dato } from 'lib/types/Dato';
import { Dag, Meldekort } from '../meldekortTypes';
import { PencilIcon } from '@navikt/aksel-icons';
import { RedigerMeldekortModal } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { useState } from 'react';

interface Props {
  meldekort: Meldekort[];
}

export const MeldekortTabell = ({ meldekort }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableStyled tablelayout={'FIXED'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'} colSpan={3}>
              Meldeperiode
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Man</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Tir</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Ons</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Tor</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Fre</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Lør</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} colSpan={2}>
              Søn
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Arbeid</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Fravær</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Levert dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Sist endret</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Endret av</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {meldekort.map((m, index) => {
            const grupperteUkedager = grupperEtterUkedag(m.dager);

            const fom = new Dato(m.meldeperiode.fom);
            const tom = new Dato(m.meldeperiode.tom);

            return (
              <Table.Row key={index}>
                <Table.DataCell textSize={'small'} colSpan={3}>
                  <VStack gap={'2'}>
                    <span>{`Uke ${hentUkeNummerForPeriode(fom.dato, tom.dato)}`}</span>
                    <span>{`${fom.formaterForFrontend()} - ${tom.formaterForFrontend()}`}</span>
                  </VStack>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <MeldekortDag dager={grupperteUkedager.mandag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <MeldekortDag dager={grupperteUkedager.tirsdag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <MeldekortDag dager={grupperteUkedager.onsdag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <MeldekortDag dager={grupperteUkedager.torsdag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <MeldekortDag dager={grupperteUkedager.fredag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <MeldekortDag dager={grupperteUkedager.lørdag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'} colSpan={2}>
                  <MeldekortDag dager={grupperteUkedager.søndag} />
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>40%</Table.DataCell>
                <Table.DataCell textSize={'small'}>0</Table.DataCell>
                <Table.DataCell textSize={'small'}>16.01.2026</Table.DataCell>
                <Table.DataCell textSize={'small'}>16.01.2026</Table.DataCell>
                <Table.DataCell textSize={'small'}>Test Testesen</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Button variant={'tertiary-neutral'} icon={<PencilIcon />} onClick={() => setIsOpen(true)} />
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
      <RedigerMeldekortModal setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
};

type UkeGrupper = {
  mandag: Dag[];
  tirsdag: Dag[];
  onsdag: Dag[];
  torsdag: Dag[];
  fredag: Dag[];
  lørdag: Dag[];
  søndag: Dag[];
};

function grupperEtterUkedag(dager: Dag[]): UkeGrupper {
  return dager.reduce<UkeGrupper>(
    (acc, dag) => {
      const day = dag.dato.getDay();

      switch (day) {
        case 1:
          acc.mandag.push(dag);
          break;
        case 2:
          acc.tirsdag.push(dag);
          break;
        case 3:
          acc.onsdag.push(dag);
          break;
        case 4:
          acc.torsdag.push(dag);
          break;
        case 5:
          acc.fredag.push(dag);
          break;
        case 6:
          acc.lørdag.push(dag);
          break;
        case 0:
          acc.søndag.push(dag);
          break;
      }

      return acc;
    },
    {
      mandag: [],
      tirsdag: [],
      onsdag: [],
      torsdag: [],
      fredag: [],
      lørdag: [],
      søndag: [],
    }
  );
}

export function hentUkeNummerForPeriode(fraDato: Date, tilDato: Date): string {
  const ukenumre = eachWeekOfInterval({ start: fraDato, end: tilDato }, { weekStartsOn: 1 }).map((ukestart) =>
    getISOWeek(ukestart)
  );

  return `${ukenumre.slice(0, -1).join(', ')}${ukenumre.length > 1 ? ' - ' : ''}${ukenumre.slice(-1)}`;
}
