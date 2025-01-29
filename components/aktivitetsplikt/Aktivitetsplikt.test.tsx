import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { userEvent } from '@testing-library/user-event';
import { SaksInfo } from 'lib/types/types';

const user = userEvent.setup();

const sak: SaksInfo = {
  behandlinger: [],
  ident: 'ukjent',
  opprettetTidspunkt: '2019-11-11',
  periode: {
    fom: '',
    tom: '',
  },
  saksnummer: '123',
  status: 'OPPRETTET',
};

describe('Aktivitetsplikt', () => {
  it('skal ha en tabell for tidligere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} sak={sak} />);
    const overskriftTabell = screen.getByText('Tidligere brudd på aktivitetsplikten');
    expect(overskriftTabell).toBeVisible();
  });

  it('skal ha en knapp for å registrere et nytt skjema', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} sak={sak} />);
    const knapp = screen.getByRole('button', { name: 'Registrer fravær eller brudd' });
    expect(knapp).toBeVisible();
  });

  it('skal åpne skjemaet for å registrere et nytt brudd når man trykker på "registrer et nytt brudd"', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} sak={sak} />);
    expect(screen.queryByRole('group', { name: 'Velg en årsak' })).not.toBeInTheDocument();

    await åpneRegistrerNyttBruddSkjema();

    expect(screen.getByRole('group', { name: 'Velg en årsak' })).toBeVisible();
  });

  it('skal lukke skjemaet dersom man trykker på avbryt', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} sak={sak} />);
    expect(screen.queryByRole('group', { name: 'Velg en årsak' })).not.toBeInTheDocument();

    await åpneRegistrerNyttBruddSkjema();

    expect(screen.getByRole('group', { name: 'Velg en årsak' })).toBeVisible();

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    expect(screen.queryByRole('group', { name: 'Registrer brudd på aktivitetsplikt' })).not.toBeInTheDocument();
  });
});

async function åpneRegistrerNyttBruddSkjema() {
  const knapp = screen.getByRole('button', { name: 'Registrer fravær eller brudd' });
  await user.click(knapp);
}
