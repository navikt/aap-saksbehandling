import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kelvinsøkeresultat } from 'components/kelvinsøkeresultat/Kelvinsøkeresultat';
import { SøkeResultat } from 'app/api/kelvinsok/route';

const søkeresultat: SøkeResultat = {
  harTilgang: false,
  harAdressebeskyttelse: true,
  oppgaver: [
    {
      label: '',
      href: '',
      status: '',
    },
  ],
};

describe('Kelvinsøkeresultat', () => {
  it('skal vise melding om at bruker ikke har tilgang dersom harTilgang-flagg er false', () => {
    render(<Kelvinsøkeresultat søkeresultat={søkeresultat} />);
    const melding = screen.getByText('Du har ikke tilgang til denne brukeren.');
    expect(melding).toBeVisible();
  });

  it('skal ikke vise melding om at bruker ikke har tilgang dersom harTilgang-flagg er true', () => {
    render(<Kelvinsøkeresultat søkeresultat={{ ...søkeresultat, harTilgang: true }} />);
    const melding = screen.queryByText('Du har ikke tilgang til denne brukeren.');
    expect(melding).not.toBeInTheDocument();
  });

  it('skal ikke vise melding om at bruker ikke har tilgang dersom harTilgang-flagg er false men ingen oppgaver har adressebeskyttelse', () => {
    render(
      <Kelvinsøkeresultat
        søkeresultat={{
          harTilgang: false,
          harAdressebeskyttelse: false,
          oppgaver: [
            {
              label: '',
              href: '',
              status: '',
            },
          ],
        }}
      />
    );
    const melding = screen.queryByText('Du har ikke tilgang til denne brukeren.');
    expect(melding).not.toBeInTheDocument();
  });
});
