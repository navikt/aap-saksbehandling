import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FastsettArbeidsevnePeriodeForm } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import userEvent from '@testing-library/user-event';

describe('fastsettArbeidsevnePeriodeForm', () => {
  beforeEach(() => {
    render(<FastsettArbeidsevnePeriodeForm onSave={vi.fn()} onAvbryt={vi.fn()} />);
  });
  const user = userEvent.setup();

  it('Skal ha synlig vilkårsveiledning', async () => {
    const vilkårsveiledning = screen.getByText('Slik vurderes vilkåret');
    expect(vilkårsveiledning).toBeVisible();
  });

  it('Skal ha feltet begrunnelse', async () => {
    const textbox = screen.getByRole('textbox', { name: /Vurder om brukeren har arbeidsevne/i });
    expect(textbox).toBeVisible();
  });

  it('Begrunnelse skal ha feilmelding dersom ikke fyllt ut', async () => {
    await lagreArbeidsevnePeriode();

    const errorText = await screen.findByText('Du må begrunne avgjørelsen din.');
    expect(errorText).toBeVisible();

    const textbox = screen.getByRole('textbox', { name: /Vurder om brukeren har arbeidsevne/i });
    expect(textbox).toBeInvalid();
  });

  it('Skal ha feltet dokumenterBruktIVurderingen', async () => {
    const checkboxGroup = await screen.findByRole('group', { name: 'Dokumenter funnet som er relevant for vurdering' });
    expect(checkboxGroup).toBeVisible();
  });

  it('skal ha beskrivelses tekst i feltet for arbeidsevne (timer og prosent)', async () => {
    const beskrivelse = screen.getByText('sett opp mot en arbeidsuke på 37,5 timer');
    expect(beskrivelse).toBeVisible();
  });

  it('Skal ha feltet arbeidsevne (timer)', async () => {
    const textbox = screen.getByRole('textbox', {
      name: /Hvor stor er arbeidsevnen i timer?/i,
    });
    expect(textbox).toBeVisible();
  });

  it('Arbeidsevne skal ha feilmelding dersom ikke fyllt ut', async () => {
    await lagreArbeidsevnePeriode();

    const errorText = await screen.findByText('Du må angi en arbeidsevne.');
    expect(errorText).toBeVisible();

    const textbox = screen.getByRole('textbox', {
      name: /Hvor stor er arbeidsevnen i timer?/i,
    });
    expect(textbox).toBeInvalid();
  });

  it('Skal ha feltet arbeidsevne (prosent)', async () => {
    const toggle = screen.getByRole('radio', { name: /Prosent/i });
    await user.click(toggle);
    const textbox = screen.getByRole('textbox', {
      name: /Hvor stor er arbeidsevnen i prosent?/i,
    });
    expect(textbox).toBeVisible();
  });

  it('Skal ha feltet fraDato', async () => {
    const textbox = screen.getByRole('textbox', { name: /Arbeidsevnen gjelder fra og med/i });
    expect(textbox).toBeVisible();
  });

  it('Fradato skal ha feilmelding dersom ikke fyllt ut', async () => {
    await lagreArbeidsevnePeriode();

    const errorText = await screen.findByText('Du må angi når perioden med arbeidsevne starter.');
    expect(errorText).toBeVisible();

    const textbox = screen.getByRole('textbox', { name: /Arbeidsevnen gjelder fra og med/i });
    expect(textbox).toBeInvalid();
  });

  async function lagreArbeidsevnePeriode() {
    const button = screen.getByRole('button', { name: /lagre/i });
    await user.click(button);
  }
});
