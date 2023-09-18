import { render, screen } from '@testing-library/react';

import { AppHeader } from './AppHeader';
import { BrukerInformasjon } from '../../lib/services/azureUserService';

const brukerInformasjon: BrukerInformasjon = {
  navn: 'Kjell T Ringen',
};

describe('Header', () => {
  test('tegner header', async () => {
    render(<AppHeader brukerInformasjon={brukerInformasjon} />);
    expect(screen.getByText('Kelvin')).toBeVisible();
  });
});
