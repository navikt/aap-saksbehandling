import { ExternalLink, System } from '@navikt/ds-icons';
import { Link } from '@navikt/ds-react';
import { Dropdown, InternalHeader } from '@navikt/ds-react';

import styles from 'components/appheader/AppHeader.module.css';
import useSWR from "swr";

interface Brukerinfo {
  name: string;
}

interface LinkElement {
  label: string;
  href: string;
}

const links: LinkElement[] = [
  {
    label: 'Folketrygdloven, kapittel 11',
    href: 'https://lovdata.no/dokument/NL/lov/1997-02-28-19/KAPITTEL_5-7#KAPITTEL_5-7',
  },
  {
    label: 'NAV Loven, 14a',
    href: 'https://lovdata.no/dokument/NL/lov/2006-06-16-20/KAPITTEL_3#%C2%A714a',
  },
];

const Systemmeny = () => (
  <Dropdown>
    <InternalHeader.Button as={Dropdown.Toggle} style={{ marginLeft: 'auto' }}>
      <System style={{ fontSize: '1.5rem' }} title={'Systemer og oppslagsverk'} />
    </InternalHeader.Button>
    <Dropdown.Menu>
      <Dropdown.Menu.GroupedList>
        <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>
        {links.map((link) => (
          <Dropdown.Menu.GroupedList.Item key={link.label}>
            <Link href={link.href} target={'_blank'}>
              {link.label} <ExternalLink />
            </Link>
          </Dropdown.Menu.GroupedList.Item>
        ))}
      </Dropdown.Menu.GroupedList>
    </Dropdown.Menu>
  </Dropdown>
);

const Brukermeny = ({ brukerinfo }: { brukerinfo: Brukerinfo | undefined }) => {
  if (!brukerinfo) {
    return <></>;
  }
  return (
    <Dropdown>
      <InternalHeader.UserButton name={brukerinfo.name} as={Dropdown.Toggle} />
      <Dropdown.Menu>
        <Dropdown.Menu.List>
          <Dropdown.Menu.List.Item>
            <Link href={'/oauth2/logout'} className={styles.link}>
              Logg ut
            </Link>
          </Dropdown.Menu.List.Item>
        </Dropdown.Menu.List>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const AppHeader = () => {



  return (
    <InternalHeader className={styles.app__header}>
      <InternalHeader.Title href="/saksoversikt">Kelvin</InternalHeader.Title>
      <Systemmeny />
        {/*<Brukermeny brukerinfo={brukerinfo}/>*/}
    </InternalHeader>
  );
};

export { AppHeader };
