import { render, screen, within } from '@testing-library/react';
import { Barn } from 'components/behandlinger/barnetillegg/barn/Barn';
import userEvent from '@testing-library/user-event';

describe('barnetillegg', () => {
  const user = userEvent.setup();

  it('skal ha en overskrift', () => {
    render(<Barn />);
    const overskrift = screen.getByText('Barnetillegg § 11-20 tredje og fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt heading', () => {
    render(<Barn />);
    const heading = screen.getByRole('group', {
      name: 'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20',
    });
    expect(heading).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt description', () => {
    render(<Barn />);

    const description = screen.getByText(
      'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen'
    );

    expect(description).toBeVisible();
  });

  it('skal ha en liste som viser hvilke dokumenter som er tilknyttet vurderingen', async () => {
    render(<Barn />);
    const rad = screen.getByRole('row', {
      name: /sykemelding/i,
    });

    await user.click(
      within(rad).getByRole('checkbox', {
        name: /tilknytt dokument til vurdering/i,
      })
    );

    const list = screen.getByRole('list', {
      name: /tilknyttede dokumenter/i,
    });

    const dokument = within(list).getByText(/sykemelding/i);
    expect(dokument).toBeVisible();
  });

  it('skal ha en heading for manuelle barn som er lagt inn av søker', () => {
    render(<Barn />);
    const heading = screen.getByText('Følgende barn er oppgitt av søker og må vurderes for barnetillegg');
    expect(heading).toBeVisible();
  });

  it('skal ha en description for manuelle barn som er lagt inn av søker', () => {
    render(<Barn />);
    const description = screen.getByText(
      'Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg'
    );
    expect(description).toBeVisible();
  });
});
