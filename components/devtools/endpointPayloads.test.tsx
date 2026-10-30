import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clientSendHendelse } from 'lib/clientApi';
import { DummyLegeerklæring } from './DummyLegeerklæring';
import { SendNySoknad } from './SendNySoknad';
import { SendNySoknadUtenMedlemskap } from './SendNySoknadUtenMedlemskap';

vi.mock('lib/clientApi', () => ({
  clientSendHendelse: vi.fn().mockResolvedValue({ type: 'SUCCESS', status: 200 }),
}));

describe('devtools endpoint payloads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a medical certificate with a string reference and message discriminator', () => {
    render(<DummyLegeerklæring saksid="sak" />);

    fireEvent.click(screen.getByRole('button', { name: 'Fake mottatt legeerklæring' }));

    const [saksnummer, request] = vi.mocked(clientSendHendelse).mock.calls[0];
    expect(saksnummer).toBe('sak');
    expect(request.referanse?.verdi).toEqual(expect.any(String));
    expect(request.melding).toEqual({ meldingType: 'LegeerklæringV0' });
  });

  it('sends an application using the generated message contract', () => {
    render(<SendNySoknad saksid="sak" />);

    fireEvent.click(screen.getByRole('button', { name: 'Resend en enkel søknad' }));

    const [, request] = vi.mocked(clientSendHendelse).mock.calls[0];
    expect(request.melding).toMatchObject({
      meldingType: 'SøknadV0',
      oppgitteBarn: { barn: [], identer: [] },
    });
    expect(request.melding).not.toHaveProperty('version');
    expect(request.melding).not.toHaveProperty('barn');
  });

  it('preserves children and foreign stays in the application contract', () => {
    render(<SendNySoknadUtenMedlemskap saksid="sak" />);

    fireEvent.click(screen.getByRole('button', { name: 'Resend søknad uten medlemskap' }));

    const [, request] = vi.mocked(clientSendHendelse).mock.calls[0];
    expect(request.melding).toMatchObject({
      meldingType: 'SøknadV0',
      oppgitteBarn: {
        barn: [{ relasjon: 'FORELDER' }, { relasjon: 'FORELDER' }, { relasjon: 'FORELDER' }],
        identer: [],
      },
      medlemskap: {
        utenlandsOpphold: [{ utenlandsId: 'e98ae04c-9443-45fe-8c4f-702055df6800' }],
      },
    });
  });
});
