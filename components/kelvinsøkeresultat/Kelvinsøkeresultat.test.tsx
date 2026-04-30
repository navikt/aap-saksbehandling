import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kelvinsøkeresultat } from 'components/kelvinsøkeresultat/Kelvinsøkeresultat';
import { SøkeResultat } from 'app/api/kelvinsok/route';

const søkeresultat: SøkeResultat = {
  harTilgang: false,
  harAdressebeskyttelse: true,
  oppgaver: [
    {
      label: 'Testoppgave',
      href: '/oppgave/123',
      status: 'PÅ_VENT',
      markeringer: [],
    },
  ],
  saker: [
    {
      label: 'Testsak',
      href: '/sak/456',
    },
  ],
  person: [
    {
      label: 'Testperson',
      href: '/person/789',
    },
  ],
  kontor: [
    {
      enhet: 'Testkontor',
    },
  ],
};

const søkeresultatUtenSak: SøkeResultat = {
  harTilgang: false,
  harAdressebeskyttelse: true,
  oppgaver: [
    {
      label: 'Testoppgave',
      href: '/oppgave/123',
      status: 'PÅ_VENT',
      markeringer: [],
    },
  ],
  person: [
    {
      label: 'Testperson',
      href: null,
    },
  ],
  kontor: [
    {
      enhet: 'Testkontor',
    },
  ],
};

describe('Kelvinsøkeresultat', () => {
  it('skal ikke lenke til saksside eller behandling når saksbehandler ikke har lesetilgang', () => {
    render(<Kelvinsøkeresultat søkeresultat={{ ...søkeresultat, harTilgang: false }} />);

    const lenker = screen.queryAllByRole('link');
    expect(lenker).toHaveLength(0);

    expect(screen.getByText('Testperson')).toBeInTheDocument();
    expect(screen.getByText('Testsak')).toBeInTheDocument();
    expect(screen.getByText('Testoppgave')).toBeInTheDocument();
    expect(screen.getByText('Testkontor')).toBeInTheDocument();
  });

  it('skal vise lenker når saksbehandler har lesetilgang', () => {
    render(<Kelvinsøkeresultat søkeresultat={{ ...søkeresultat, harTilgang: true }} />);

    const lenker = screen.getAllByRole('link');
    expect(lenker.length).toBeGreaterThan(0);
  });

  it('skal vise infoboks når saksbehandler ikke har lesetilgang pga adressebeskyttelse', () => {
    render(<Kelvinsøkeresultat søkeresultat={{ ...søkeresultat, harTilgang: false }} />);

    const infotekst = screen.getByText(
      'Du har ikke tilgang til saken fordi personen er egen ansatt eller har adressebeskyttelse.'
    );
    expect(infotekst).toBeInTheDocument();
  });

  it('skal vise infoboks når saksbehandler ikke har lesetilgang uten adressebeskyttelse', () => {
    render(<Kelvinsøkeresultat søkeresultat={{ ...søkeresultat, harTilgang: false, harAdressebeskyttelse: false }} />);

    const infotekst = screen.getByText('Du har ikke tilgang til saken.');
    expect(infotekst).toBeInTheDocument();
  });

  it('skal ikke lenke til sakside når sak ikke finnes', () => {
    render(<Kelvinsøkeresultat søkeresultat={søkeresultatUtenSak} />);
    expect(screen.getByText('Fant ingen saker')).toBeInTheDocument();
    expect(screen.getByText('Testperson')).toBeInTheDocument();
  });
});
