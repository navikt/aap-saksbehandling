'use client';

import { ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { clientConfig, clientHentAInntektRedirectUrl, clientHentSakPersoninfo } from 'lib/clientApi';
import { ClientConfig } from 'lib/types/clientTypes';
import { isError, isSuccess } from 'lib/utils/api';
import { loggUmamiEksternLenkeKlikk } from 'lib/utils/umami/lenkeKlikk';
import { useEffect, useState } from 'react';

export const AppSwitcher = () => {
  const [config, setConfig] = useState<ClientConfig>();
  const { saksnummer } = useParamsMedType();

  useEffect(() => {
    clientConfig().then((config) => isSuccess(config) && setConfig(config.data));
  }, []);

  const handleAInntektClick = async (e: React.MouseEvent) => {
    loggUmamiEksternLenkeKlikk(undefined, 'A-inntekt');
    if (saksnummer) {
      e.preventDefault();
      const response = await clientHentAInntektRedirectUrl(saksnummer);

      const url = !isError(response) ? response.data.redirectUrl : config?.aInntektUrl;
      window.open(url, '_blank');
    }
  };

  const handleGosysClick = async (e: React.MouseEvent) => {
    loggUmamiEksternLenkeKlikk(undefined, 'Gosys');
    if (saksnummer && config?.gosysUrl) {
      e.preventDefault();
      const response = await clientHentSakPersoninfo(saksnummer);
      const url = !isError(response) ? `${config.gosysUrl}/personoversikt/fnr=${response.data.fnr}` : config.gosysUrl;
      window.open(url, '_blank');
    }
  };

  const handleModiaClick = async (e: React.MouseEvent) => {
    loggUmamiEksternLenkeKlikk(undefined, 'Modia personoversikt');
    if (saksnummer && config?.modiaPersonoversiktUrl) {
      e.preventDefault();
      const response = await clientHentSakPersoninfo(saksnummer);
      const url = !isError(response)
        ? `${config.modiaPersonoversiktUrl}/person/${response.data.fnr}`
        : config.modiaPersonoversiktUrl;
      window.open(url, '_blank');
    }
  };

  const handleInst2Click = () => {
    loggUmamiEksternLenkeKlikk(undefined, 'INST2');
  };

  return (
    <Dropdown>
      <InternalHeader.Button as={Dropdown.Toggle}>
        <MenuGridIcon style={{ fontSize: '1.5rem' }} title="Systemer og oppslagsverk" />
      </InternalHeader.Button>

      <Dropdown.Menu>
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>

          <Dropdown.Menu.GroupedList.Item
            as="a"
            target="_blank"
            href={config?.gosysUrl}
            disabled={!config?.gosysUrl}
            onClick={handleGosysClick}
          >
            Gosys <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>

          <Dropdown.Menu.GroupedList.Item
            as="a"
            target="_blank"
            href={config?.modiaPersonoversiktUrl}
            disabled={!config?.modiaPersonoversiktUrl}
            onClick={handleModiaClick}
          >
            Modia personoversikt <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>

          <Dropdown.Menu.GroupedList.Item
            as="a"
            target="_blank"
            href={config?.aInntektUrl}
            disabled={!config?.aInntektUrl}
            onClick={handleAInntektClick}
          >
            A-inntekt <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>
          <Dropdown.Menu.GroupedList.Item
            as="a"
            target="_blank"
            href={config?.inst2Url}
            disabled={!config?.inst2Url}
            onClick={handleInst2Click}
          >
            INST2 <ExternalLinkIcon aria-hidden />
          </Dropdown.Menu.GroupedList.Item>
        </Dropdown.Menu.GroupedList>
      </Dropdown.Menu>
    </Dropdown>
  );
};
