import { render, screen, within } from '@testing-library/react';
import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import userEvent from '@testing-library/user-event';

describe('barnetillegg', () => {
  const user = userEvent.setup();

  it('skal ha en overskrift', () => {
    render(<BarnetilleggVurdering />);
    const overskrift = screen.getByText('Barnetillegg § 11-20 tredje og fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt heading', () => {
    render(<BarnetilleggVurdering />);
    const heading = screen.getByRole('group', {
      name: 'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20',
    });
    expect(heading).toBeVisible();
  });

  it('skal ha en dokumenttabell med korrekt description', () => {
    render(<BarnetilleggVurdering />);

    const description = screen.getByText(
      'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen'
    );

    expect(description).toBeVisible();
  });

  it('skal ha en liste som viser hvilke dokumenter som er tilknyttet vurderingen', async () => {
    render(<BarnetilleggVurdering />);
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
    render(<BarnetilleggVurdering />);
    const heading = screen.getByText('Følgende barn er oppgitt av søker og må vurderes for barnetillegg');
    expect(heading).toBeVisible();
  });

  it('skal ha en description for manuelle barn som er lagt inn av søker', () => {
    render(<BarnetilleggVurdering />);
    const description = screen.getByText(
      'Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg'
    );
    expect(description).toBeVisible();
  });

  it('skal ha en heading for registrerte barn fra folkeregisteret', () => {
    render(<BarnetilleggVurdering />);
    const heading = screen.getByText('Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg');
    expect(heading).toBeVisible();
  });
});
