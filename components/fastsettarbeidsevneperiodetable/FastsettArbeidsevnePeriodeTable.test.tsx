import { render, screen } from '@testing-library/react';
import { FastsettArbeidsevnePeriodeTable } from 'components/fastsettarbeidsevneperiodetable/FastsettArbeidsevnePeriodeTable';
import { v4 as uuidv4 } from 'uuid';

describe('fastsettArbeidsevnePeriodeTable', () => {
  beforeEach(() => {
    render(
      <FastsettArbeidsevnePeriodeTable
        perioder={[
          {
            arbeidsevne: '0',
            id: uuidv4(),
            benevning: 'timer',
            begrunnelse: '',
            dokumenterBruktIVurderingen: [],
            fraDato: new Date(),
          },
        ]}
        onClick={jest.fn}
      />
    );
  });

  it('Skal ha knapp for å legge til ny periode', async () => {
    const knapp = screen.getByRole('button', { name: /legg til ny preiode/i });
    expect(knapp).toBeVisible();
  });
});
