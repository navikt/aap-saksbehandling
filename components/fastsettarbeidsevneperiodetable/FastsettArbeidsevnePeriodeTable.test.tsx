import { render, screen, within } from '@testing-library/react';
import { FastsettArbeidsevnePeriodeTable } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTable';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';

describe('fastsettArbeidsevnePeriodeTable', () => {
  beforeEach(() => {
    render(
      <FastsettArbeidsevnePeriodeTable
        perioder={[
          {
            arbeidsevne: '0',
            id: uuidv4(),
            benevning: 'timer',
            begrunnelse: 'Begrunnelse for hvorfor det finnes arbeidsevne',
            dokumenterBruktIVurderingen: ['Legeerklæring'],
            fraDato: new Date('March 25, 2024'),
          },
        ]}
        onClick={jest.fn}
      />
    );
  });

  const user = userEvent.setup();

  it('Skal ha knapp for å legge til ny periode', async () => {
    const knapp = screen.getByRole('button', { name: /legg til ny preiode/i });
    expect(knapp).toBeVisible();
  });

  it('Skal ha kolonnen Fra og med', async () => {
    const kolonne = screen.getByRole('columnheader', {
      name: /fra og med/i,
    });
    expect(kolonne).toBeVisible();
  });

  it('Skal ha kolonnen Arbeidsevne', async () => {
    const kolonne = screen.getByRole('columnheader', {
      name: /arbeidsevne/i,
    });
    expect(kolonne).toBeVisible();
  });

  it('Skal ha kolonnen Tilknyttede dokumenter', async () => {
    const kolonne = screen.getByRole('columnheader', {
      name: /tilknyttede dokumenter/i,
    });
    expect(kolonne).toBeVisible();
  });

  it('Skal ha en rad med data dersom det er en periode', async () => {
    const fraOgMedVerdi = screen.getByRole('cell', { name: /25\.03\.2024/i });
    expect(fraOgMedVerdi).toBeVisible();
    const arbeidsEvneVerdi = screen.getByRole('cell', { name: /0 timer/i });
    expect(arbeidsEvneVerdi).toBeVisible();
    const tilknyttedeDokumenterVerdi = screen.getByRole('cell', { name: /legeerklæring/i });
    expect(tilknyttedeDokumenterVerdi).toBeVisible();
  });

  it('Skal vise begrunnelse når man åpner tabellraden', async () => {
    const cell = screen.getByRole('cell', {
      name: /vis mer/i,
    });

    const knapp = within(cell).getByRole('button', {
      name: /vis mer/i,
    });

    await user.click(knapp);

    const begrunnelse = await screen.findByText('Begrunnelse for hvorfor det finnes arbeidsevne');
    expect(begrunnelse).toBeVisible();
  });
});
