import { render, screen } from '@testing-library/react';

import { AppHeader } from 'components/appheader/AppHeader';

import userEvent from '@testing-library/user-event';
import { BrukerInformasjon } from 'lib/services/azureuserservice/azureUserService';

const brukerInformasjon: BrukerInformasjon = {
  navn: 'Kjell T Ringen',
};

describe('Header', () => {
  const user = userEvent.setup();
  it('skal vise overskrift i header', async () => {
    render(<AppHeader brukerInformasjon={brukerInformasjon} />);
    expect(screen.getByText('Kelvin')).toBeVisible();
  });

  it('skal vise navnet på bruker i header', async () => {
    render(<AppHeader brukerInformasjon={brukerInformasjon} />);
    expect(screen.getByText('Kjell T Ringen')).toBeVisible();
  });

  it('skal vise knapp for å logge ut', async () => {
    render(<AppHeader brukerInformasjon={brukerInformasjon} />);

    await user.click(screen.getByText('Kjell T Ringen'));

    expect(await screen.findByText('Logg ut')).toBeVisible();
  });
});
