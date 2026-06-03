import { BodyShort, Button, Detail, Table, Tooltip, VStack } from '@navikt/ds-react';
import { Dato } from 'lib/types/Dato';
import { isAfter } from 'date-fns';
import { DagDto, MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FørteTimer } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/førtetimer/FørteTimer';
import { hentUkeNummerForPeriode } from '../MeldekortTabell';
import { PencilIcon } from '@navikt/aksel-icons';

interface Props {
  meldekort: MeldeperiodeMedMeldekortDto;
  setSelectedMeldekort: (meldekort: MeldeperiodeMedMeldekortDto) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const MeldekortTabellRow = ({ meldekort, setSelectedMeldekort, setIsOpen }: Props) => {
  const fom = new Dato(meldekort.meldeperiode.fom);
  const tom = new Dato(meldekort.meldeperiode.tom);

  const antallTimerArbeidet = hentTotaltAntallTimerArbeidet(meldekort.meldekort?.dager);
  const antallTimerArbeidetIProsent =
    antallTimerArbeidet != null ? regnUtProsentForTimerArbeidet(antallTimerArbeidet) : undefined;

  const kanRedigereMeldekort = isAfter(new Date(), tom.dato);

  return (
    <Table.ExpandableRow expandOnRowClick content={<FørteTimer meldekort={meldekort} />} togglePlacement={'right'}>
      <Table.HeaderCell textSize={'small'} colSpan={2} scope={'row'}>
        <VStack gap={'space-8'}>
          <BodyShort size={'small'}>{`Uke ${hentUkeNummerForPeriode(fom.dato, tom.dato)}`}</BodyShort>
          <Detail>{`${fom.formaterForFrontend()} - ${tom.formaterForFrontend()}`}</Detail>
        </VStack>
      </Table.HeaderCell>
      <Table.DataCell textSize={'small'}>
        {antallTimerArbeidet != null ? (
          antallTimerArbeidet
        ) : (
          <Tooltip content={'Timer er ikke rapportert / Bruker har ikke meldt seg'}>
            <BodyShort>-</BodyShort>
          </Tooltip>
        )}
      </Table.DataCell>
      <Table.DataCell textSize={'small'} colSpan={3}>
        {antallTimerArbeidetIProsent != null ? `${antallTimerArbeidetIProsent} %` : '-'}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {meldekort.meldekort?.meldeDato ? formaterDatoForFrontend(meldekort.meldekort?.meldeDato) : '-'}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {meldekort.meldekort?.oppdatertTidspunkt
          ? formaterDatoForFrontend(meldekort.meldekort?.oppdatertTidspunkt)
          : '-'}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>{meldekort.meldekort?.oppdatertAv}</Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {kanRedigereMeldekort && (
          <Button
            data-color="neutral"
            variant={'tertiary'}
            icon={<PencilIcon aria-label={'rediger meldekort'} />}
            onClick={() => {
              setSelectedMeldekort(meldekort);
              setIsOpen(true);
            }}
          />
        )}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

function regnUtProsentForTimerArbeidet(antallTimerArbeidet: number): number {
  const antallTimerFor2Uker = 37.5 * 2;
  return Math.round((antallTimerArbeidet / antallTimerFor2Uker) * 100);
}

function hentTotaltAntallTimerArbeidet(dager?: DagDto[]) {
  return dager?.reduce((acc, curr) => acc + (curr.timerArbeidet ? curr.timerArbeidet : 0), 0);
}
