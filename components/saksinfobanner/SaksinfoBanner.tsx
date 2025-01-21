'use client';

import { Button, Dropdown } from '@navikt/ds-react';
import styles from './SaksinfoBanner.module.css';
import { SaksInformasjon } from 'lib/clientApi';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { SaksInfo } from 'components/saksinfo/SaksInfo';
import { ChevronDownIcon } from '@navikt/aksel-icons';

interface Props {
  personInformasjon: SakPersoninfo;
  saksInfo: SaksInformasjon;
  sak: SaksInfoType;
  referanse: string;
  behandlingVersjon: number;
}

export const SaksinfoBanner = ({ personInformasjon, saksInfo, sak, behandlingVersjon, referanse }: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);

  return (
    <div className={styles.saksinfoBanner}>
      <SaksInfo saksInfo={saksInfo} sak={sak} personInformasjon={personInformasjon} />

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

      <SettBehandllingPåVentModal
        referanse={referanse}
        behandlingVersjon={behandlingVersjon}
        isOpen={settBehandlingPåVentmodalIsOpen}
        onClose={() => setSettBehandlingPåVentmodalIsOpen(false)}
      />
    </div>
  );
};
