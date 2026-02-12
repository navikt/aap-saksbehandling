'use client';

import { BodyShort, Button, CopyButton, Dropdown, HStack, Tag, Tooltip } from '@navikt/ds-react';
import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { JournalpostInfo } from 'lib/types/postmottakTypes';

import styles from './DokumentInfoBanner.module.css';
import { PostmottakSettBehandllingPVentModal } from 'components/postmottak/postmottaksettbehandlingpåventmodal/PostmottakSettBehandllingPåVentModal';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { Dato } from 'lib/types/Dato';

interface Props {
  behandlingsreferanse: string;
  behandlingsVersjon: number;
  journalpostInfo: JournalpostInfo;
  påVent: boolean;
  oppgave: Oppgave;
  innloggetBrukerIdent?: string;
}

export const DokumentInfoBanner = ({
  behandlingsreferanse,
  behandlingsVersjon,
  journalpostInfo,
  påVent,
  oppgave,
  innloggetBrukerIdent,
}: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);

  const erReservertAvInnloggetBruker = innloggetBrukerIdent === oppgave?.reservertAv;

  const hentOppgaveTildeling = (): OppgaveStatusType | undefined => {
    if (!oppgave?.reservertAv) {
      return { status: 'LEDIG', label: `Ledig` };
    } else if (erReservertAvInnloggetBruker) {
      return {
        status: 'TILDELT_INNLOGGET_BRUKER',
        label: `Tildelt: ${oppgave?.reservertAvNavn ?? oppgave?.reservertAv}`,
      };
    } else if (oppgave?.reservertAv && !erReservertAvInnloggetBruker) {
      return { status: 'TILDELT', label: `Tildelt: ${oppgave?.reservertAvNavn ?? oppgave?.reservertAv}` };
    }
  };

  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (påVent) {
      return { status: 'PÅ_VENT', label: 'På vent' };
    } else if (oppgave?.utløptVentefrist) {
      return {
        status: 'VENTEFRIST_UTLØPT',
        label: `Frist utløpt ${new Dato(oppgave.utløptVentefrist).formaterForFrontend()}`,
      };
    }
  };

  const tildelingStatus = hentOppgaveTildeling();
  const oppgaveStatus = hentOppgaveStatus();

  return (
    <div className={styles.dokumentinfobanner}>
      <div className={styles.dokumentinfo}>
        <HStack gap={'2'} align="center">
          <BodyShort size="small">{storForbokstavIHvertOrd(journalpostInfo.søker?.navn)}</BodyShort>

          <CopyButton
            copyText={journalpostInfo.søker?.ident!}
            size="xsmall"
            text={journalpostInfo.søker?.ident!}
            iconPosition="right"
            className={styles.copybutton}
          />

          <ChevronRightIcon className={styles.chevron} />
          <div>
            <Tooltip content={'Avsender'}>
              <HStack gap={'2'}>
                <PaperplaneIcon title={'avsender'} />
                <BodyShort size={'small'}>{storForbokstavIHvertOrd(journalpostInfo.avsender?.navn)}</BodyShort>
              </HStack>
            </Tooltip>
          </div>

          <ChevronRightIcon className={styles.chevron} />
          <BodyShort size={'small'}>Journalføring {journalpostInfo.journalpostId}</BodyShort>

          <ChevronRightIcon className={styles.chevron} />
          <BodyShort size={'small'}>Dokumenthåndtering</BodyShort>
          <Tag className={styles.tag} size={'xsmall'} variant={'alt1'}>
            {formaterDatoForFrontend(journalpostInfo.registrertDato!)}
          </Tag>
        </HStack>
      </div>

      <HStack>
        {oppgaveStatus && (
          <div className={styles.oppgavestatus}>
            <OppgaveStatus oppgaveStatus={oppgaveStatus} />
          </div>
        )}
        {tildelingStatus && (
          <div className={styles.oppgavestatus}>
            <OppgaveStatus oppgaveStatus={tildelingStatus} />
          </div>
        )}
        <div className={styles.meny}>
          <Dropdown>
            <Button
              size={'small'}
              as={Dropdown.Toggle}
              variant={'secondary'}
              icon={<ChevronDownIcon title="chevron-saksmeny" fontSize="1.5rem" aria-hidden />}
              iconPosition={'right'}
            >
              Saksmeny
            </Button>
            <Dropdown.Menu>
              <Dropdown.Menu.GroupedList>
                <Dropdown.Menu.GroupedList.Heading>Saksmeny</Dropdown.Menu.GroupedList.Heading>
                <Dropdown.Menu.GroupedList.Item onClick={() => setSettBehandlingPåVentmodalIsOpen(true)}>
                  Sett behandling på vent
                </Dropdown.Menu.GroupedList.Item>
              </Dropdown.Menu.GroupedList>
            </Dropdown.Menu>
          </Dropdown>

          <PostmottakSettBehandllingPVentModal
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingsVersjon}
            isOpen={settBehandlingPåVentmodalIsOpen}
            onClose={() => setSettBehandlingPåVentmodalIsOpen(false)}
          />
        </div>
      </HStack>
    </div>
  );
};
