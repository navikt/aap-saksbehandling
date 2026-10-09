import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formaterDatoForFrontend } from 'lib/utils/date';
import { DialogMedBehandlerInfoboks } from './DialogMedBehandlerInfoboks';

describe('DialogMedBehandlerInfoboks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('viser at påminnelsen skal sendes på gitt dato', () => {
    const datoIFremtiden = '2025-01-20';

    render(<DialogMedBehandlerInfoboks påminnelseDato={datoIFremtiden} påminnelseAvbrutt={false} />);

    fireEvent.click(screen.getByRole('button', { name: /Forespørsel sendt/i }));

    expect(screen.getByText('Påminnelse')).toBeInTheDocument();
    expect(screen.getByText(`Sendes ${formaterDatoForFrontend(datoIFremtiden)}`)).toBeInTheDocument();
  });

  it('viser at påminnelsen er avbrutt', () => {
    render(<DialogMedBehandlerInfoboks påminnelseDato={'2025-01-20'} påminnelseAvbrutt={true} />);

    fireEvent.click(screen.getByRole('button', { name: /Forespørsel sendt/i }));

    expect(screen.getByText('Påminnelse')).toBeInTheDocument();
    expect(screen.getByText('Avbrutt')).toBeInTheDocument();
  });

  it('viser at påminnelsen er sendt', () => {
    const datoIFortiden = '2025-01-10';

    render(<DialogMedBehandlerInfoboks påminnelseDato={datoIFortiden} påminnelseAvbrutt={false} />);

    fireEvent.click(screen.getByRole('button', { name: /Påminnelse sendt$/i }));

    expect(screen.getAllByText(/Påminnelse sendt$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(formaterDatoForFrontend(datoIFortiden))).toBeInTheDocument();
  });
});
