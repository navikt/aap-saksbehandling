import { BodyShort, Button, Detail, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { eachWeekOfInterval, getISOWeek } from 'date-fns';
import { Dato } from 'lib/types/Dato';
import { PencilIcon } from '@navikt/aksel-icons';
import { RedigerMeldekortModal } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { useState } from 'react';
import { FørteTimer } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/førtetimer/FørteTimer';
import { useMeldekort } from 'hooks/saksbehandling/MeldekortHook';
import { DagDto, MeldeperiodeMedMeldekortDto } from 'lib/types/types';

export const MeldekortTabell = () => {
  const { alleMeldekort } = useMeldekort();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeldekort, setSelectedMeldekort] = useState<MeldeperiodeMedMeldekortDto>();

  return (
    <>
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
          {alleMeldekort?.map((meldekort, index) => {
            const fom = new Dato(meldekort.meldeperiode.fom);
            const tom = new Dato(meldekort.meldeperiode.tom);

            const antallTimerArbeidet = hentTotaltAntallTimerArbeidet(meldekort.meldekort?.dager);
            const antallTimerArbeidetIProsent = antallTimerArbeidet
              ? regnUtProsentForTimerArbeidet(antallTimerArbeidet)
              : undefined;

            return (
              <Table.ExpandableRow
                expandOnRowClick
                key={index}
                content={<FørteTimer meldekort={meldekort} />}
                togglePlacement={'right'}
              >
                <Table.HeaderCell textSize={'small'} colSpan={2} scope={'row'}>
                  <VStack gap={'space-8'}>
                    <BodyShort size={'small'}>{`Uke ${hentUkeNummerForPeriode(fom.dato, tom.dato)}`}</BodyShort>
                    <Detail>{`${fom.formaterForFrontend()} - ${tom.formaterForFrontend()}`}</Detail>
                  </VStack>
                </Table.HeaderCell>
                <Table.DataCell textSize={'small'}>{antallTimerArbeidet}</Table.DataCell>
                <Table.DataCell textSize={'small'} colSpan={3}>
                  {antallTimerArbeidetIProsent} %
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>levert dato</Table.DataCell>
                <Table.DataCell textSize={'small'}>sist endret dato</Table.DataCell>
                <Table.DataCell textSize={'small'}>endret av</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Button
                    data-color="neutral"
                    variant={'tertiary'}
                    icon={<PencilIcon />}
                    onClick={() => {
                      setSelectedMeldekort(meldekort);
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

function regnUtProsentForTimerArbeidet(antallTimerArbeidet: number): number {
  const antallTimerFor2Uker = 37.5 * 2;
  return Math.round((antallTimerArbeidet / antallTimerFor2Uker) * 100);
}

function hentTotaltAntallTimerArbeidet(dager?: DagDto[]) {
  return dager?.reduce((acc, curr) => acc + (curr.timerArbeidet ? curr.timerArbeidet : 0), 0);
}

export function hentUkeNummerForPeriode(fraDato: Date, tilDato: Date): string {
  const ukenumre = eachWeekOfInterval({ start: fraDato, end: tilDato }, { weekStartsOn: 1 }).map((ukestart) =>
    getISOWeek(ukestart)
  );

  return `${ukenumre.slice(0, -1).join(', ')}${ukenumre.length > 1 ? ' - ' : ''}${ukenumre.slice(-1)}`;
}
