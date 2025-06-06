import { BodyShort, Dropdown, HStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Brukere = 'VEILEDER' | 'KVALITETSSIKRER' | 'SAKSBEHANDLER' | 'BESLUTTER';

export const LokalBrukerBytte = () => {
  const router = useRouter();
  const [bruker, setBruker] = useState<string | null>();

  useEffect(() => {
    const cookieValue = getCookie('bruker');
    setBruker(cookieValue);
  }, [setBruker]);

  const switchUser = (bruker: Brukere) => {
    document.cookie = `bruker=${bruker}; path=/; max-age=86400000`; // 1 dag
    setBruker(bruker);
    router.refresh();
  };

  return (
    <Dropdown.Menu.GroupedList>
      <Dropdown.Menu.GroupedList.Heading>Bytte av roller for lokal backend</Dropdown.Menu.GroupedList.Heading>
      <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('VEILEDER')}>
        <HStack gap={'1'} align={'center'}>
          <BodyShort>Veileder</BodyShort>
          {bruker === 'VEILEDER' && <CheckmarkCircleFillIcon color={'green'} />}
        </HStack>
      </Dropdown.Menu.GroupedList.Item>
      <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('KVALITETSSIKRER')}>
        <HStack gap={'1'} align={'center'}>
          <BodyShort>Kvalitetssikrer</BodyShort>
          {bruker === 'KVALITETSSIKRER' && <CheckmarkCircleFillIcon color={'green'} />}
        </HStack>
      </Dropdown.Menu.GroupedList.Item>
      <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('SAKSBEHANDLER')}>
        <HStack gap={'1'} align={'center'}>
          <BodyShort>Saksbehandler</BodyShort>
          {bruker === 'SAKSBEHANDLER' && <CheckmarkCircleFillIcon color={'green'} />}
        </HStack>
      </Dropdown.Menu.GroupedList.Item>
      <Dropdown.Menu.GroupedList.Item onClick={() => switchUser('BESLUTTER')}>
        <HStack gap={'1'} align={'center'}>
          <BodyShort>Beslutter</BodyShort>
          {bruker === 'BESLUTTER' && <CheckmarkCircleFillIcon color={'green'} />}
        </HStack>
      </Dropdown.Menu.GroupedList.Item>
    </Dropdown.Menu.GroupedList>
  );
};

function getCookie(name: string) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((coockie) => coockie.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}
