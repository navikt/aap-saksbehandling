import { BodyShort, Button, Detail, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { eachWeekOfInterval, getISOWeek } from 'date-fns';
import { Dato } from 'lib/types/Dato';
import { Dag, DagFraBackend, Meldekort } from '../meldekortTypes';
import { PencilIcon } from '@navikt/aksel-icons';
import { RedigerMeldekortModal } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { useState } from 'react';
import { replaceCommasWithDots } from 'lib/utils/string';

interface Props {
  meldekort: Meldekort[];
}

export const MeldekortTabell = ({ meldekort }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeldekort, setSelectedMeldekort] = useState<Meldekort>();

  return (
    <>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell textSize={'small'} colSpan={2}>
              Meldeperiode
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Timer arbeidet</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'} colSpan={3}>
              Prosent
            </Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Levert dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Sist endret</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Endret av</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {meldekort.map((m, index) => {
            const fom = new Dato(m.meldeperiode.fom);
            const tom = new Dato(m.meldeperiode.tom);

            const antallTimerArbeidet = hentTotaltAntallTimerArbeidet(m.dager);

            return (
              <Table.ExpandableRow key={index} content={'hello pello'}>
                <Table.HeaderCell textSize={'small'} colSpan={2} scope={'row'}>
                  <VStack gap={'2'}>
                    <BodyShort size={'small'}>{`Uke ${hentUkeNummerForPeriode(fom.dato, tom.dato)}`}</BodyShort>
                    <Detail>{`${fom.formaterForFrontend()} - ${tom.formaterForFrontend()}`}</Detail>
                  </VStack>
                </Table.HeaderCell>
                <Table.DataCell textSize={'small'}>{antallTimerArbeidet}</Table.DataCell>
                <Table.DataCell textSize={'small'} colSpan={3}>
                  40%
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{m?.levertDato}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{m?.sistEndret}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{m.endretAv}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Button
                    variant={'tertiary-neutral'}
                    icon={<PencilIcon />}
                    onClick={() => {
                      setSelectedMeldekort(m);
                      setIsOpen(true);
                    }}
                  />
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
      <RedigerMeldekortModal setIsOpen={setIsOpen} isOpen={isOpen} meldekort={selectedMeldekort} />
    </>
  );
};

type UkeGrupper = {
  mandag: DagFraBackend[];
  tirsdag: DagFraBackend[];
  onsdag: DagFraBackend[];
  torsdag: DagFraBackend[];
  fredag: DagFraBackend[];
  lørdag: DagFraBackend[];
  søndag: DagFraBackend[];
};

function hentTotaltAntallTimerArbeidet(dager: DagFraBackend[]) {
  return dager.reduce((acc, curr) => acc + (curr.timerArbeidet ? curr.timerArbeidet : 0), 0);
}

function grupperEtterUkedag(dager: DagFraBackend[]): UkeGrupper {
  return dager.reduce<UkeGrupper>(
    (acc, dag) => {
      const day = new Dato(dag.dato).dato.getDay();

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
