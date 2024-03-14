import { render, screen } from '@testing-library/react';
import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import userEvent from '@testing-library/user-event';

describe('Sykepengeerstatning', () => {
  beforeEach(() => {
    render(<Sykepengeerstatning behandlingsReferanse={'123'} />);
  });

  const user = userEvent.setup();

  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Sykepengeerstatning § 11-13' })).toBeVisible();
  });

  it('har et begrunnelsesfelt', () => {
    expect(screen.getByRole('textbox', { name: 'Vurder om søker har rett til sykepengeerstatning' })).toBeVisible();
  });

  it('har felt for krav på sykepengeerstatning', () => {
    expect(screen.getByRole('group', { name: 'Krav på sykepengeerstatning?' })).toBeVisible();
  });

  it('skal vise valg for grunn når krav på sykeerstatning er oppfylt', async () => {
    const jaValg = screen.getByRole('radio', { name: 'Ja' });
    await user.click(jaValg);

    const grunnFelt = await screen.findByRole('group', { name: 'Velg minst en grunn' });
    expect(grunnFelt).toBeVisible();
  });

  it('skal ikke vise valg for grunn når krav på sykeerstatning ikke er oppfylt', async () => {
    expect(screen.queryByRole('group', { name: 'Velg minst en grunn' })).not.toBeInTheDocument();
    const neiValg = screen.getByRole('radio', { name: 'Nei' });
    await user.click(neiValg);
    expect(screen.queryByRole('group', { name: 'Velg minst en grunn' })).not.toBeInTheDocument();
  });

  it('skal ikke vise valg for grunn når krav på sykeerstatning ikke er besvart', async () => {
    const grunnFelt = screen.queryByRole('group', { name: 'Velg minst en grunn' });
    expect(grunnFelt).not.toBeInTheDocument();
  });

  it('skal vise feilmelding dersom begrunnelse ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    const feilmelding = await screen.findByText('Du må begrunne avgjørelsen din.');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding dersom krav på sykepengeerstatning ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    const feilmelding = await screen.findByText(
      'Du må ta stilling til om søkeren har rett på AAP som sykepengeerstatning.'
    );
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding dersom krav på sykepengeerstatning er oppfylt og grunn er ikke besvart', async () => {
    const jaValg = screen.getByRole('radio', { name: 'Ja' });
    await user.click(jaValg);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    const feilmelding = await screen.findByText('Du må velge minst en grunn');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha felt med tabell for relevant dokumentasjon', () => {
    const felt = screen.getByRole('group', { name: /dokumenter funnet som er relevant for vurdering av §11-13/i });
    expect(felt).toBeVisible();
  });
});
