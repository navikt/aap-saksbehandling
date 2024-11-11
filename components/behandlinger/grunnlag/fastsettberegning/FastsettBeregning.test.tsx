import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { userEvent } from '@testing-library/user-event';

beforeEach(() => {
  render(<FastsettBeregning readOnly={false} behandlingVersjon={0} />);
});

const user = userEvent.setup();

describe('Generelt', () => {
  it('skal ha heading for vilkårskortet', () => {
    const heading = screen.getByText('Beregningstidspunkt nedsatt arbeidsevne og ytterligere nedsatt arbeidsevne');
    expect(heading).toBeVisible();
  });

  it('Skal ha veiledningstekst for hvordan vilkåret vurderes for nedsatt arbeidsevne', () => {
    const veiledning = screen.getByText('Slik vurderes vilkåret for tidspunkt for nedsatt arbeidsevne');
    expect(veiledning).toBeVisible();
  });

  it('skal ha en overskrift for ytterlige nedsatt arbeidsevne', () => {
    const heading = screen.getByText('Tidspunkt arbeidsevne ble ytterligere nedsatt § 11-28');
    expect(heading).toBeVisible();
  });

  it('Skal ha veiledningstekst for hvordan vilkåret vurderes for ytterligere nedsatt arbeidsevne', () => {
    const veiledning = screen.getByText('Slik vurderes vilkåret for tidspunkt for ytterligere nedsatt arbeidsevne');
    expect(veiledning).toBeVisible();
  });
});

describe('Felt for å skrive begrunnelse for nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    const felt = screen.getByRole('textbox', { name: 'Vurder når innbygger fikk nedsatt arbeidsevne' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    await velgBekreft();
    const feilmelding = screen.getByText('Du må skrive en begrunnelse for når innbygger fikk nedsatt arbeidsevne');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å sette dato for nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    const felt = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    await velgBekreft();
    const feilmelding = screen.getAllByText('Du må sette en dato')[0];
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å skrive begrunnelse for ytterligere nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    const felt = screen.getByRole('textbox', { name: 'Vurder når innbygger fikk ytterligere nedsatt arbeidsevne' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    await velgBekreft();
    const feilmelding = screen.getByText(
      'Du må skrive en begrunnelse for når innbygger fikk ytterligere nedsatt arbeidsevne'
    );
    expect(feilmelding).toBeVisible();
  });
});
describe('Felt for å sette dato for ytterligere nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    const felt = screen.getByRole('textbox', { name: 'Dato arbeidsevnen ble ytterligere nedsatt' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    await velgBekreft();
    const feilmelding = screen.getAllByText('Du må sette en dato')[0];
    expect(feilmelding).toBeVisible();
  });
});

async function velgBekreft() {
  const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(bekreftKnapp);
}
