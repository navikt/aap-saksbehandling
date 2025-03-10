'use client';

import { BodyShort, Button, Dropdown, Label } from '@navikt/ds-react';
import styles from './DokumentInfoBanner.module.css';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { SettBehandllingPåVentModal } from '../settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { useState } from 'react';
import { JournalpostInfo } from 'lib/types/postmottakTypes';

interface Props {
  behandlingsreferanse: string;
  journalpostId: number;
  behandlingsVersjon: number;
  journalpostInfo: JournalpostInfo;
}

export const DokumentInfoBanner = ({
  behandlingsreferanse,
  journalpostId,
  behandlingsVersjon,
  journalpostInfo,
}: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  return (
    <div className={styles.dokumentInfoBanner}>
      <div className={styles.left}>
        <div>
          <Label size="small">Journalpost</Label>
          <BodyShort size="small">{`JournalpostId: ${journalpostId}`}</BodyShort>
        </div>
        <div>
          <Label size="small">Person</Label>
          <BodyShort size="small">{journalpostInfo.søker?.navn}</BodyShort>
          <BodyShort size="small">{`Ident: ${journalpostInfo.søker?.ident}`}</BodyShort>
        </div>
        {journalpostInfo.avsender?.ident && (
          <div>
            <Label size="small">Avsender</Label>
            <BodyShort size="small">{journalpostInfo.avsender?.navn}</BodyShort>
            <BodyShort size="small">{`Ident: ${journalpostInfo.avsender?.ident}`}</BodyShort>
          </div>
        )}
        <div>
          <Label size="small">Registrertdato</Label>
          <BodyShort size="small">{journalpostInfo.registrertDato}</BodyShort>
        </div>
      </div>
      <Dropdown>
        <Button
          size={'small'}
          as={Dropdown.Toggle}
          variant={'secondary'}
          icon={<ChevronDownIcon title="chevron-saksmeny" fontSize="1.5rem" />}
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

      <SettBehandllingPåVentModal
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={behandlingsVersjon}
        isOpen={settBehandlingPåVentmodalIsOpen}
        onClose={() => setSettBehandlingPåVentmodalIsOpen(false)}
      />
    </div>
  );
};
