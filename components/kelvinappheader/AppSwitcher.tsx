'use client';

import { ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { clientConfig } from 'lib/clientApi';
import { ClientConfig } from 'lib/types/clientConfig';
import { isSuccess } from 'lib/utils/api';

export const AppSwitcher = () => {
  const [config, setConfig] = useState<ClientConfig>();

  useEffect(() => {
    clientConfig().then((config) => isSuccess(config) && setConfig(config.data));
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
          <Dropdown.Menu.GroupedList.Item
            as="a"
            target="_blank"
            href={
              'https://navno.sharepoint.com/sites/fag-og-ytelser-Kunnskapsbank-trygdemedisin?xsdata=MDV8MDJ8fGJiOWUzNjg2NDY0ODQ3YzU3ODU3MDhkZTY4N2Y1ZjQzfDYyMzY2NTM0MWVjMzQ5NjI4ODY5OWI1NTM1Mjc5ZDBifDB8MHw2MzkwNjMwOTM0MDE1ODE2NTV8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA9fDF8TDJOb1lYUnpMekU1T20xbFpYUnBibWRmV2tSVmQxbDZUWGxOUkVGMFRXcFZNRmw1TURCTmFteHRURlJuZWs5WFVYUk9SMUV5V2xSa2ExbFhWVFZPZWtwcVFIUm9jbVZoWkM1Mk1pOXRaWE56WVdkbGN5OHhOemN3TnpFeU5UTTNPRFUzfDcwMzFmYjg0NmMzMjQ2NTRiZTEyMDhkZTY4N2Y1ZjQyfDI4YjYwODg2NWNjMTQwOTlhYTg2YzczN2EwNDk2Zjc2&sdata=MWJMTWlzTmVudFVzRXhCZkJJdGFEbWJ0QnZQQnh4djlTdWgxUHF1OHp2TT0%3D'
            }
          >
            Kunnskapsbanken <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>
        </Dropdown.Menu.GroupedList>
      </Dropdown.Menu>
    </Dropdown>
  );
};
