'use client';

import { ChevronDownIcon, ChevronRightIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, CopyButton, Dropdown, HStack, Label, Link, Tag, Tooltip } from '@navikt/ds-react';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { Dato } from 'lib/types/Dato';
import { OppgaveVisningsinformasjon } from 'lib/types/oppgaveTypes';
import { JournalpostInfo } from 'lib/types/postmottakTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { useState } from 'react';

import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { PostmottakSettBehandllingPVentModal } from 'components/postmottak/postmottaksettbehandlingpåventmodal/PostmottakSettBehandllingPåVentModal';

import styles from './DokumentInfoBanner.module.css';

interface Props {
  behandlingsreferanse: string;
  behandlingsVersjon: number;
  journalpostInfo: JournalpostInfo;
  påVent: boolean;
  oppgaveVisningsinfo: OppgaveVisningsinformasjon;
}

export const DokumentInfoBanner = ({
  behandlingsreferanse,
  behandlingsVersjon,
  journalpostInfo,
  påVent,
  oppgaveVisningsinfo,
}: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  const bruker = useInnloggetBruker();

  const erReservertAvInnloggetBruker = bruker.NAVident === oppgaveVisningsinfo.reservertAvIdent;

  const hentOppgaveTildeling = (): OppgaveStatusType | undefined => {
    if (!oppgaveVisningsinfo.reservertAvIdent) {
      return { status: 'LEDIG', label: `Ledig` };
    } else if (erReservertAvInnloggetBruker) {
      return {
        status: 'TILDELT_INNLOGGET_BRUKER',
        label: `Tildelt: ${oppgaveVisningsinfo.reservertAvNavn ?? oppgaveVisningsinfo.reservertAvIdent}`,
      };
    } else if (oppgaveVisningsinfo.reservertAvIdent && !erReservertAvInnloggetBruker) {
      return {
        status: 'TILDELT',
        label: `Tildelt: ${oppgaveVisningsinfo.reservertAvNavn ?? oppgaveVisningsinfo.reservertAvIdent}`,
      };
    }
  };

  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (påVent) {
      return { status: 'PÅ_VENT', label: 'På vent' };
    } else if (oppgaveVisningsinfo?.utløptVenteInfo) {
      return {
        status: 'VENTEFRIST_UTLØPT',
        label: `Frist utløpt ${new Dato(oppgaveVisningsinfo.utløptVenteInfo.påVentTil).formaterForFrontend()}`,
      };
    }
  };

  const tildelingStatus = hentOppgaveTildeling();
  const oppgaveStatus = hentOppgaveStatus();
  const søkerNavn = storForbokstavIHvertOrd(journalpostInfo.søker?.navn);

  return (
    <div className={styles.dokumentinfobanner}>
      <div className={styles.dokumentinfo}>
        <HStack gap={'space-8'} align="center">
          {oppgaveVisningsinfo?.saksnummer ? (
            <Label size="small">
              <Link href={`/saksbehandling/sak/${oppgaveVisningsinfo.saksnummer}`}>{søkerNavn}</Link>
            </Label>
          ) : (
            <BodyShort size="small" weight="semibold">
              {søkerNavn}
            </BodyShort>
          )}

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
              <HStack gap={'space-8'}>
                <PaperplaneIcon title={'avsender'} />
                <BodyShort size={'small'}>{storForbokstavIHvertOrd(journalpostInfo.avsender?.navn)}</BodyShort>
              </HStack>
            </Tooltip>
          </div>

          <ChevronRightIcon className={styles.chevron} />
          <BodyShort size={'small'}>Journalføring {journalpostInfo.journalpostId}</BodyShort>

          <ChevronRightIcon className={styles.chevron} />
          <BodyShort size={'small'}>Dokumenthåndtering</BodyShort>
          <Tag data-color="meta-purple" size={'xsmall'} variant={'outline'}>
            Registrert: {formaterDatoForFrontend(journalpostInfo.registrertDato!)}
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
