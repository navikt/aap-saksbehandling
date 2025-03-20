'use client';

import { ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { clientConfig } from 'lib/clientApi';
import { ClientConfig } from 'lib/types/clientConfig';

export const AppSwitcher = () => {
  const [config, setConfig] = useState<ClientConfig>();

  useEffect(() => {
    clientConfig().then((config) => setConfig(config));
  }, []);

  return (
    <Dropdown>
      <InternalHeader.Button as={Dropdown.Toggle}>
        <MenuGridIcon style={{ fontSize: '1.5rem' }} title="Systemer og oppslagsverk" />
      </InternalHeader.Button>

      <Dropdown.Menu>
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>

          <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href={config?.gosysUrl} disabled={!config?.gosysUrl}>
            Gosys <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>

          <Dropdown.Menu.GroupedList.Item
            as="a"
            target="_blank"
            href={config?.modiaPersonoversiktUrl}
            disabled={!config?.modiaPersonoversiktUrl}
          >
            Modia personoversikt <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>
        </Dropdown.Menu.GroupedList>
      </Dropdown.Menu>
    </Dropdown>
  );
};
