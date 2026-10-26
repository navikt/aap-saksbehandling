import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formaterDatoForFrontend } from 'lib/utils/date';
import { DialogMedBehandlerInfoboks } from './DialogMedBehandlerInfoboks';

describe('DialogMedBehandlerInfoboks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-22T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('viser at påminnelsen skal sendes på gitt dato', () => {
    const datoIFremtiden = '2026-10-23';

    render(<DialogMedBehandlerInfoboks påminnelseDato={datoIFremtiden} påminnelseAvbrutt={false} />);

    fireEvent.click(screen.getByRole('button', { name: /Forespørsel sendt/i }));

    expect(screen.getByText('Påminnelse')).toBeInTheDocument();
    expect(screen.getByText(`Sendes ${formaterDatoForFrontend(datoIFremtiden)}`)).toBeInTheDocument();
  });

  it('viser at påminnelsen er avbrutt', () => {
    render(<DialogMedBehandlerInfoboks påminnelseDato={'2026-10-23'} påminnelseAvbrutt={true} />);

    fireEvent.click(screen.getByRole('button', { name: /Forespørsel sendt/i }));

    expect(screen.getByText('Påminnelse')).toBeInTheDocument();
    expect(screen.getByText('Avbrutt')).toBeInTheDocument();
  });

  it.skip('viser at påminnelsen er sendt', () => {
    const datoIFortiden = '2026-10-22';

    render(<DialogMedBehandlerInfoboks påminnelseDato={datoIFortiden} påminnelseAvbrutt={false} />);

    fireEvent.click(screen.getByRole('button', { name: /Påminnelse sendt$/i }));

    expect(screen.getAllByText(/Påminnelse sendt$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(formaterDatoForFrontend(datoIFortiden))).toBeInTheDocument();
  });

  it.skip('viser ikke påminnelse for forespørsler sendt før 29. september 2026', () => {
    const datoIFortiden = '2026-10-15';

    render(<DialogMedBehandlerInfoboks påminnelseDato={datoIFortiden} påminnelseAvbrutt={false} />);

    fireEvent.click(screen.getByRole('button', { name: /Forespørsel sendt$/i }));

    expect(screen.getByText('Påminnelse')).not.toBeInTheDocument();
    expect(screen.getByText(`Sendes ${formaterDatoForFrontend(datoIFortiden)}`)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Påminnelse sendt$/i).length).toBe(0);
  });
});
