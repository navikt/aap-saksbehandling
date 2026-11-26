import { BodyShort, Dropdown, HStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { lokaleBrukere } from 'lib/utils/lokaleBrukere';

export const LokalBrukerBytte = () => {
  const router = useRouter();
  const bruker = useInnloggetBruker();

  const byttBruker = (ident: string) => {
    settBrukerCookie(ident);
    router.refresh();
  };

  return (
    <Dropdown.Menu.GroupedList>
      <Dropdown.Menu.GroupedList.Heading>Bytte av roller for lokal backend</Dropdown.Menu.GroupedList.Heading>
      {lokaleBrukere.map(({ NAVident, rolle }) => (
        <Dropdown.Menu.GroupedList.Item key={NAVident} onClick={() => byttBruker(NAVident)}>
          <HStack gap={'space-4'} align={'center'}>
            <BodyShort>{rolle}</BodyShort>
            {bruker.NAVident === NAVident && <CheckmarkCircleFillIcon color={'green'} />}
          </HStack>
        </Dropdown.Menu.GroupedList.Item>
      ))}
    </Dropdown.Menu.GroupedList>
  );
};

/** Lagrer valgt lokal testbruker i ett døgn. */
function settBrukerCookie(ident: string) {
  document.cookie = `bruker=${ident}; path=/; max-age=86400; SameSite=Strict`;
}
