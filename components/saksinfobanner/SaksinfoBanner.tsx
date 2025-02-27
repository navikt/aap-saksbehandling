'use client';

import { Box, Button, Dropdown, HStack } from '@navikt/ds-react';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { SaksInfo } from 'components/saksinfo/SaksInfo';
import { ChevronDownIcon } from '@navikt/aksel-icons';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
  referanse?: string;
  behandlingVersjon?: number;
}

export const SaksinfoBanner = ({ personInformasjon, sak, behandlingVersjon, referanse }: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);

  return (
    <Box
      role="navigation"
      paddingBlock="3"
      paddingInline="5"
      borderWidth="0 0 1 0"
      borderColor="border-subtle"
      background="surface-subtle"
    >
      <HStack gap="4" align="center" justify="space-between">
        <SaksInfo sak={sak} personInformasjon={personInformasjon}/>

        {referanse && behandlingVersjon && (
          <>
            <Dropdown>
              <Button
                size={'small'}
                as={Dropdown.Toggle}
                variant={'secondary'}
                icon={<ChevronDownIcon title="chevron-saksmeny" fontSize="1.5rem" aria-hidden/>}
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
          </>
        )}
      </HStack>
    </Box>
  );
};
