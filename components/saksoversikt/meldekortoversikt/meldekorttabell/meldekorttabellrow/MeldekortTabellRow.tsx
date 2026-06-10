import { BodyShort, Button, Detail, Table, Tooltip, VStack } from '@navikt/ds-react';
import { Dato } from 'lib/types/Dato';
import { isAfter } from 'date-fns';
import { DagDto, MeldeperiodeMedMeldekortDto } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FørteTimer } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/førtetimer/FørteTimer';
import { hentUkeNummerForPeriode } from '../MeldekortTabell';
import { PencilIcon } from '@navikt/aksel-icons';
import { useSakPersonInformasjon } from 'hooks/saksbehandling/SakPersoninformasjonHook';

interface Props {
  meldePeriodeMedMeldekort: MeldeperiodeMedMeldekortDto;
  setSelectedMeldekort: (meldekort: MeldeperiodeMedMeldekortDto) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const MeldekortTabellRow = ({ meldePeriodeMedMeldekort, setSelectedMeldekort, setIsOpen }: Props) => {
  const { personInformasjon } = useSakPersonInformasjon();

  const fom = new Dato(meldePeriodeMedMeldekort.meldeperiode.fom);
  const tom = new Dato(meldePeriodeMedMeldekort.meldeperiode.tom);

  const antallTimerArbeidet = hentTotaltAntallTimerArbeidet(meldePeriodeMedMeldekort.meldekort?.dager);
  const antallTimerArbeidetIProsent =
    antallTimerArbeidet != null ? regnUtProsentForTimerArbeidet(antallTimerArbeidet) : undefined;

  const kanRedigereMeldekort = isAfter(new Date(), tom.dato);

  return (
    <Table.ExpandableRow
      expandOnRowClick
      content={<FørteTimer meldekort={meldePeriodeMedMeldekort} />}
      togglePlacement={'right'}
    >
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
        {meldePeriodeMedMeldekort.meldekort?.meldeDato
          ? formaterDatoForFrontend(meldePeriodeMedMeldekort.meldekort?.meldeDato)
          : '-'}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {meldePeriodeMedMeldekort.meldekort?.oppdatertTidspunkt
          ? formaterDatoForFrontend(meldePeriodeMedMeldekort.meldekort?.oppdatertTidspunkt)
          : '-'}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {utledOppdatertAv(meldePeriodeMedMeldekort.meldekort, personInformasjon.navn)}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {kanRedigereMeldekort && (
          <Button
            data-color="neutral"
            variant={'tertiary'}
            icon={<PencilIcon aria-label={'rediger meldekort'} />}
            onClick={() => {
              setSelectedMeldekort(meldePeriodeMedMeldekort);
              setIsOpen(true);
            }}
          />
        )}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

export function utledOppdatertAv(meldekort: MeldeperiodeMedMeldekortDto['meldekort'], personNavn: string): string {
  if (!meldekort) {
    return '-';
  }
  if (!meldekort.oppdatertAv && !meldekort.oppdatertAvSaksbehandler) {
    return personNavn;
  }
  return meldekort.oppdatertAv ?? '-';
}

function regnUtProsentForTimerArbeidet(antallTimerArbeidet: number): number {
  const antallTimerFor2Uker = 37.5 * 2;
  return Math.round((antallTimerArbeidet / antallTimerFor2Uker) * 100);
}

function hentTotaltAntallTimerArbeidet(dager?: DagDto[]) {
  return dager?.reduce((acc, curr) => acc + (curr.timerArbeidet ? curr.timerArbeidet : 0), 0);
}
