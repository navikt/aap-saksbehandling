import { BodyShort, Button, Detail, Table, Tooltip, VStack } from '@navikt/ds-react';
import { Dato } from 'lib/types/Dato';
import { isAfter } from 'date-fns';
import { DagDto, MeldeperiodeMedMeldekortDto, MeldepliktStatuser } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { MeldekortExpandableContent } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/meldekortexpandablecontent/MeldekortExpandableContent';
import { hentUkeNummerForPeriode } from '../MeldekortTabell';
import { PencilIcon } from '@navikt/aksel-icons';
import { useSakPersonInformasjon } from 'hooks/saksbehandling/SakPersoninformasjonHook';
import { storForbokstavIHvertOrd } from 'lib/utils/string';

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

  const kanRedigereMeldekort = isAfter(new Date(), tom.dato);

  return (
    <Table.ExpandableRow
      expandOnRowClick
      content={<MeldekortExpandableContent meldekort={meldePeriodeMedMeldekort} />}
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
          `${antallTimerArbeidet} timer`
        ) : (
          <Tooltip content={'Timer er ikke rapportert / Bruker har ikke meldt seg'}>
            <BodyShort>-</BodyShort>
          </Tooltip>
        )}
      </Table.DataCell>
      <Table.DataCell textSize={'small'}>
        {meldepliktStatusTilString(meldePeriodeMedMeldekort.meldepliktStatus)}
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
    return storForbokstavIHvertOrd(personNavn);
  }
  return meldekort.oppdatertAv ?? '-';
}

function hentTotaltAntallTimerArbeidet(dager?: DagDto[]) {
  return dager?.reduce((acc, curr) => acc + (curr.timerArbeidet ? curr.timerArbeidet : 0), 0);
}

function meldepliktStatusTilString(meldepliktStatuser: MeldepliktStatuser) {
  return meldepliktStatuser
    .map((status) => {
      switch (status) {
        case 'FREMTIDIG_IKKE_OPPFYLT':
          return 'Fremtidig ikke oppfylt';
        case 'FREMTIDIG_OPPFYLT':
          return 'Fremtidig oppfylt';
        case 'FRITAK':
          return 'Fritak';
        case 'FØRSTE_MELDEPERIODE_MED_RETT':
          return 'Første meldeperiode med rett';
        case 'FØR_VEDTAK':
          return 'Oppfylt, før vedtak';
        case 'IKKE_MELDT_SEG':
          return 'Ikke oppfylt';
        case 'MELDT_SEG':
          return 'Meldt seg';
        case 'RIMELIG_GRUNN':
          return 'Rimelig grunn';
        case 'UTEN_RETT':
          return 'Uten rett';
        default:
          return status;
      }
    })
    .join(', ');
}
