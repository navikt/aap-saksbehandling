'use client';

import { BodyShort, Button, CopyButton, Dropdown, HStack, Tag, Tooltip } from '@navikt/ds-react';
import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon, HourglassTopFilledIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { JournalpostInfo } from 'lib/types/postmottakTypes';

import styles from './DokumentInfoBanner.module.css';
import { PostmottakSettBehandllingPVentModal } from 'components/postmottak/postmottaksettbehandlingpåventmodal/PostmottakSettBehandllingPåVentModal';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { storForbokstav } from 'lib/utils/string';

interface Props {
  behandlingsreferanse: string;
  behandlingsVersjon: number;
  journalpostInfo: JournalpostInfo;
  påVent: boolean;
}

export const DokumentInfoBanner = ({ behandlingsreferanse, behandlingsVersjon, journalpostInfo, påVent }: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);

  return (
    <div className={styles.dokumentinfobanner}>
      <div className={styles.dokumentinfo}>
        <HStack gap={'2'} align="center">
          <BodyShort size="small">{storForbokstav(journalpostInfo.søker?.navn || '')}</BodyShort>

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
                <BodyShort size={'small'}>{journalpostInfo.avsender?.navn}</BodyShort>
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
        <div className={styles.status}>
          {påVent && (
            <Tag className={styles.tag} icon={<HourglassTopFilledIcon />} variant={'warning-moderate'} size={'small'}>
              På vent
            </Tag>
          )}
        </div>
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
