import { Table } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { eachWeekOfInterval, getISOWeek } from 'date-fns';
import { RedigerMeldekortModal } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { useState } from 'react';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { Kort } from 'components/kort/Kort';
import { useMeldekort } from 'hooks/saksbehandling/MeldekortHook';
import { MeldekortTabellRow } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/meldekorttabellrow/MeldekortTabellRow';
import { sorterEtterNyesteDato } from 'lib/utils/date';

export const MeldekortTabell = () => {
  const { alleMeldekort } = useMeldekort();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeldekort, setSelectedMeldekort] = useState<MeldeperiodeMedMeldekortDto>();

  return (
    <Kort background="default" padding="space-0">
      <TableStyled>
        <Table.Header>
          <Table.Row>
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
            <Table.HeaderCell colSpan={2} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {alleMeldekort
            ?.sort((a, b) => sorterEtterNyesteDato(a.meldeperiode.fom, b.meldeperiode.fom))
            .map((meldekort, index) => (
              <MeldekortTabellRow
                key={index}
                meldePeriodeMedMeldekort={meldekort}
                setSelectedMeldekort={setSelectedMeldekort}
                setIsOpen={setIsOpen}
              />
            ))}
        </Table.Body>
      </TableStyled>
      <RedigerMeldekortModal setIsOpen={setIsOpen} isOpen={isOpen} meldekort={selectedMeldekort} />
    </Kort>
  );
};

export function hentUkeNummerForPeriode(fraDato: Date, tilDato: Date): string {
  const ukenumre = eachWeekOfInterval({ start: fraDato, end: tilDato }, { weekStartsOn: 1 }).map((ukestart) =>
    getISOWeek(ukestart)
  );

  return `${ukenumre.slice(0, -1).join(', ')}${ukenumre.length > 1 ? ' - ' : ''}${ukenumre.slice(-1)}`;
}
